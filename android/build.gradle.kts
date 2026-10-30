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
// coroutines artifacts they depend on (home_widget pulls them with dynamic
// versions like `work-runtime-ktx:2.+`) are now compiled for JVM 11. Kotlin 2.x
// then fails with "Cannot inline bytecode built with JVM target 11 into bytecode
// that is being built with JVM target 1.8" on :home_widget:compileReleaseKotlin.
// Compile plugin Kotlin at JVM 11 instead. Java compilation is left alone so AGP
// keeps providing the Android boot classpath, and the Java/Kotlin target mismatch
// is downgraded to a warning via kotlin.jvm.target.validation.mode in gradle.properties.
gradle.projectsEvaluated {
    subprojects
        .filter { it.name != "app" }
        .forEach { sp ->
            sp.tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile::class.java).configureEach {
                compilerOptions.jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_11)
            }
        }
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
