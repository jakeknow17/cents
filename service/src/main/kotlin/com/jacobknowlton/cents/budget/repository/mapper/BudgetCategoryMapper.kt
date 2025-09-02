package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.generated.budget.model.BudgetCategory
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import org.jooq.Record
import org.jooq.RecordMapper
import java.math.BigDecimal
import java.time.OffsetDateTime

object BudgetCategoryMapper : RecordMapper<Record, BudgetCategory> {
    override fun map(record: Record?): BudgetCategory? {
        return record?.let {
            BudgetCategory(
                id = it.get(BUDGET_CATEGORY.ID, Long::class.java),
                name = it.get(BUDGET_CATEGORY.NAME, String::class.java),
                amount = it.get(BUDGET_CATEGORY.AMOUNT, BigDecimal::class.java),
                color = it.get(BUDGET_CATEGORY.COLOR, String::class.java),
                createdAt = it.get(BUDGET_CATEGORY.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.get(BUDGET_CATEGORY.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}