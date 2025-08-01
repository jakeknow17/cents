package com.jacobknowlton.cents.common

data class PageResult<T> (
    val items: List<T>,
    val pageNumber: Int,
    val pageSize: Int,
    val totalItems: Int,
    val totalPages: Int
)