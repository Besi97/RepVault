import com.kobylynskyi.graphql.codegen.model.GeneratedLanguage
import io.github.kobylynskyi.graphql.codegen.gradle.GraphQLCodegenGradleTask
import org.gradle.jvm.tasks.Jar
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    java
    kotlin("jvm") version "2.0.0"
    id("io.github.kobylynskyi.graphql.codegen") version "5.10.0"
    `maven-publish`
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.graphql:spring-graphql:1.3.4")
}

val generatedCodePath = "${layout.projectDirectory}/src/generated"
val customPackageName = "${rootProject.group}.${project.group}.${project.name}"
println("Package name: $customPackageName")

tasks.named<GraphQLCodegenGradleTask>("graphqlCodegen") {
    graphqlSchemaPaths = listOf("schema/schema.graphqls")
    outputDir = File(generatedCodePath)
    packageName = customPackageName
    apiPackageName = "$customPackageName.api"
    modelPackageName = "$customPackageName.model"
    generateImmutableModels = true
    generatedLanguage = GeneratedLanguage.KOTLIN
    resolverArgumentAnnotations = setOf("org.springframework.graphql.data.method.annotation.Argument")
    parametrizedResolverAnnotations = setOf(
        "org.springframework.graphql.data.method.annotation.SchemaMapping(typeName=\"{{TYPE_NAME}}\")"
    )
    customAnnotationsMapping = mapOf(
        "Query\\..*" to listOf("org.springframework.graphql.data.method.annotation.QueryMapping"),
        "Mutation\\..*" to listOf("org.springframework.graphql.data.method.annotation.MutationMapping")
    )

    doLast {
        val sourceFile = file("schema/schema.graphqls")
        val destinationFile = file("src/generated/resources/schema.graphqls")
        destinationFile.parentFile.mkdirs()
        sourceFile.copyTo(destinationFile, overwrite = true)
    }
}

sourceSets.getByName("main").kotlin.srcDirs(generatedCodePath)

java {
    withSourcesJar()
}

tasks.named<KotlinCompile>("compileKotlin") {
    dependsOn("graphqlCodegen")
}

tasks.named<Jar>("sourcesJar") {
    dependsOn("graphqlCodegen")
}

publishing {
    publications {
        create<MavenPublication>("repvault-api-models-jvm") {
            groupId = customPackageName
            artifactId = "repvault-api-models-jvm"
            version = "0.0.1"
            from(components["java"])
        }
    }
}
