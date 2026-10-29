allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

// Some plugin modules still declare a low `compileSdk` (34) in their Groovy
// build scripts. With this toolchain those modules end up compiled without the
// Android boot classpath, failing with "package android.os does not exist".
// Pin every plugin module to the app's compileSdk before AGP finalises it.
// This `afterEvaluate` is registered during root evaluation, so it runs before
// the Android plugin's own `afterEvaluate`.
subprojects {
    if (name == "app") return@subprojects
    afterEvaluate {
        val androidExtension = extensions.findByName("android") ?: return@afterEvaluate
        try {
            androidExtension.withGroovyBuilder {
                try {
                    setProperty("compileSdk", 36)
                } catch (missingProperty: Exception) {
                    invokeMethod("compileSdkVersion", 36)
                }
            }
        } catch (e: Exception) {
            logger.lifecycle("Could not pin compileSdk for :$name (${e.message})")
        }
    }
}

// TEMP DIAGNOSTICS
gradle.projectsEvaluated {
    subprojects.forEach { sp ->
        val androidExtension = sp.extensions.findByName("android")
        val compileSdkValue: Any? = try {
            androidExtension?.withGroovyBuilder { getProperty("compileSdk") }
        } catch (e: Exception) {
            "n/a"
        }
        val javac = sp.tasks.findByName("compileDebugJavaWithJavac") as? JavaCompile
        val bootClasspath = javac?.options?.bootstrapClasspath?.files?.joinToString(",") { it.name } ?: "none"
        val classpathCount = javac?.classpath?.files?.size ?: -1
        println("DIAG :$sp.name compileSdk=$compileSdkValue bootClasspath=$bootClasspath classpathCount=$classpathCount")
    }
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}

// Align every Flutter plugin module (everything except :app) to JVM target 17.
// Plugins like home_widget compile their Kotlin at JVM 1.8 by default, which fails
// under Kotlin 2.x when they inline androidx/coroutines code (JVM 11 bytecode):
//   "Cannot inline bytecode built with JVM target 11 into bytecode that is being
//    built with JVM target 1.8."
// :app keeps its own Java 17 / JVM 17 settings from the Flutter template.
gradle.projectsEvaluated {
    subprojects
        .filter { it.name != "app" }
        .forEach { sp ->
            sp.tasks.withType<JavaCompile>().configureEach {
                sourceCompatibility = "17"
                targetCompatibility = "17"
            }
            sp.tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile::class.java).configureEach {
                compilerOptions.jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
            }
        }
}
