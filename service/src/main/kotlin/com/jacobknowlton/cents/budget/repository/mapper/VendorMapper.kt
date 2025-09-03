package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.generated.budget.model.Vendor
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import org.jooq.Record
import org.jooq.RecordMapper
import java.time.OffsetDateTime

object VendorMapper : RecordMapper<Record, Vendor> {
    override fun map(record: Record?): Vendor? {
        return record?.let {
            Vendor(
                id = it.get(BUDGET_VENDOR.ID, Long::class.java),
                name = it.get(BUDGET_VENDOR.NAME, String::class.java),
                link = it.get(BUDGET_VENDOR.LINK, String::class.java),
                createdAt = it.get(BUDGET_VENDOR.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.get(BUDGET_VENDOR.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}