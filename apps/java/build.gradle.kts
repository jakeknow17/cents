plugins {
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    id("org.springframework.boot") version "3.4.5"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.flywaydb.flyway") version "11.8.0"
    id("org.jooq.jooq-codegen-gradle") version "3.20.3"
}

group = "com.jacobknowlton"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
    implementation("org.flywaydb:flyway-core:11.8.0")
    implementation("org.flywaydb:flyway-database-postgresql:11.8.0")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jooq:jooq:3.20.3")
    implementation("org.postgresql:postgresql:42.7.5")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    jooqCodegen("org.jooq:jooq-codegen:3.20.3")
    jooqCodegen("org.postgresql:postgresql:42.7.5")
}

buildscript {
    dependencies {
        classpath("org.postgresql:postgresql:42.7.5")
        classpath("org.flywaydb:flyway-database-postgresql:11.8.0")
    }
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

sourceSets {
    main {
        java {
            srcDirs("src/main/kotlin", "src/generated/kotlin")
        }
    }
}


tasks.withType<Test> {
    useJUnitPlatform()
}

flyway {
    url = "jdbc:postgresql://localhost:5432/cents"
    user = "postgres"
    password = "postgres"
    cleanDisabled = false
}

jooq {
    configuration {
        jdbc {
            driver = "org.postgresql.Driver"
            url = "jdbc:postgresql://localhost:5432/cents"
            user = "postgres"
            password = "postgres"
        }

        generator {
            name = "org.jooq.codegen.KotlinGenerator"

            database {
                name = "org.jooq.meta.postgres.PostgresDatabase"
                inputSchema = "public"
                excludes = "flyway_schema_history"
            }

            target {
                packageName = "com.jacobknowlton.cents.jooq.generated"
                directory = "src/generated/kotlin"
            }

            strategy {
            	name = "org.jooq.codegen.example.JPrefixGeneratorStrategy"
            }
        }
    }
}

data class KotlinSchemaFields(
    val name: String,
    val type: String,
    val typePkg: String?,
    val isRef: Boolean,
    val isNullable: Boolean
)
data class KotlinSchema(
    val name: String,
    val pkg: String,
    val fields: List<KotlinSchemaFields>
)

val schemaSplitRegex = Regex("(?=\\[[^]]+])")
val schemaHeaderRegex = Regex("^\\s*\\[\\s*(?<pkg>[a-zA-Z.]+)\\.(?<name>[a-zA-Z]+)\\s*\\]\\s*$", RegexOption.MULTILINE)
val schemaFieldRegex = Regex("^\\s*(?<name>[a-zA-Z]+)\\s*=\\s*(?<reference>\\*)?(?:(?<package>.+)\\.)?(?<class>[a-zA-Z]*)(?<nullable>\\?)?\\s*$", RegexOption.MULTILINE)

fun parseSchemas(schemaText: String): List<KotlinSchema> {
    val schemas = mutableListOf<KotlinSchema>()

    val schemaTextPieces = schemaSplitRegex
        .split(schemaText)
        .map(String::trim)
        .filter(String::isNotEmpty)

    for (piece in schemaTextPieces) {
        var name = ""
        var pkg = ""
        schemaHeaderRegex.find(piece)?.let {
            name = it.groups["name"]!!.value
            pkg = it.groups["pkg"]!!.value
        }
        if (name.isEmpty() || pkg.isEmpty()) {
            throw IllegalArgumentException("Invalid schema header in piece: $piece")
        }
        val fieldList = mutableListOf<KotlinSchemaFields>()
        schemaFieldRegex.findAll(piece).let {
            for (match in it) {
                val name = match.groups["name"]!!.value
                val isRef = match.groups["reference"]?.value != null
                val typePkg = match.groups["package"]?.value
                val className = match.groups["class"]!!.value
                val isNullable = match.groups["nullable"]?.value != null

                // Process the field as needed
                // For example, you could log or store the field information
                fieldList += KotlinSchemaFields(
                    name = name,
                    type = className,
                    typePkg = typePkg,
                    isRef = isRef,
                    isNullable = isNullable
                )
            }
        }
        schemas += KotlinSchema(
            name = name,
            pkg = pkg,
            fields = fieldList
        )
    }
    return schemas
}

fun generateModelClass(schema: KotlinSchema, basePackage: String, outputDir: File) {
    val modelSb = StringBuilder()
    // Package declaration
    modelSb.appendLine("// This file is generated by the Cents code generator. Do not edit it directly.")
    modelSb.appendLine()
    modelSb.appendLine("package ${basePackage}.${schema.pkg}.model")
    modelSb.appendLine()
    // Import statements
    // if has type package, import it
    // if does not have type package, but is ref, import the type from the base package
    val imports = schema.fields
        .filter { it.typePkg != null }
        .map {
            if (it.isRef)
                "${basePackage}${it.typePkg}.${it.type}"
            else
                "${it.typePkg}.${it.type}"
        }
        .toMutableSet()
    imports += "java.time.OffsetDateTime" // Import for createdAt and updatedAt fields

    for (import in imports) {
        modelSb.appendLine("import $import")
    }
    modelSb.appendLine()
    // Class declaration
    modelSb.appendLine("data class ${schema.name}(")
    // Fields
    val tab = "    "
    // Id field is always present
    modelSb.appendLine("${tab}val id: Long,")
    for (field in schema.fields) {
        modelSb.appendLine("${tab}val ${field.name}: ${field.type}${if (field.isNullable) "? = null" else ""},")
    }
    // CreatedAt and updatedAt fields
    modelSb.appendLine("${tab}val createdAt: OffsetDateTime? = null,")
    modelSb.appendLine("${tab}val updatedAt: OffsetDateTime? = null,")

    modelSb.appendLine(")")


    val outFile = outputDir.resolve("${schema.pkg.replace('.', '/')}/model/${schema.name}.kt")
    outFile.parentFile.mkdirs()
    outFile.writeText(modelSb.toString())
}

fun generateRequestClass(schema: KotlinSchema, packageName: String, outputDir: File) {
}

tasks.register("generateKotlinSchemas") {
    val basePackage = "com.jacobknowlton.cents.generated"

    val inputDir = layout.projectDirectory.dir("src/main/resources/schemas")
    inputs.dir(inputDir)
    val outputRoot = layout.projectDirectory.dir("src/generated/kotlin/${basePackage.replace('.', '/')}")
    outputs.dir(outputRoot)


    doLast {
        val inDir = inputDir.asFile
        if (!inDir.exists()) {
            logger.lifecycle("No resources directory at ${inDir.absolutePath}, skipping.")
            return@doLast
        }
        logger.lifecycle("Generating Kotlin stubs from files in ${inDir.absolutePath}")

        inDir.walkTopDown()
            .filter { it.isFile }
            .forEach { file ->
                val schemas = parseSchemas(file.readText())

                for (schema in schemas) {
                    generateModelClass(schema, basePackage, outputRoot.asFile)
                }

            }
    }
}

tasks.named("compileKotlin") {
    dependsOn("generateKotlinSchemas")
}