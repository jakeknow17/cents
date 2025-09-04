package com.jacobknowlton.cents.budget.service

import com.jacobknowlton.cents.budget.repository.TagRepository
import com.jacobknowlton.cents.generated.budget.model.Tag
import com.jacobknowlton.cents.generated.budget.model.request.TagRequest
import org.springframework.stereotype.Service

@Service
class TagService(
    private val tagRepository: TagRepository,
) {

    fun findById(id: Long): Tag? =
        tagRepository.findById(id)

    fun findAll(offset: Int = 0, limit: Int = 100): List<Tag> =
        tagRepository.findAll(offset, limit)

    fun create(tagRequest: TagRequest): Tag =
        tagRepository.create(tagRequest)

    fun update(id: Long, tagRequest: TagRequest): Tag? =
        tagRepository.update(id, tagRequest)

    fun delete(id: Long): Boolean =
        tagRepository.delete(id)
}
