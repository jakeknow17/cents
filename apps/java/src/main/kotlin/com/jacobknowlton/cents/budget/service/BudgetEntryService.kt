package com.jacobknowlton.cents.budget.service

import com.jacobknowlton.cents.generated.budget.model.BudgetEntry
import com.jacobknowlton.cents.generated.budget.model.request.BudgetEntryRequest
import com.jacobknowlton.cents.budget.repository.BudgetEntryRepository
import com.jacobknowlton.cents.common.PageResult
import com.jacobknowlton.cents.jooq.generated.tables.records.JBudgetEntryRecord
import org.jooq.TableField
import org.springframework.stereotype.Service

@Service
class BudgetEntryService(
    private val budgetEntryRepository: BudgetEntryRepository
) {

    fun create(request: BudgetEntryRequest): BudgetEntry? = budgetEntryRepository.create(request)

    fun findById(id: Long): BudgetEntry? = budgetEntryRepository.findById(id)

    fun findAll(
        pageNumber: Int = 0,
        pageSize: Int = Int.MAX_VALUE,
        orderByField: TableField<JBudgetEntryRecord, *>? = null
    ): PageResult<BudgetEntry> = budgetEntryRepository.findAll(pageNumber, pageSize, orderByField)

    fun update(entity: BudgetEntry): BudgetEntry? = budgetEntryRepository.update(entity)

    fun delete(id: Long): Boolean = budgetEntryRepository.delete(id)

}