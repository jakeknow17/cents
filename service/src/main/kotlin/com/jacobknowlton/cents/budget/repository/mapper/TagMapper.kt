package com.jacobknowlton.cents.budget.repository.mapper

import com.jacobknowlton.cents.budget.repository.TagRepository
import com.jacobknowlton.cents.generated.budget.model.Tag
import com.jacobknowlton.cents.generated.budget.model.Transaction
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_TAG
import org.jooq.Record
import org.jooq.RecordMapper
import java.time.OffsetDateTime

object TagMapper : RecordMapper<Record, Tag> {
    override fun map(record: Record?): Tag? {
        return record?.let {
            Tag(
                id = it.get(BUDGET_TAG.ID, Long::class.java),
                name = it.get(BUDGET_TAG.NAME, String::class.java),
                transactions = try {
                    it.get(TagRepository.BUDGET_TAGS_TRANSACTION_FIELD, List::class.java)
                        .filterIsInstance<Transaction>()
                } catch (_: Exception) {
                    emptyList()
                },
                createdAt = it.get(BUDGET_TAG.CREATED_AT, OffsetDateTime::class.java),
                updatedAt = it.get(BUDGET_TAG.UPDATED_AT, OffsetDateTime::class.java)
            )
        }
    }
}