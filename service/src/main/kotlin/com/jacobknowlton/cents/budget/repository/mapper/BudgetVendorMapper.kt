package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.generated.budget.model.BudgetVendor
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import org.jooq.Record
import org.jooq.RecordMapper
import java.time.OffsetDateTime

class BudgetVendorMapper : RecordMapper<Record, BudgetVendor> {
    override fun map(record: Record?): BudgetVendor? {
        return record?.let {
            BudgetVendor(
                id = it.getValue(BUDGET_VENDOR.ID, Long::class.java),
                name = it.getValue(BUDGET_VENDOR.NAME, String::class.java),
                createdAt = it.getValue(BUDGET_VENDOR.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.getValue(BUDGET_VENDOR.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}