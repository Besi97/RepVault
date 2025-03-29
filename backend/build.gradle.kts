plugins {
	kotlin("jvm") version "1.9.25"
	kotlin("plugin.spring") version "1.9.25"
	id("org.springframework.boot") version "3.4.4"
	id("io.spring.dependency-management") version "1.1.7"
	kotlin("kapt") version "1.9.25"
	id("com.google.cloud.tools.jib") version "3.4.5"
}

version = "0.0.1-SNAPSHOT"

var mapstructVersion = "1.6.3"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-graphql")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.mapstruct:mapstruct:${mapstructVersion}")
	implementation(project(":lib:graphql"))
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-web")
	kapt("org.mapstruct:mapstruct-processor:${mapstructVersion}")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testImplementation("org.springframework.graphql:spring-graphql-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
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
