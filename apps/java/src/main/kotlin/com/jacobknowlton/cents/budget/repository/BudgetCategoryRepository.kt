package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.budget.model.BudgetCategory
import com.jacobknowlton.cents.budget.model.requests.BudgetCategoryRequest
import com.jacobknowlton.cents.budget.repository.mapper.BudgetCategoryMapper
import com.jacobknowlton.cents.common.JooqCrudRepository
import com.jacobknowlton.cents.jooq.generated.tables.records.JBudgetCategoryRecord
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class BudgetCategoryRepository(
    private val dsl: DSLContext,
) : JooqCrudRepository<JBudgetCategoryRecord, BudgetCategory, BudgetCategoryRequest>(
    dslContext = dsl
) {
    override val table = BUDGET_CATEGORY
    override val idField = BUDGET_CATEGORY.ID
    override val mapper = BudgetCategoryMapper()

    @Transactional
    override fun create(request: BudgetCategoryRequest): BudgetCategory? =
        dsl.insertInto(table)
            .set(table.NAME, request.name)
            .set(table.BUDGET_LIMIT, request.budgetLimit)
            .returning()
            .fetchOne(mapper)

    @Transactional
    override fun update(entity: BudgetCategory): BudgetCategory? =
        dsl.update(table)
            .set(table.NAME, entity.name)
            .set(table.BUDGET_LIMIT, entity.budgetLimit)
            .where(idField.eq(entity.id))
            .returning()
            .fetchOne(mapper)
}