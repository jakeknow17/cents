package com.jacobknowlton.cents.budget.model

import java.time.OffsetDateTime

data class BudgetVendor(
    val iid: Long,
    val uid: String,
    val name: String,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime
) {
    init {
        require(uid.length == 21) { "UID must be exactly 21 characters long" }
        require(name.length <= 255) { "Name must be 255 characters or less" }
    }
}
