import com.kobylynskyi.graphql.codegen.model.GeneratedLanguage
import io.github.kobylynskyi.graphql.codegen.gradle.GraphQLCodegenGradleTask
import org.gradle.jvm.tasks.Jar
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    alias(libs.plugins.java)
    alias(libs.plugins.kotlin)
    alias(libs.plugins.graphqlCodegen)
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.spring.graphql)
}

val generatedCodePath = "${layout.projectDirectory}/src/generated"
val customPackageName = "${rootProject.group}.${project.group}.${project.name}"

tasks.named<GraphQLCodegenGradleTask>("graphqlCodegen") {
    graphqlSchemaPaths = listOf("${layout.projectDirectory}/schema/schema.graphqls")
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
        val destinationFile = file("src/generated/resources/graphql/schema.graphqls")
        destinationFile.parentFile.mkdirs()
        sourceFile.copyTo(destinationFile, overwrite = true)
    }
}

sourceSets {
    main {
        resources.srcDirs("src/generated/resources")
        kotlin.srcDirs(generatedCodePath)
    }
}

java {
    withSourcesJar()
}

tasks.named("processResources") {
    dependsOn("graphqlCodegen")
}

tasks.named<KotlinCompile>("compileKotlin") {
    dependsOn("graphqlCodegen")
}

tasks.named("clean") {
    doLast {
        delete(generatedCodePath)
    }
}

tasks.named<Jar>("sourcesJar") {
    dependsOn("graphqlCodegen")
}
