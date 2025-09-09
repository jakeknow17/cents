package com.jacobknowlton.cents.config

import org.flywaydb.core.Flyway
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.sql.DataSource

@Configuration
class FlywayConfig {
    @Bean
    fun flyway(dataSource: DataSource): Flyway {
        val f = Flyway.configure()
            .dataSource(dataSource)
            .baselineOnMigrate(true)
            .validateMigrationNaming(true)
            .locations("classpath:db/migration")
            .load()
        f.migrate()
        return f
    }
}


