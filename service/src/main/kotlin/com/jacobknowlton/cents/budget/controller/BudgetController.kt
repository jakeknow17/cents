package com.jacobknowlton.cents.budget.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/budget")
class BudgetController {


    @GetMapping("/hello")
    fun hello(): ResponseEntity<String> {
        return ResponseEntity.ok("Hello, World!")
    }

    @PostMapping("/post")
    fun post(): ResponseEntity<String> {
        return ResponseEntity.ok("Post request received!")
    }

//    @PostMapping("/vendor")
//    fun createVendor(@RequestBody vendorRequest: BudgetVendorRequest): ResponseEntity<BudgetVendor> {
//        val vendor = budgetRepository.createVendor(vendorRequest)
//        return if (vendor != null) {
//            ResponseEntity.ok(vendor)
//        } else {
//            ResponseEntity.badRequest().build()
//        }
//    }
//
//    @GetMapping("/vendor/{vendorId}")
//    fun getVendor(@PathVariable("vendorId") vendorId: Long): ResponseEntity<BudgetVendor> {
//        val vendor = budgetRepository.findVendorById(vendorId)
//        return if (vendor != null) {
//            ResponseEntity.ok(vendor)
//        } else {
//            ResponseEntity.notFound().build()
//        }
//    }

}