import com.github.gradle.node.npm.task.NpmTask
import com.kobylynskyi.graphql.codegen.model.GeneratedLanguage
import io.github.kobylynskyi.graphql.codegen.gradle.GraphQLCodegenGradleTask
import org.gradle.jvm.tasks.Jar
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    alias(libs.plugins.java)
    alias(libs.plugins.kotlin)
    alias(libs.plugins.graphqlCodegen)
    alias(libs.plugins.nodeGradle)
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.spring.graphql)
}

node {
    version.set("20.11.0")
    download.set(true)
}

val generatedCodePath = "${layout.projectDirectory}/src/generated"
val schemaDir = "${layout.projectDirectory}/schema"
val schemaPaths = fileTree(schemaDir)
    .filter { it.name.endsWith(".graphqls") }
    .map { it.path }
val generatedTsCodePath = "$generatedCodePath/typescript"

val installTypescriptGraphQLCodegen by tasks.register<NpmTask>("installTypescriptGraphQLCodegen") {
    args.set(listOf("install",
        "@graphql-codegen/cli",
        "@graphql-codegen/typescript",
        "@graphql-codegen/typescript-operations",
        "@graphql-codegen/typescript-react-query",
        "graphql"
    ))
}

val copyNpmPackageFiles by tasks.register<Copy>("copyNpmPackageFiles") {
    from("npm-package-template")
    into(generatedTsCodePath)
}

tasks.register<NpmTask>("generateTypeScriptClient") {
    group = "codegen"
    dependsOn(installTypescriptGraphQLCodegen)

    args.set(listOf(
        "exec",
        "graphql-codegen",
        "--config",
        "codegen.yml"
    ))

    inputs.dir(schemaDir)
    inputs.file("codegen.yml")
    outputs.dir(generatedTsCodePath)

    finalizedBy(copyNpmPackageFiles)
}


val generatedKtCodePath = "$generatedCodePath/kotlin"
val customKtPackageName = "${rootProject.group}.${project.group}.${project.name}"

val graphqlKotlinCodegen by tasks.named<GraphQLCodegenGradleTask>("graphqlCodegen") {
    graphqlSchemaPaths = schemaPaths
    outputDir = File(generatedKtCodePath)
    packageName = customKtPackageName
    apiPackageName = "$customKtPackageName.api"
    modelPackageName = "$customKtPackageName.model"
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
        schemaPaths.forEach {
            file(it).mkdirs()
            file(it).copyTo(
                file("$generatedCodePath/resources/graphql/${it.substringAfterLast("/")}"),
                overwrite = true
            )
        }

    }
}

sourceSets {
    main {
        resources.srcDirs("src/generated/resources")
        kotlin.srcDirs(generatedKtCodePath)
    }
}

java {
    withSourcesJar()
}

tasks.named("processResources") {
    dependsOn(graphqlKotlinCodegen)
}

tasks.named<KotlinCompile>("compileKotlin") {
    dependsOn(graphqlKotlinCodegen)
}

tasks.named("clean") {
    doLast {
        delete(generatedCodePath)
    }
}

tasks.named<Jar>("sourcesJar") {
    dependsOn(graphqlKotlinCodegen)
}
