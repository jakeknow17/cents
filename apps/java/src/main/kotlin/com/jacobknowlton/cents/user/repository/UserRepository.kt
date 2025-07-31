package com.jacobknowlton.cents.user.repository

import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class UserRepository(val context: DSLContext) {

}