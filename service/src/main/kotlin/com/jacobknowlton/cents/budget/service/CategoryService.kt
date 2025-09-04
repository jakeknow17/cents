package com.jacobknowlton.cents.budget.service

import com.jacobknowlton.cents.budget.repository.CategoryRepository
import com.jacobknowlton.cents.generated.budget.model.Category
import com.jacobknowlton.cents.generated.budget.model.request.CategoryRequest
import org.springframework.stereotype.Service

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
) {

    fun findById(id: Long): Category? =
        categoryRepository.findById(id)

    fun findAll(offset: Int = 0, limit: Int = 100): List<Category> =
        categoryRepository.findAll(offset, limit)

    fun create(categoryRequest: CategoryRequest): Category =
        categoryRepository.create(categoryRequest)

    fun update(id: Long, categoryRequest: CategoryRequest): Category? =
        categoryRepository.update(id, categoryRequest)

    fun delete(id: Long): Boolean =
        categoryRepository.delete(id)
}
