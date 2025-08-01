package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.budget.model.BudgetCategory
import com.jacobknowlton.cents.budget.model.BudgetEntry
import com.jacobknowlton.cents.budget.model.BudgetVendor
import com.jacobknowlton.cents.budget.model.requests.BudgetCategoryRequest
import com.jacobknowlton.cents.budget.model.requests.BudgetVendorRequest
import com.jacobknowlton.cents.budget.repository.mapper.BudgetCategoryMapper
import com.jacobknowlton.cents.budget.repository.mapper.BudgetEntryMapper
import com.jacobknowlton.cents.budget.repository.mapper.BudgetVendorMapper
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_CATEGORY
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_ENTRY
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class BudgetRepository(private val dsl: DSLContext) {

    private val categoryMapper: BudgetCategoryMapper = BudgetCategoryMapper()
    private val vendorMapper: BudgetVendorMapper = BudgetVendorMapper()
    private val entryMapper: BudgetEntryMapper = BudgetEntryMapper(
        categoryMapper = this.categoryMapper,
        vendorMapper = this.vendorMapper
    )

    @Transactional
    fun createCategory(category: BudgetCategoryRequest): BudgetCategory? =
        dsl.insertInto(BUDGET_CATEGORY)
            .set(BUDGET_CATEGORY.NAME, category.name)
            .set(BUDGET_CATEGORY.BUDGET_LIMIT, category.budgetLimit)
            .returning()
            .fetchOne(categoryMapper)

    fun findCategoryById(iid: Long): BudgetCategory? =
        dsl.selectFrom(BUDGET_CATEGORY)
            .where(BUDGET_CATEGORY.ID.eq(iid))
            .fetchOne(categoryMapper)

    fun findAllCategories(): List<BudgetCategory> =
        dsl.selectFrom(BUDGET_CATEGORY)
            .fetch(categoryMapper)

    @Transactional
    fun updateCategory(category: BudgetCategory): BudgetCategory? =
        dsl.update(BUDGET_CATEGORY)
            .set(BUDGET_CATEGORY.NAME, category.name)
            .set(BUDGET_CATEGORY.BUDGET_LIMIT, category.budgetLimit)
            .where(BUDGET_CATEGORY.ID.eq(category.id))
            .returning()
            .fetchOne(categoryMapper)

    @Transactional
    fun deleteCategory(iid: Long): Boolean =
        dsl.deleteFrom(BUDGET_CATEGORY)
            .where(BUDGET_CATEGORY.ID.eq(iid))
            .execute() > 0

    @Transactional
    fun createVendor(vendor: BudgetVendorRequest): BudgetVendor? =
        dsl.insertInto(BUDGET_VENDOR)
            .set(BUDGET_VENDOR.NAME, vendor.name)
            .returning()
            .fetchOne(vendorMapper)

    fun findVendorById(iid: Long): BudgetVendor? =
        dsl.selectFrom(BUDGET_VENDOR)
            .where(BUDGET_VENDOR.ID.eq(iid))
            .fetchOne(vendorMapper)

    fun findAllVendors(): List<BudgetVendor> =
        dsl.selectFrom(BUDGET_VENDOR)
            .fetch(vendorMapper)

    @Transactional
    fun updateVendor(vendor: BudgetVendor): BudgetVendor? =
        dsl.update(BUDGET_VENDOR)
            .set(BUDGET_VENDOR.NAME, vendor.name)
            .where(BUDGET_VENDOR.ID.eq(vendor.id))
            .returning()
            .fetchOne(vendorMapper)

    @Transactional
    fun deleteVendor(iid: Long): Boolean =
        dsl.deleteFrom(BUDGET_VENDOR)
            .where(BUDGET_VENDOR.ID.eq(iid))
            .execute() > 0

    @Transactional
    fun createEntry(entry: BudgetEntry): BudgetEntry? {
        val newIid = dsl.insertInto(BUDGET_ENTRY)
            .set(BUDGET_ENTRY.ENTRY_DATE, entry.entryDate)
            .set(BUDGET_ENTRY.NOTES, entry.notes)
            .set(BUDGET_ENTRY.CATEGORY_ID, entry.category?.id)
            .set(BUDGET_ENTRY.VENDOR_ID, entry.vendor?.id)
            .returning(BUDGET_ENTRY.ID)
            .fetchOne()
            ?.getValue(BUDGET_ENTRY.ID)
        return findEntryById(newIid ?: 0)
    }

    fun findEntryById(iid: Long): BudgetEntry? =
        dsl.select()
            .from(BUDGET_ENTRY)
            .leftJoin(BUDGET_CATEGORY).on(BUDGET_ENTRY.CATEGORY_ID.eq(BUDGET_CATEGORY.ID))
            .leftJoin(BUDGET_VENDOR).on(BUDGET_ENTRY.VENDOR_ID.eq(BUDGET_VENDOR.ID))
            .where(BUDGET_ENTRY.ID.eq(iid))
            .fetchOne(entryMapper)

    fun findAllEntries(): List<BudgetEntry> =
        dsl.select()
            .from(BUDGET_ENTRY)
            .leftJoin(BUDGET_CATEGORY).on(BUDGET_ENTRY.CATEGORY_ID.eq(BUDGET_CATEGORY.ID))
            .leftJoin(BUDGET_VENDOR).on(BUDGET_ENTRY.VENDOR_ID.eq(BUDGET_VENDOR.ID))
            .fetch(entryMapper)

    @Transactional
    fun updateEntry(entry: BudgetEntry): BudgetEntry? {
        dsl.update(BUDGET_ENTRY)
            .set(BUDGET_ENTRY.ENTRY_DATE, entry.entryDate)
            .set(BUDGET_ENTRY.NOTES, entry.notes)
            .set(BUDGET_ENTRY.CATEGORY_ID, entry.category?.id)
            .set(BUDGET_ENTRY.VENDOR_ID, entry.vendor?.id)
            .where(BUDGET_ENTRY.ID.eq(entry.id))
            .execute()
        return findEntryById(entry.id)
    }

    @Transactional
    fun deleteEntry(iid: Long): Boolean =
        dsl.deleteFrom(BUDGET_ENTRY)
            .where(BUDGET_ENTRY.ID.eq(iid))
            .execute() > 0

}