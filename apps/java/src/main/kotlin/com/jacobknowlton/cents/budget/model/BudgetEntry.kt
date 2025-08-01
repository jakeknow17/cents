package com.jacobknowlton.cents.budget.model

import java.time.LocalDate
import java.time.OffsetDateTime

data class BudgetEntry(
    val id: Long,
    val entryDate: LocalDate,
    val notes: String,
    val category: BudgetCategory?,
    val vendor: BudgetVendor?,
    val createdAt: OffsetDateTime? = null,
    val updatedAt: OffsetDateTime? = null
) {
    init {
        require(id >= 0) { "Entry id cannot be negative" }
        require(notes.length <= 1000) { "Notes must be 1000 characters or less" }
    }
}