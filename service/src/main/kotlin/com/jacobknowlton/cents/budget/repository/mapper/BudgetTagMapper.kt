package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.generated.budget.model.BudgetTag
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TAG
import org.jooq.Record
import org.jooq.RecordMapper
import java.time.OffsetDateTime

class BudgetTagMapper: RecordMapper<Record, BudgetTag> {
        override fun map(record: Record?): BudgetTag? {
            return record?.let {
                BudgetTag(
                    id = it.getValue(BUDGET_TAG.ID, Long::class.java),
                    name = it.getValue(BUDGET_TAG.NAME, String::class.java),
                    createdAt = it.getValue(BUDGET_TAG.CREATED_AT, OffsetDateTime::class.java),
                    updatedAt = it.getValue(BUDGET_TAG.UPDATED_AT, OffsetDateTime::class.java)
                )
            }
        }
}