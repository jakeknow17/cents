package com.jacobknowlton.cents.budget.controller

import com.jacobknowlton.cents.budget.service.TagService
import com.jacobknowlton.cents.generated.budget.model.Tag
import com.jacobknowlton.cents.generated.budget.model.request.TagRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/budget/tags")
class TagController(
    private val tagService: TagService,
) {

    @GetMapping("/{id}")
    fun getTag(@PathVariable id: Long): ResponseEntity<Tag> {
        val tag = tagService.findById(id)
        return if (tag != null) {
            ResponseEntity.ok(tag)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping
    fun getAllTags(
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "100") limit: Int
    ): ResponseEntity<List<Tag>> {
        val result = tagService.findAll(offset, limit)
        return ResponseEntity.ok(result)
    }

    @PostMapping
    fun createTag(@RequestBody tagRequest: TagRequest): ResponseEntity<Tag> {
        return try {
            val tag = tagService.create(tagRequest)
            ResponseEntity.status(HttpStatus.CREATED).body(tag)
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @PutMapping("/{id}")
    fun updateTag(
        @PathVariable id: Long,
        @RequestBody tagRequest: TagRequest
    ): ResponseEntity<Tag> {
        val tag = tagService.update(id, tagRequest)
        return try {
            if (tag != null) {
                ResponseEntity.ok(tag)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (_: Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteTag(@PathVariable id: Long): ResponseEntity<Void> {
        val deleted = tagService.delete(id)
        return if (deleted) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
