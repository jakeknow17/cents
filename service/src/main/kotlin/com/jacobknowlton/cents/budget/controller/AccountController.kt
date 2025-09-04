package com.jacobknowlton.cents.budget.controller

import com.jacobknowlton.cents.budget.service.AccountService
import com.jacobknowlton.cents.generated.budget.model.Account
import com.jacobknowlton.cents.generated.budget.model.request.AccountRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/budget/accounts")
class AccountController(
    private val accountService: AccountService,
) {

    @GetMapping("/{id}")
    fun getAccount(@PathVariable id: Long): ResponseEntity<Account> {
        val account = accountService.findById(id)
        return if (account != null) {
            ResponseEntity.ok(account)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping
    fun getAllAccounts(
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "100") limit: Int
    ): ResponseEntity<List<Account>> {
        val result = accountService.findAll(offset, limit)
        return ResponseEntity.ok(result)
    }

    @PostMapping
    fun createAccount(@RequestBody accountRequest: AccountRequest): ResponseEntity<Account> {
        return try {
            val account = accountService.create(accountRequest)
            ResponseEntity.status(HttpStatus.CREATED).body(account)
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @PutMapping("/{id}")
    fun updateAccount(
        @PathVariable id: Long,
        @RequestBody accountRequest: AccountRequest
    ): ResponseEntity<Account> {
        val account = accountService.update(id, accountRequest)
        return try {
            if (account != null) {
                ResponseEntity.ok(account)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteAccount(@PathVariable id: Long): ResponseEntity<Void> {
        val deleted = accountService.delete(id)
        return if (deleted) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
