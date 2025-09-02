package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.budget.repository.BudgetTransactionRepository
import com.jacobknowlton.cents.generated.budget.model.BudgetTag
import com.jacobknowlton.cents.generated.budget.model.BudgetTransaction
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_ACCOUNT
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TRANSACTION
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import org.jooq.Record
import org.jooq.RecordMapper
import java.math.BigDecimal
import java.time.LocalDate
import java.time.OffsetDateTime

object BudgetTransactionMapper : RecordMapper<Record, BudgetTransaction> {
    override fun map(record: Record?): BudgetTransaction? {
        return record?.let {
            BudgetTransaction(
                id = it.get(BUDGET_TRANSACTION.ID, Long::class.java),
                date = it.get(BUDGET_TRANSACTION.TRANSACTION_DATE, LocalDate::class.java),
                amount = it.get(BUDGET_TRANSACTION.AMOUNT, BigDecimal::class.java),
                type = enumValueOf<BudgetTransaction.Type>(it.get(BUDGET_TRANSACTION.TYPE, String::class.java)),
                description = it.get(BUDGET_TRANSACTION.DESCRIPTION, String::class.java),
                notes = it.get(BUDGET_TRANSACTION.NOTES, String::class.java),
                budgetTags = it.get(BudgetTransactionRepository.BUDGET_TRANSACTION_TAGS_FIELD, List::class.java).filterIsInstance<BudgetTag>(),
                budgetCategory = if (it.get(BUDGET_CATEGORY.ID) != null) BudgetCategoryMapper.map(it) else null,
                budgetVendor = if (it.get(BUDGET_VENDOR.ID) != null) BudgetVendorMapper.map(it) else null,
                budgetAccount = if (it.get(BUDGET_ACCOUNT.ID) != null) BudgetAccountMapper.map(it) else null,
                createdAt = it.get(BUDGET_TRANSACTION.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.get(BUDGET_TRANSACTION.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}