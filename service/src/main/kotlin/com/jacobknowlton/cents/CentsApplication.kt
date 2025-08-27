package com.jacobknowlton.cents

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CentsApplication

fun main(args: Array<String>) {
    runApplication<CentsApplication>(*args)
}
