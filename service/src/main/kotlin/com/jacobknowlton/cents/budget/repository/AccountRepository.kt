package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.budget.repository.mapper.AccountMapper
import com.jacobknowlton.cents.generated.budget.model.Account
import com.jacobknowlton.cents.generated.budget.model.request.AccountRequest
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_ACCOUNT
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class AccountRepository(
    private val dsl: DSLContext,
) {

    fun findById(id: Long): Account? {
        return dsl.select()
            .from(BUDGET_ACCOUNT)
            .where(BUDGET_ACCOUNT.ID.eq(id))
            .fetchOne(AccountMapper)
    }

    fun findAll(offset: Int = 0, limit: Int = 100): List<Account> {
        return dsl.select()
            .from(BUDGET_ACCOUNT)
            .orderBy(BUDGET_ACCOUNT.NAME.asc())
            .offset(offset)
            .limit(limit)
            .fetch(AccountMapper)
    }

    @Transactional
    fun create(accountRequest: AccountRequest): Account {
        val insertedId = dsl.insertInto(BUDGET_ACCOUNT)
            .set(BUDGET_ACCOUNT.NAME, accountRequest.name)
            .set(BUDGET_ACCOUNT.TYPE, accountRequest.type.name)
            .returning(BUDGET_ACCOUNT.ID)
            .fetchOne()
            ?.get(BUDGET_ACCOUNT.ID)

        if (insertedId == null) {
            throw IllegalStateException("Failed to insert account, no ID returned")
        }

        return requireNotNull(findById(insertedId)) { "Failed to load created account id=$insertedId" }
    }

    @Transactional
    fun update(id: Long, accountRequest: AccountRequest): Account? {
        val rows = dsl.update(BUDGET_ACCOUNT)
            .set(BUDGET_ACCOUNT.NAME, accountRequest.name)
            .set(BUDGET_ACCOUNT.TYPE, accountRequest.type.name)
            .where(BUDGET_ACCOUNT.ID.eq(id))
            .execute()

        if (rows == 0) return null

        return findById(id)
    }

    @Transactional
    fun delete(id: Long): Boolean {
        val rows = dsl.deleteFrom(BUDGET_ACCOUNT)
            .where(BUDGET_ACCOUNT.ID.eq(id))
            .execute()

        return rows > 0
    }
}
