package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.generated.budget.model.BudgetEntry
import com.jacobknowlton.cents.generated.budget.model.request.BudgetEntryRequest
import com.jacobknowlton.cents.budget.repository.mapper.BudgetEntryMapper
import com.jacobknowlton.cents.common.JooqCrudRepository
import com.jacobknowlton.cents.jooq.generated.tables.records.JBudgetEntryRecord
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_ENTRY
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class BudgetEntryRepository(
    private val dsl: DSLContext,
) : JooqCrudRepository<JBudgetEntryRecord, BudgetEntry, BudgetEntryRequest>(
    dslContext = dsl
) {
    override val table = BUDGET_ENTRY
    override val idField = BUDGET_ENTRY.ID
    override val mapper = BudgetEntryMapper()

    @Transactional
    override fun create(request: BudgetEntryRequest): BudgetEntry? {
        val newIid = dsl.insertInto(table)
            .set(table.ENTRY_DATE, request.entryDate)
            .set(table.NOTES, request.notes)
            .set(table.CATEGORY_ID, request.budgetCategoryId)
            .set(table.VENDOR_ID, request.budgetVendorId)
            .returning(idField)
            .fetchOne()
            ?.getValue(idField)
        return findById(newIid ?: 0)
    }

    @Transactional
    override fun update(entity: BudgetEntry): BudgetEntry? {
        dsl.update(table)
            .set(table.ENTRY_DATE, entity.entryDate)
            .set(table.NOTES, entity.notes)
            .set(table.CATEGORY_ID, entity.budgetCategory?.id)
            .set(table.VENDOR_ID, entity.budgetVendor?.id)
            .where(idField.eq(entity.id))
            .execute()
        return findById(entity.id)
    }
}