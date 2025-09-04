package com.jacobknowlton.cents.budget.service

import com.jacobknowlton.cents.budget.repository.VendorRepository
import com.jacobknowlton.cents.generated.budget.model.Vendor
import com.jacobknowlton.cents.generated.budget.model.request.VendorRequest
import org.springframework.stereotype.Service

@Service
class VendorService(
    private val vendorRepository: VendorRepository,
) {

    fun findById(id: Long): Vendor? =
        vendorRepository.findById(id)

    fun findAll(offset: Int = 0, limit: Int = 100): List<Vendor> =
        vendorRepository.findAll(offset, limit)

    fun create(vendorRequest: VendorRequest): Vendor =
        vendorRepository.create(vendorRequest)

    fun update(id: Long, vendorRequest: VendorRequest): Vendor? =
        vendorRepository.update(id, vendorRequest)

    fun delete(id: Long): Boolean =
        vendorRepository.delete(id)
}
