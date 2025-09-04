package com.jacobknowlton.cents.budget.controller

import com.jacobknowlton.cents.budget.service.CategoryService
import com.jacobknowlton.cents.generated.budget.model.Category
import com.jacobknowlton.cents.generated.budget.model.request.CategoryRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/budget/categories")
class CategoryController(
    private val categoryService: CategoryService,
) {

    @GetMapping("/{id}")
    fun getCategory(@PathVariable id: Long): ResponseEntity<Category> {
        val category = categoryService.findById(id)
        return if (category != null) {
            ResponseEntity.ok(category)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping
    fun getAllCategories(
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "100") limit: Int
    ): ResponseEntity<List<Category>> {
        val result = categoryService.findAll(offset, limit)
        return ResponseEntity.ok(result)
    }

    @PostMapping
    fun createCategory(@RequestBody categoryRequest: CategoryRequest): ResponseEntity<Category> {
        return try {
            val category = categoryService.create(categoryRequest)
            ResponseEntity.status(HttpStatus.CREATED).body(category)
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @PutMapping("/{id}")
    fun updateCategory(
        @PathVariable id: Long,
        @RequestBody categoryRequest: CategoryRequest
    ): ResponseEntity<Category> {
        val category = categoryService.update(id, categoryRequest)
        return try {
            if (category != null) {
                ResponseEntity.ok(category)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteCategory(@PathVariable id: Long): ResponseEntity<Void> {
        val deleted = categoryService.delete(id)
        return if (deleted) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
