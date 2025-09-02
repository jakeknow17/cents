package com.jacobknowlton.cents.budget.repository.mapper

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

class BudgetTransactionMapper : RecordMapper<Record, BudgetTransaction> {
    private val budgetCategoryMapper = BudgetCategoryMapper()
    private val budgetVendorMapper = BudgetVendorMapper()
    private val budgetAccountMapper = BudgetAccountMapper()

    override fun map(record: Record?): BudgetTransaction? {
        return record?.let {
            val categoryRecord = it.into(BUDGET_CATEGORY)
            val vendorRecord   = it.into(BUDGET_VENDOR)
            val accountRecord   = it.into(BUDGET_ACCOUNT)

            BudgetTransaction(
                id = it.getValue(BUDGET_TRANSACTION.ID, Long::class.java),
                date = it.getValue(BUDGET_TRANSACTION.TRANSACTION_DATE, LocalDate::class.java),
                amount = it.getValue(BUDGET_TRANSACTION.AMOUNT, BigDecimal::class.java),
                type = enumValueOf<BudgetTransaction.Type>(it.getValue(BUDGET_TRANSACTION.TYPE, String::class.java)),
                description = it.getValue(BUDGET_TRANSACTION.DESCRIPTION, String::class.java),
                notes = it.getValue(BUDGET_TRANSACTION.NOTES, String::class.java),
                budgetTags = listOf(), // TODO: See if this can be populated here
                budgetCategory = if (categoryRecord.get(BUDGET_CATEGORY.ID) != null) budgetCategoryMapper.map(categoryRecord) else null,
                budgetVendor = if (vendorRecord.get(BUDGET_VENDOR.ID) != null) budgetVendorMapper.map(vendorRecord) else null,
                budgetAccount = if (accountRecord.get(BUDGET_ACCOUNT.ID) != null) budgetAccountMapper.map(accountRecord) else null,
                createdAt = it.getValue(BUDGET_TRANSACTION.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.getValue(BUDGET_TRANSACTION.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}