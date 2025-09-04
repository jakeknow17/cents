package com.jacobknowlton.cents.budget.service

import com.jacobknowlton.cents.budget.repository.TransactionRepository
import com.jacobknowlton.cents.generated.budget.model.Transaction
import com.jacobknowlton.cents.generated.budget.model.request.TransactionRequest
import org.springframework.stereotype.Service

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository,
) {

    fun findById(id: Long): Transaction? =
        transactionRepository.findById(id)

    fun findAll(offset: Int = 0, limit: Int = 100): List<Transaction> =
        transactionRepository.findAll(offset, limit)

    fun create(transactionRequest: TransactionRequest): Transaction =
        transactionRepository.create(transactionRequest)

    fun update(id: Long, transactionRequest: TransactionRequest): Transaction? =
        transactionRepository.update(id, transactionRequest)

    fun delete(id: Long): Boolean =
        transactionRepository.delete(id)
}
