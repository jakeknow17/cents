plugins {
    `kotlin-dsl`
}

repositories {
    mavenCentral()
}

gradlePlugin {
    plugins {
        create("cents-codegen") {
            id = "cents-codegen"
            // This maps the plugin ID to your new plugin class.
            implementationClass = "com.jacobknowlton.cents.codegen.CodegenPlugin"
        }
    }
}
