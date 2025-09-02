package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.generated.budget.model.BudgetAccount
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_ACCOUNT
import org.jooq.Record
import org.jooq.RecordMapper
import java.time.OffsetDateTime

class BudgetAccountMapper : RecordMapper<Record, BudgetAccount> {
    override fun map(record: Record?): BudgetAccount? {
        return record?.let {
            BudgetAccount(
                id = it.getValue(BUDGET_ACCOUNT.ID, Long::class.java),
                name = it.getValue(BUDGET_ACCOUNT.NAME, String::class.java),
                type = enumValueOf<BudgetAccount.Type>(it.getValue(BUDGET_ACCOUNT.TYPE, String::class.java)),
                createdAt = it.getValue(BUDGET_ACCOUNT.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.getValue(BUDGET_ACCOUNT.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}