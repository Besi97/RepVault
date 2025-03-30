group = "dev.besi"
version = "0.0.1-SNAPSHOT"

plugins {
    val kotlinVersion = "1.9.25"

    java
    kotlin("jvm") version kotlinVersion
    kotlin("plugin.spring") version kotlinVersion
    kotlin("kapt") version kotlinVersion
    kotlin("plugin.jpa") version kotlinVersion
    kotlin("plugin.allopen") version kotlinVersion
}
