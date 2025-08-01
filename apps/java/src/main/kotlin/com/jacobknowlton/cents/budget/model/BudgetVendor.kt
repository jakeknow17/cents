package com.jacobknowlton.cents.budget.model

import java.time.OffsetDateTime

data class BudgetVendor(
    val id: Long,
    val name: String,
    val createdAt: OffsetDateTime? = null,
    val updatedAt: OffsetDateTime? = null
) {
    init {
        require(id >= 0) { "Vendor id cannot be negative" }
        require(name.length <= 255) { "Name must be 255 characters or less" }
    }
}
