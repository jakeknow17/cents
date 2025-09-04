package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.budget.repository.TransactionRepository
import com.jacobknowlton.cents.generated.budget.model.Tag
import com.jacobknowlton.cents.generated.budget.model.Transaction
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_ACCOUNT
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TRANSACTION
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import org.jooq.Record
import org.jooq.RecordMapper
import java.math.BigDecimal
import java.time.LocalDate
import java.time.OffsetDateTime

object TransactionMapper : RecordMapper<Record, Transaction> {
    override fun map(record: Record?): Transaction? {
        return record?.let {
            Transaction(
                id = it.get(BUDGET_TRANSACTION.ID, Long::class.java),
                date = it.get(BUDGET_TRANSACTION.TRANSACTION_DATE, LocalDate::class.java),
                amount = it.get(BUDGET_TRANSACTION.AMOUNT, BigDecimal::class.java),
                type = enumValueOf<Transaction.Type>(it.get(BUDGET_TRANSACTION.TYPE, String::class.java)),
                description = it.get(BUDGET_TRANSACTION.DESCRIPTION, String::class.java),
                notes = it.get(BUDGET_TRANSACTION.NOTES, String::class.java),
                tags = try {
                    it.get(TransactionRepository.BUDGET_TRANSACTION_TAGS_FIELD, List::class.java)
                        .filterIsInstance<Tag>()
                } catch (_: Exception) {
                    emptyList()
                },
                category = if (it.get(BUDGET_CATEGORY.ID) != null) CategoryMapper.map(it) else null,
                vendor = if (it.get(BUDGET_VENDOR.ID) != null) VendorMapper.map(it) else null,
                account = if (it.get(BUDGET_ACCOUNT.ID) != null) AccountMapper.map(it) else null,
                createdAt = it.get(BUDGET_TRANSACTION.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.get(BUDGET_TRANSACTION.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}