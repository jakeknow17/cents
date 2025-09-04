package com.jacobknowlton.cents.budget.controller

import com.jacobknowlton.cents.budget.service.VendorService
import com.jacobknowlton.cents.generated.budget.model.Vendor
import com.jacobknowlton.cents.generated.budget.model.request.VendorRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/budget/vendors")
class VendorController(
    private val vendorService: VendorService,
) {

    @GetMapping("/{id}")
    fun getVendor(@PathVariable id: Long): ResponseEntity<Vendor> {
        val vendor = vendorService.findById(id)
        return if (vendor != null) {
            ResponseEntity.ok(vendor)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping
    fun getAllVendors(
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "100") limit: Int
    ): ResponseEntity<List<Vendor>> {
        val result = vendorService.findAll(offset, limit)
        return ResponseEntity.ok(result)
    }

    @PostMapping
    fun createVendor(@RequestBody vendorRequest: VendorRequest): ResponseEntity<Vendor> {
        return try {
            val vendor = vendorService.create(vendorRequest)
            ResponseEntity.status(HttpStatus.CREATED).body(vendor)
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @PutMapping("/{id}")
    fun updateVendor(
        @PathVariable id: Long,
        @RequestBody vendorRequest: VendorRequest
    ): ResponseEntity<Vendor> {
        val vendor = vendorService.update(id, vendorRequest)
        return try {
            if (vendor != null) {
                ResponseEntity.ok(vendor)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteVendor(@PathVariable id: Long): ResponseEntity<Void> {
        val deleted = vendorService.delete(id)
        return if (deleted) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
