group = "dev.besi"
version = "0.0.1-SNAPSHOT"

plugins {
    // this is necessary to avoid the plugins to be loaded multiple times
    // in each subproject's classloader
    alias(libs.plugins.kotlin) apply false
    alias(libs.plugins.kapt) apply false
}
