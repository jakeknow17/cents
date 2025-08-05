package com.jacobknowlton.cents.budget.service

import com.jacobknowlton.cents.generated.budget.model.BudgetVendor
import com.jacobknowlton.cents.generated.budget.model.request.BudgetVendorRequest
import com.jacobknowlton.cents.budget.repository.BudgetVendorRepository
import com.jacobknowlton.cents.common.PageResult
import com.jacobknowlton.cents.jooq.generated.tables.records.JBudgetVendorRecord
import org.jooq.TableField
import org.springframework.stereotype.Service

@Service
class BudgetVendorService(
    private val budgetVendorRepository: BudgetVendorRepository
) {

    fun create(request: BudgetVendorRequest): BudgetVendor? = budgetVendorRepository.create(request)

    fun findById(id: Long): BudgetVendor? = budgetVendorRepository.findById(id)

    fun findAll(
        pageNumber: Int = 0,
        pageSize: Int = Int.MAX_VALUE,
        orderByField: TableField<JBudgetVendorRecord, *>? = null
    ): PageResult<BudgetVendor> = budgetVendorRepository.findAll(pageNumber, pageSize, orderByField)

    fun update(entity: BudgetVendor): BudgetVendor? = budgetVendorRepository.update(entity)

    fun delete(id: Long): Boolean = budgetVendorRepository.delete(id)

}