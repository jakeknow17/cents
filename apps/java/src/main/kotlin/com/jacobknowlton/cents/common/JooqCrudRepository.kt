package com.jacobknowlton.cents.common

import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.RecordMapper
import org.jooq.Table
import org.jooq.TableField
import org.springframework.transaction.annotation.Transactional
import kotlin.math.ceil

abstract class JooqCrudRepository<R : Record, E, Q>(
    protected val dslContext: DSLContext
) {
    protected abstract val table: Table<R>
    protected abstract val idField: TableField<R, Long?>
    protected abstract val mapper: RecordMapper<Record, E>

    @Transactional
    abstract fun create(request: Q): E?

    fun findById(id: Long): E? =
        dslContext.selectFrom(table)
            .where(idField.eq(id))
            .fetchOne(mapper)

    fun findAll(pageNumber: Int = 0, pageSize: Int = Int.MAX_VALUE, orderByField: TableField<R, *>? = null): PageResult<E> {
        require(pageNumber >= 0) { "Page number must be non-negative" }
        require(pageSize > 0) { "Page size must be greater than zero" }

        val totalItems: Int = dslContext.fetchCount(table)
        val items: List<E> = dslContext.selectFrom(table)
            .orderBy(orderByField?.asc() ?: idField.asc())
            .limit(pageSize)
            .offset(pageNumber * pageSize)
            .fetch(mapper)
        val totalPages = ceil(totalItems.toDouble() / pageSize).toInt()

        return PageResult(
            items = items,
            pageNumber = pageNumber,
            pageSize = pageSize,
            totalItems = totalItems,
            totalPages = totalPages
        )
    }

    @Transactional
    abstract fun update(entity: E): E?

    @Transactional
    open fun delete(id: Long): Boolean =
        dslContext.deleteFrom(table)
            .where(idField.eq(id))
            .execute() > 0

}