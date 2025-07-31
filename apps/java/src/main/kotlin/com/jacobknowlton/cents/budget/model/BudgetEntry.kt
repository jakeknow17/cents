package com.jacobknowlton.cents.budget.model

import java.time.LocalDate
import java.time.OffsetDateTime

data class BudgetEntry(
    val iid: Long,
    val uid: String,
    val entryDate: LocalDate,
    val notes: String,
    val category: BudgetCategory?,
    val vendor: BudgetVendor?,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime
) {
    init {
        require(uid.length == 21) { "UID must be exactly 21 characters long" }
        require(notes.length <= 1000) { "Notes must be 1000 characters or less" }
    }
}