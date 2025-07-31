package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.budget.model.BudgetCategory
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import org.jooq.Record
import org.jooq.RecordMapper
import java.math.BigDecimal
import java.time.OffsetDateTime

class BudgetCategoryMapper : RecordMapper<Record, BudgetCategory> {
    override fun map(record: Record?): BudgetCategory? {
        return record?.let {
            BudgetCategory(
                iid = it.getValue(BUDGET_CATEGORY.IID, Long::class.java),
                uid = it.getValue(BUDGET_CATEGORY.UID, String::class.java),
                name = it.getValue(BUDGET_CATEGORY.NAME, String::class.java),
                budgetLimit = it.getValue(BUDGET_CATEGORY.BUDGET_LIMIT, BigDecimal::class.java),
                createdAt = it.getValue(BUDGET_CATEGORY.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.getValue(BUDGET_CATEGORY.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}