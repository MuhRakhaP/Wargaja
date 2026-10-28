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
