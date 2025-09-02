package com.jacobknowlton.cents.codegen

data class SchemaFields(
    val name: String,
    val enumFields: List<String>?,
    val type: String,
    val typePkg: String?,
    val isRef: Boolean,
    val isNullable: Boolean,
    val isList: Boolean,
)

data class Schema(
    val name: String,
    val pkg: String,
    val fields: List<SchemaFields>
)
