package com.jacobknowlton.cents.budget.model.requests

import java.time.LocalDate

data class BudgetEntryRequest(
    val entryDate: LocalDate,
    val notes: String,
    val categoryId: Long?,
    val vendorId: Long?,
)