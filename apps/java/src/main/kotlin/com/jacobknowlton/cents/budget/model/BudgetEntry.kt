package com.jacobknowlton.cents.budget.model

import java.time.LocalDate
import java.time.OffsetDateTime

data class BudgetEntry(
    val id: Long? = null,
    val entryDate: LocalDate,
    val notes: String,
    val category: BudgetCategory?,
    val vendor: BudgetVendor?,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime
) {
    init {
        require(notes.length <= 1000) { "Notes must be 1000 characters or less" }
    }
}