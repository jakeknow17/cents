package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.budget.repository.mapper.CategoryMapper
import com.jacobknowlton.cents.generated.budget.model.Category
import com.jacobknowlton.cents.generated.budget.model.request.CategoryRequest
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class CategoryRepository(
    private val dsl: DSLContext,
) {

    fun findById(id: Long): Category? {
        return dsl.select()
            .from(BUDGET_CATEGORY)
            .where(BUDGET_CATEGORY.ID.eq(id))
            .fetchOne(CategoryMapper)
    }

    fun findAll(offset: Int = 0, limit: Int = 100): List<Category> {
        return dsl.select()
            .from(BUDGET_CATEGORY)
            .orderBy(BUDGET_CATEGORY.NAME.asc())
            .offset(offset)
            .limit(limit)
            .fetch(CategoryMapper)
    }

    @Transactional
    fun create(categoryRequest: CategoryRequest): Category {
        val insertedId = dsl.insertInto(BUDGET_CATEGORY)
            .set(BUDGET_CATEGORY.NAME, categoryRequest.name)
            .set(BUDGET_CATEGORY.AMOUNT, categoryRequest.amount)
            .set(BUDGET_CATEGORY.COLOR, categoryRequest.color)
            .returning(BUDGET_CATEGORY.ID)
            .fetchOne()
            ?.get(BUDGET_CATEGORY.ID)

        if (insertedId == null) {
            throw IllegalStateException("Failed to insert category, no ID returned")
        }

        return requireNotNull(findById(insertedId)) { "Failed to load created category id=$insertedId" }
    }

    @Transactional
    fun update(id: Long, categoryRequest: CategoryRequest): Category? {
        val rows = dsl.update(BUDGET_CATEGORY)
            .set(BUDGET_CATEGORY.NAME, categoryRequest.name)
            .set(BUDGET_CATEGORY.AMOUNT, categoryRequest.amount)
            .set(BUDGET_CATEGORY.COLOR, categoryRequest.color)
            .where(BUDGET_CATEGORY.ID.eq(id))
            .execute()

        if (rows == 0) return null

        return findById(id)
    }

    @Transactional
    fun delete(id: Long): Boolean {
        val rows = dsl.deleteFrom(BUDGET_CATEGORY)
            .where(BUDGET_CATEGORY.ID.eq(id))
            .execute()

        return rows > 0
    }
}
