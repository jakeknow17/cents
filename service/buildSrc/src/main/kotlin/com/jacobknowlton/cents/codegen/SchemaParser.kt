package com.jacobknowlton.cents.codegen

object SchemaParser {
    private val SCHEMA_SPLIT_REGEX = Regex("(?=\\[[^]]+])")
    private val SCHEMA_HEADER_REGEX =
        Regex("^\\s*\\[\\s*(?<pkg>[a-zA-Z.]+)\\.(?<name>[a-zA-Z]+)\\s*]\\s*$", RegexOption.MULTILINE)
    private val SCHEMA_FIELD_REGEX = Regex(
        "^\\s*(?<name>[a-zA-Z]+)\\s*=\\s*(?<reference>\\*)?(?:(?<package>.+)\\.)?(?<class>[a-zA-Z]*|\\{\\s*[a-zA-Z]+\\s*(?:\\|\\s*[a-zA-Z]+\\s*)*})(?<nullable>\\?)?(?<list>\\[])?\\s*\$",
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
            SCHEMA_FIELD_REGEX.findAll(piece).let { matches ->
                for (match in matches) {
                    val fieldName = match.groups["name"]!!.value
                    val isRef = match.groups["reference"]?.value != null
                    val typePkg = match.groups["package"]?.value
                    var className = match.groups["class"]!!.value
                    val isNullable = match.groups["nullable"]?.value != null
                    val isList = match.groups["list"]?.value != null

                    val enumFields = if (className.startsWith("{")) {
                        className
                            .removePrefix("{")
                            .removeSuffix("}")
                            .split("|")
                    } else {
                        null
                    }

                    if (enumFields != null) {
                        className = fieldName.replaceFirstChar {
                            if (it.isLowerCase()) it.titlecase() else it.toString()
                        }
                    }

                    fieldList += SchemaFields(
                        name = fieldName,
                        enumFields = enumFields,
                        type = className,
                        typePkg = typePkg,
                        isRef = isRef,
                        isNullable = isNullable,
                        isList = isList,
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