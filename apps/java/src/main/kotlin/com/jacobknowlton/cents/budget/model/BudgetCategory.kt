package com.jacobknowlton.cents.budget.model

import java.math.BigDecimal
import java.time.OffsetDateTime

data class BudgetCategory(
    val id: Long,
    val name: String,
    val budgetLimit: BigDecimal,
    val createdAt: OffsetDateTime? = null,
    val updatedAt: OffsetDateTime? = null
) {
    init {
        require(id >= 0) { "Category id cannot be negative" }
        require(name.length <= 255) { "Name must be 255 characters or less" }
        require(budgetLimit >= BigDecimal.ZERO) { "Budget limit must be non-negative" }
    }
}