package com.jacobknowlton.cents.budget.service

import com.jacobknowlton.cents.budget.repository.AccountRepository
import com.jacobknowlton.cents.generated.budget.model.Account
import com.jacobknowlton.cents.generated.budget.model.request.AccountRequest
import org.springframework.stereotype.Service

@Service
class AccountService(
    private val accountRepository: AccountRepository,
) {

    fun findById(id: Long): Account? =
        accountRepository.findById(id)

    fun findAll(offset: Int = 0, limit: Int = 100): List<Account> =
        accountRepository.findAll(offset, limit)

    fun create(accountRequest: AccountRequest): Account =
        accountRepository.create(accountRequest)

    fun update(id: Long, accountRequest: AccountRequest): Account? =
        accountRepository.update(id, accountRequest)

    fun delete(id: Long): Boolean =
        accountRepository.delete(id)
}
