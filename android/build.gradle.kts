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

// Flutter plugins ship their Kotlin with `jvmTarget = 1.8`, while the androidx /
// coroutines artifacts they inline are compiled for JVM 11. That combination makes
// Kotlin 2.x fail with "Cannot inline bytecode built with JVM target 11 into
// bytecode that is being built with JVM target 1.8" (e.g. :home_widget:compileReleaseKotlin).
// Compile plugin Kotlin with JVM 17, matching the JDK used by CI. Java compilation
// and the Android boot classpath are left untouched.
gradle.projectsEvaluated {
    subprojects
        .filter { it.name != "app" }
        .forEach { sp ->
            sp.tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile::class.java).configureEach {
                compilerOptions.jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
            }
        }
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
