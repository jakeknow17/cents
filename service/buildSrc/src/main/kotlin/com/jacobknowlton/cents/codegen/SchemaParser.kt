package com.jacobknowlton.cents.codegen

object SchemaParser {
    val SCHEMA_SPLIT_REGEX = Regex("(?=\\[[^]]+])")
    val SCHEMA_HEADER_REGEX =
        Regex("^\\s*\\[\\s*(?<pkg>[a-zA-Z.]+)\\.(?<name>[a-zA-Z]+)\\s*\\]\\s*$", RegexOption.MULTILINE)
    val SCHEMA_FIELD_REGEX = Regex(
        "^\\s*(?<name>[a-zA-Z]+)\\s*=\\s*(?<reference>\\*)?(?:(?<package>.+)\\.)?(?<class>[a-zA-Z]*)(?<nullable>\\?)?\\s*$",
        RegexOption.MULTILINE
    )

    fun parse(schemaText: String): List<Schema> {
        val schemas = mutableListOf<Schema>()

        val schemaTextPieces = SCHEMA_SPLIT_REGEX
            .split(schemaText)
            .map(String::trim)
            .filter(String::isNotEmpty)

        for (piece in schemaTextPieces) {
            var name = ""
            var pkg = ""
            SCHEMA_HEADER_REGEX.find(piece)?.let {
                name = it.groups["name"]!!.value
                pkg = it.groups["pkg"]!!.value
            }
            if (name.isEmpty() || pkg.isEmpty()) {
                throw IllegalArgumentException("Invalid schema header in piece: $piece")
            }
            val fieldList = mutableListOf<SchemaFields>()
            SCHEMA_FIELD_REGEX.findAll(piece).let {
                for (match in it) {
                    val fieldName = match.groups["name"]!!.value
                    val isRef = match.groups["reference"]?.value != null
                    val typePkg = match.groups["package"]?.value
                    val className = match.groups["class"]!!.value
                    val isNullable = match.groups["nullable"]?.value != null

                    fieldList += SchemaFields(
                        name = fieldName,
                        type = className,
                        typePkg = typePkg,
                        isRef = isRef,
                        isNullable = isNullable
                    )
                }
            }
            schemas += Schema(
                name = name,
                pkg = pkg,
                fields = fieldList
            )
        }
        return schemas
    }
}