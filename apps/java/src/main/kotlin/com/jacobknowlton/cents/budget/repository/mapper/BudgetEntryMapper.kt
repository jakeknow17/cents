package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.generated.budget.model.BudgetEntry
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_ENTRY
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import org.jooq.Record
import org.jooq.RecordMapper
import java.time.LocalDate
import java.time.OffsetDateTime

class BudgetEntryMapper(
    private val categoryMapper: BudgetCategoryMapper = BudgetCategoryMapper(),
    private val vendorMapper: BudgetVendorMapper = BudgetVendorMapper()
) : RecordMapper<Record, BudgetEntry> {
    override fun map(record: Record?): BudgetEntry? {
        return record?.let {
            val categoryRecord = it.into(BUDGET_CATEGORY)
            val vendorRecord   = it.into(BUDGET_VENDOR)

            BudgetEntry(
                id = it.getValue(BUDGET_ENTRY.ID, Long::class.java),
                entryDate = it.getValue(BUDGET_ENTRY.ENTRY_DATE, LocalDate::class.java),
                notes = it.getValue(BUDGET_ENTRY.NOTES, String::class.java),
                category = if (categoryRecord.get(BUDGET_CATEGORY.ID) != null) categoryMapper.map(categoryRecord) else null,
                vendor = if (vendorRecord.get(BUDGET_VENDOR.ID) != null) vendorMapper.map(vendorRecord) else null,
                createdAt = it.getValue(BUDGET_ENTRY.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.getValue(BUDGET_ENTRY.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}