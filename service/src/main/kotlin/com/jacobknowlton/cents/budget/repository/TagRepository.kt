package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.budget.repository.mapper.TagMapper
import com.jacobknowlton.cents.generated.budget.model.Tag
import com.jacobknowlton.cents.generated.budget.model.request.TagRequest
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TAG
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TRANSACTION_TAG
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class TagRepository(
    private val dsl: DSLContext,
) {
    companion object {
        const val BUDGET_TAGS_TRANSACTION_FIELD = "budget_tags_transaction_field"
    }

    // Does not populate Tag.transactions
    fun findById(id: Long): Tag? {
        return dsl.select()
            .from(BUDGET_TAG)
            .where(BUDGET_TAG.ID.eq(id))
            .fetchOne(TagMapper)
    }

    // Does not populate Tag.transactions
    fun findAll(offset: Int = 0, limit: Int = 100): List<Tag> {
        return dsl.select()
            .from(BUDGET_TAG)
            .orderBy(BUDGET_TAG.NAME.asc())
            .offset(offset)
            .limit(limit)
            .fetch(TagMapper)
    }

    @Transactional
    fun create(tagRequest: TagRequest): Tag {
        val insertedId = dsl.insertInto(BUDGET_TAG)
            .set(BUDGET_TAG.NAME, tagRequest.name)
            .returning(BUDGET_TAG.ID)
            .fetchOne()
            ?.get(BUDGET_TAG.ID)

        if (insertedId == null) {
            throw IllegalStateException("Failed to insert tag, no ID returned")
        }

        if (tagRequest.transactionsIds.isNotEmpty()) {
            dsl.batch(
                tagRequest.transactionsIds.map { transactionId ->
                    dsl.insertInto(BUDGET_TRANSACTION_TAG)
                        .set(BUDGET_TRANSACTION_TAG.BUDGET_TAG_ID, insertedId)
                        .set(BUDGET_TRANSACTION_TAG.BUDGET_TRANSACTION_ID, transactionId)
                }
            ).execute()
        }

        return requireNotNull(findById(insertedId)) { "Failed to load created tag id=$insertedId" }
    }

    @Transactional
    fun update(id: Long, tagRequest: TagRequest): Tag? {
        val rows = dsl.update(BUDGET_TAG)
            .set(BUDGET_TAG.NAME, tagRequest.name)
            .where(BUDGET_TAG.ID.eq(id))
            .execute()

        if (rows == 0) return null

        // When we update a tag, we will not delete existing relationships, just add new ones

        if (tagRequest.transactionsIds.isNotEmpty()) {
            dsl.batch(
                tagRequest.transactionsIds.map { transactionId ->
                    dsl.insertInto(BUDGET_TRANSACTION_TAG)
                        .set(BUDGET_TRANSACTION_TAG.BUDGET_TAG_ID, id)
                        .set(BUDGET_TRANSACTION_TAG.BUDGET_TRANSACTION_ID, transactionId)
                        .onConflictDoNothing()
                }
            ).execute()
        }

        return findById(id)
    }

    @Transactional
    fun delete(id: Long): Boolean {
        // Remove transaction relationships first due to FK constraints
        dsl.deleteFrom(BUDGET_TRANSACTION_TAG)
            .where(BUDGET_TRANSACTION_TAG.BUDGET_TAG_ID.eq(id))
            .execute()

        val rows = dsl.deleteFrom(BUDGET_TAG)
            .where(BUDGET_TAG.ID.eq(id))
            .execute()

        return rows > 0
    }
}
