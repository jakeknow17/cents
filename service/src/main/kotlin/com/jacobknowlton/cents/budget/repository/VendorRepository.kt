package com.jacobknowlton.cents.budget.repository

import com.jacobknowlton.cents.budget.repository.mapper.VendorMapper
import com.jacobknowlton.cents.generated.budget.model.Vendor
import com.jacobknowlton.cents.generated.budget.model.request.VendorRequest
import com.jacobknowlton.cents.jooq.generated.tables.references.BUDGET_VENDOR
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class VendorRepository(
    private val dsl: DSLContext,
) {

    fun findById(id: Long): Vendor? {
        return dsl.select(BUDGET_VENDOR.asterisk())
            .from(BUDGET_VENDOR)
            .where(BUDGET_VENDOR.ID.eq(id))
            .fetchOne(VendorMapper)
    }

    fun findAll(offset: Int = 0, limit: Int = 100): List<Vendor> {
        return dsl.select(BUDGET_VENDOR.asterisk())
            .from(BUDGET_VENDOR)
            .orderBy(BUDGET_VENDOR.NAME.asc())
            .offset(offset)
            .limit(limit)
            .fetch(VendorMapper)
    }

    @Transactional
    fun create(vendorRequest: VendorRequest): Vendor {
        val insertedId = dsl.insertInto(BUDGET_VENDOR)
            .set(BUDGET_VENDOR.NAME, vendorRequest.name)
            .set(BUDGET_VENDOR.LINK, vendorRequest.link)
            .returning(BUDGET_VENDOR.ID)
            .fetchOne()
            ?.get(BUDGET_VENDOR.ID)

        if (insertedId == null) {
            throw IllegalStateException("Failed to insert vendor, no ID returned")
        }

        return requireNotNull(findById(insertedId)) { "Failed to load created vendor id=$insertedId" }
    }

    @Transactional
    fun update(id: Long, vendorRequest: VendorRequest): Vendor? {
        val rows = dsl.update(BUDGET_VENDOR)
            .set(BUDGET_VENDOR.NAME, vendorRequest.name)
            .set(BUDGET_VENDOR.LINK, vendorRequest.link)
            .where(BUDGET_VENDOR.ID.eq(id))
            .execute()

        if (rows == 0) return null

        return findById(id)
    }

    @Transactional
    fun delete(id: Long): Boolean {
        val rows = dsl.deleteFrom(BUDGET_VENDOR)
            .where(BUDGET_VENDOR.ID.eq(id))
            .execute()

        return rows > 0
    }
}
