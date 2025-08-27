package com.jacobknowlton.cents.budget.service

import com.jacobknowlton.cents.generated.budget.model.BudgetCategory
import com.jacobknowlton.cents.generated.budget.model.request.BudgetCategoryRequest
import com.jacobknowlton.cents.budget.repository.BudgetCategoryRepository
import com.jacobknowlton.cents.common.PageResult
import com.jacobknowlton.cents.jooq.generated.tables.records.JBudgetCategoryRecord
import org.jooq.TableField
import org.springframework.stereotype.Service

@Service
class BudgetCategoryService(
    private val budgetCategoryRepository: BudgetCategoryRepository
) {

    fun create(request: BudgetCategoryRequest): BudgetCategory? = budgetCategoryRepository.create(request)

    fun findById(id: Long): BudgetCategory? = budgetCategoryRepository.findById(id)

    fun findAll(
        pageNumber: Int = 0,
        pageSize: Int = Int.MAX_VALUE,
        orderByField: TableField<JBudgetCategoryRecord, *>? = null
    ): PageResult<BudgetCategory> = budgetCategoryRepository.findAll(pageNumber, pageSize, orderByField)

    fun update(entity: BudgetCategory): BudgetCategory? = budgetCategoryRepository.update(entity)

    fun delete(id: Long): Boolean = budgetCategoryRepository.delete(id)

}