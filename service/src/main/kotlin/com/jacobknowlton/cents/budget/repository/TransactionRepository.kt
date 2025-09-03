package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.budget.repository.mapper.TagMapper
import com.jacobknowlton.cents.budget.repository.mapper.TransactionMapper
import com.jacobknowlton.cents.generated.budget.model.Transaction
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TRANSACTION
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_ACCOUNT
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TAG
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TRANSACTION_TAG
import org.jooq.DSLContext
import org.jooq.impl.DSL.multiset
import org.springframework.stereotype.Repository

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
            multiset(dsl.select(
                BUDGET_TAG.ID,
                BUDGET_TAG.NAME,
                BUDGET_TAG.CREATED_AT,
                BUDGET_TAG.UPDATED_AT
            )
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
}
