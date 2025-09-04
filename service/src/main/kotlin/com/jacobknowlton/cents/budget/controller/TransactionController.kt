package com.jacobknowlton.cents.budget.controller

import com.jacobknowlton.cents.budget.service.TransactionService
import com.jacobknowlton.cents.generated.budget.model.Transaction
import com.jacobknowlton.cents.generated.budget.model.request.TransactionRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/budget/transactions")
class TransactionController(
    private val transactionService: TransactionService,
) {

    @GetMapping("/{id}")
    fun getTransaction(@PathVariable id: Long): ResponseEntity<Transaction> {
        val transaction = transactionService.findById(id)
        return if (transaction != null) {
            ResponseEntity.ok(transaction)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping
    fun getAllTransactions(
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "100") limit: Int
    ): ResponseEntity<List<Transaction>> {
        val result = transactionService.findAll(offset, limit)
        return ResponseEntity.ok(result)
    }

    @PostMapping
    fun createTransaction(@RequestBody transactionRequest: TransactionRequest): ResponseEntity<Transaction> {
        return try {
            val transaction = transactionService.create(transactionRequest)
            ResponseEntity.status(HttpStatus.CREATED).body(transaction)
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @PutMapping("/{id}")
    fun updateTransaction(
        @PathVariable id: Long,
        @RequestBody transactionRequest: TransactionRequest
    ): ResponseEntity<Transaction> {
        val transaction = transactionService.update(id, transactionRequest)
        return try {
            if (transaction != null) {
                ResponseEntity.ok(transaction)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteTransaction(@PathVariable id: Long): ResponseEntity<Void> {
        val deleted = transactionService.delete(id)
        return if (deleted) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
