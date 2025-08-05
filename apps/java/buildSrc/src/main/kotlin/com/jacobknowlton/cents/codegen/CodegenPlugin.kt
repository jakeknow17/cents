package com.jacobknowlton.cents.codegen

import org.gradle.api.Plugin
import org.gradle.api.Project

class CodegenPlugin : Plugin<Project> {
    override fun apply(target: Project) {
        target.tasks.register("centsCodegen") {
            val basePackage = "com.jacobknowlton.cents.generated"

            val inputDir = target.layout.projectDirectory.dir("src/main/resources/schemas")
            inputs.dir(inputDir)
            val outputRoot = target.layout.projectDirectory.dir("src/generated/kotlin/${basePackage.replace('.', '/')}")
            outputs.dir(outputRoot)


            doLast {
                val inDir = inputDir.asFile
                if (!inDir.exists()) {
                    target.logger.lifecycle("No resources directory at ${inDir.absolutePath}, skipping.")
                    return@doLast
                }
                target.logger.lifecycle("Generating Kotlin stubs from files in ${inDir.absolutePath}")

                inDir.walkTopDown()
                    .filter { it.isFile }
                    .forEach { file ->
                        val schemas = SchemaParser.parse(file.readText())

                        for (schema in schemas) {
                            val generator = ClassGenerator(schema, basePackage, outputRoot.asFile)
                            generator.apply {
                                generateModelClass()
                                generateRequestClass()
                            }
                        }
                    }
            }
        }
    }
}