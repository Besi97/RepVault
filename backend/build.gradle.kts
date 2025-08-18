plugins {
	alias(libs.plugins.kotlin)
	alias(libs.plugins.spring)
	alias(libs.plugins.kapt)
	alias(libs.plugins.jpa)
	alias(libs.plugins.allopen)
	alias(libs.plugins.springBoot)
	alias(libs.plugins.springDepMan)
	alias(libs.plugins.jib)
}

version = "0.0.1-SNAPSHOT"

repositories {
	mavenCentral()
}

dependencies {
	implementation(libs.spring.boot.starter.graphql)
	implementation(libs.spring.boot.starter.actuator)
	implementation(libs.spring.boot.starter.web)
	implementation(libs.spring.boot.starter.jpa)
	implementation(libs.jackson.kotlin)
	implementation(libs.kotlin.reflect)
	implementation(libs.mapstruct)
	kapt(libs.mapstruct.processor)
	implementation(project(":lib:graphql"))
	runtimeOnly(libs.mariadb)
	developmentOnly(libs.spring.boot.devtools)
	testImplementation(libs.spring.test)
	testImplementation(libs.spring.graphql.test)
	testImplementation(libs.kotlin.test.junit5)
	testRuntimeOnly(libs.junit.platform.launcher)
}

allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.Embeddable")
	annotation("jakarta.persistence.MappedSuperclass")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

jib {
	from {
		image = "azul/zulu-openjdk-alpine:21"
	}
	to {
		image = "git.besi.dev/besi/repvault/backend"
		tags = setOf(project.version.toString(), "latest")
		auth {
			username = System.getenv("CONTAINER_REGISTRY_USERNAME")
			password = System.getenv("CONTAINER_REGISTRY_PASSWORD")
		}
	}
	container {
		ports = listOf("8080")
		mainClass = "dev.besi.repvault.backend.BackendApplicationKt"
	}
}
