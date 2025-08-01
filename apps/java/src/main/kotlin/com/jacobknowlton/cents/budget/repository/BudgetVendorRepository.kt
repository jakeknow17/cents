package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.budget.model.BudgetVendor
import com.jacobknowlton.cents.budget.model.requests.BudgetVendorRequest
import com.jacobknowlton.cents.budget.repository.mapper.BudgetVendorMapper
import com.jacobknowlton.cents.common.JooqCrudRepository
import com.jacobknowlton.cents.jooq.generated.tables.records.JBudgetVendorRecord
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class BudgetVendorRepository(
    private val dsl: DSLContext,
) : JooqCrudRepository<JBudgetVendorRecord, BudgetVendor, BudgetVendorRequest>(
    dslContext = dsl
) {
    override val table = BUDGET_VENDOR
    override val idField = BUDGET_VENDOR.ID
    override val mapper = BudgetVendorMapper()

    @Transactional
    override fun create(request: BudgetVendorRequest): BudgetVendor? =
        dsl.insertInto(table)
            .set(table.NAME, request.name)
            .returning()
            .fetchOne(mapper)

    @Transactional
    override fun update(entity: BudgetVendor): BudgetVendor? =
        dsl.update(table)
            .set(table.NAME, entity.name)
            .where(idField.eq(entity.id))
            .returning()
            .fetchOne(mapper)
}