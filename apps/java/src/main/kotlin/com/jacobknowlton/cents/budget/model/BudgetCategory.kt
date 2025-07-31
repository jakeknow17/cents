package com.jacobknowlton.cents.budget.model

import java.math.BigDecimal
import java.time.OffsetDateTime

data class BudgetCategory(
    val id: Long? = null,
    val name: String,
    val budgetLimit: BigDecimal,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime
) {
    init {
        require(name.length <= 255) { "Name must be 255 characters or less" }
        require(budgetLimit >= BigDecimal.ZERO) { "Budget limit must be non-negative" }
    }
}