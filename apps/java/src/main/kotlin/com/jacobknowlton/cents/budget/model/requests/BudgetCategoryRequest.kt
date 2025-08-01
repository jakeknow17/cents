package com.jacobknowlton.cents.budget.model.requests

import java.math.BigDecimal

data class BudgetCategoryRequest(
    val name: String,
    val budgetLimit: BigDecimal,
)