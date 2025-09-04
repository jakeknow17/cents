package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.budget.repository.mapper.TagMapper
import com.jacobknowlton.cents.budget.repository.mapper.TransactionMapper
import com.jacobknowlton.cents.generated.budget.model.Transaction
import com.jacobknowlton.cents.generated.budget.model.request.TransactionRequest
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TRANSACTION
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_ACCOUNT
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TAG
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TRANSACTION_TAG
import org.jooq.DSLContext
import org.jooq.impl.DSL.multiset
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class TransactionRepository(
    private val dsl: DSLContext,
) {
    companion object {
        const val BUDGET_TRANSACTION_TAGS_FIELD = "budget_transaction_tags_field"
    }

    fun findById(id: Long): Transaction? {
        return dsl.select(
            BUDGET_TRANSACTION.asterisk(),
            BUDGET_CATEGORY.asterisk(),
            BUDGET_VENDOR.asterisk(),
            BUDGET_ACCOUNT.asterisk(),
            multiset(dsl.select(BUDGET_TAG.asterisk())
                .from(BUDGET_TAG)
                .join(BUDGET_TRANSACTION_TAG).on(BUDGET_TAG.ID.eq(BUDGET_TRANSACTION_TAG.BUDGET_TAG_ID))
                .where(BUDGET_TRANSACTION_TAG.BUDGET_TRANSACTION_ID.eq(BUDGET_TRANSACTION.ID))
            ).convertFrom { r -> r.map(TagMapper) }.`as`(BUDGET_TRANSACTION_TAGS_FIELD),
        )
            .from(BUDGET_TRANSACTION)
            .leftJoin(BUDGET_CATEGORY).on(BUDGET_TRANSACTION.BUDGET_CATEGORY_ID.eq(BUDGET_CATEGORY.ID))
            .leftJoin(BUDGET_VENDOR).on(BUDGET_TRANSACTION.BUDGET_VENDOR_ID.eq(BUDGET_VENDOR.ID))
            .leftJoin(BUDGET_ACCOUNT).on(BUDGET_TRANSACTION.BUDGET_ACCOUNT_ID.eq(BUDGET_ACCOUNT.ID))
            .where(BUDGET_TRANSACTION.ID.eq(id))
            .fetchOne(TransactionMapper)
    }

    fun findAll(offset: Int = 0, limit: Int = 100): List<Transaction> {
        return dsl.select(
            BUDGET_TRANSACTION.asterisk(),
            BUDGET_CATEGORY.asterisk(),
            BUDGET_VENDOR.asterisk(),
            BUDGET_ACCOUNT.asterisk(),
            multiset(dsl.select(BUDGET_TAG.asterisk())
                .from(BUDGET_TAG)
                .join(BUDGET_TRANSACTION_TAG).on(BUDGET_TAG.ID.eq(BUDGET_TRANSACTION_TAG.BUDGET_TAG_ID))
                .where(BUDGET_TRANSACTION_TAG.BUDGET_TRANSACTION_ID.eq(BUDGET_TRANSACTION.ID))
            ).convertFrom { r -> r.map(TagMapper) }.`as`(BUDGET_TRANSACTION_TAGS_FIELD),
        )
            .from(BUDGET_TRANSACTION)
            .leftJoin(BUDGET_CATEGORY).on(BUDGET_TRANSACTION.BUDGET_CATEGORY_ID.eq(BUDGET_CATEGORY.ID))
            .leftJoin(BUDGET_VENDOR).on(BUDGET_TRANSACTION.BUDGET_VENDOR_ID.eq(BUDGET_VENDOR.ID))
            .leftJoin(BUDGET_ACCOUNT).on(BUDGET_TRANSACTION.BUDGET_ACCOUNT_ID.eq(BUDGET_ACCOUNT.ID))
            .orderBy(BUDGET_TRANSACTION.TRANSACTION_DATE.desc())
            .offset(offset)
            .limit(limit)
            .fetch(TransactionMapper)
    }

    @Transactional
    fun create(tx: TransactionRequest): Transaction {
        // Example mappings — rename fields if needed
        val insertedId = dsl.insertInto(BUDGET_TRANSACTION)
            .set(BUDGET_TRANSACTION.TRANSACTION_DATE, tx.date)
            .set(BUDGET_TRANSACTION.AMOUNT, tx.amount)
            .set(BUDGET_TRANSACTION.TYPE, tx.type.name)
            .set(BUDGET_TRANSACTION.DESCRIPTION, tx.description)
            .set(BUDGET_TRANSACTION.NOTES, tx.notes)
            .set(BUDGET_TRANSACTION.BUDGET_CATEGORY_ID, tx.categoryId)
            .set(BUDGET_TRANSACTION.BUDGET_VENDOR_ID, tx.vendorId)
            .set(BUDGET_TRANSACTION.BUDGET_ACCOUNT_ID, tx.accountId)
            .returning(BUDGET_TRANSACTION.ID)
            .fetchOne()
            ?.get(BUDGET_TRANSACTION.ID)

        if (insertedId == null) {
            throw IllegalStateException("Failed to insert transaction, no ID returned")
        }

        if (tx.tagsIds.isNotEmpty()) {
            dsl.batch(
            tx.tagsIds.map { tagId ->
                dsl.insertInto(BUDGET_TRANSACTION_TAG)
                    .set(BUDGET_TRANSACTION_TAG.BUDGET_TRANSACTION_ID, insertedId)
                    .set(BUDGET_TRANSACTION_TAG.BUDGET_TAG_ID, tagId)
            }
            ).execute()
        }

        return requireNotNull(findById(insertedId)) { "Failed to load created transaction id=$insertedId" }
    }

    @Transactional
    fun update(id: Long, tx: TransactionRequest): Transaction? {
        val rows = dsl.update(BUDGET_TRANSACTION)
            .set(BUDGET_TRANSACTION.TRANSACTION_DATE, tx.date)
            .set(BUDGET_TRANSACTION.AMOUNT, tx.amount)
            .set(BUDGET_TRANSACTION.TYPE, tx.type.name)
            .set(BUDGET_TRANSACTION.DESCRIPTION, tx.description)
            .set(BUDGET_TRANSACTION.NOTES, tx.notes)
            .set(BUDGET_TRANSACTION.BUDGET_CATEGORY_ID, tx.categoryId)
            .set(BUDGET_TRANSACTION.BUDGET_VENDOR_ID, tx.vendorId)
            .set(BUDGET_TRANSACTION.BUDGET_ACCOUNT_ID, tx.accountId)
            .where(BUDGET_TRANSACTION.ID.eq(id))
            .execute()

        if (rows == 0) return null

        // If tags is non-null, treat as source of truth: replace links with provided set
        tx.tagsIds.let { tags ->
            dsl.deleteFrom(BUDGET_TRANSACTION_TAG)
                .where(BUDGET_TRANSACTION_TAG.BUDGET_TRANSACTION_ID.eq(id))
                .execute()

            if (tx.tagsIds.isNotEmpty()) {
                dsl.batch(
                    tx.tagsIds.map { tagId ->
                        dsl.insertInto(BUDGET_TRANSACTION_TAG)
                            .set(BUDGET_TRANSACTION_TAG.BUDGET_TRANSACTION_ID, id)
                            .set(BUDGET_TRANSACTION_TAG.BUDGET_TAG_ID, tagId)
                    }
                ).execute()
            }
        }

        return findById(id)
    }

    @Transactional
    fun delete(id: Long): Boolean {
        // Remove tag links first due to FK constraints
        dsl.deleteFrom(BUDGET_TRANSACTION_TAG)
            .where(BUDGET_TRANSACTION_TAG.BUDGET_TRANSACTION_ID.eq(id))
            .execute()

        val rows = dsl.deleteFrom(BUDGET_TRANSACTION)
            .where(BUDGET_TRANSACTION.ID.eq(id))
            .execute()

        return rows > 0
    }
}
