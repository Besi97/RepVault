val installNodeModules by tasks.register<Exec>("installNodeModules") {
    dependsOn(":lib:graphql:generateTypeScriptClient")
    group = "build"
    inputs.files(projectDir.resolve("package.json"))
    commandLine("npm", "install")
}

tasks.register<Exec>("devServer") {
    dependsOn(installNodeModules)
    group = "run"
    commandLine("npm", "run", "dev")
}

tasks.register("clean") {
    group = "build"
    delete(".next")
}

tasks.register("cleanNodeModules") {
    group = "build"
    delete("node_modules")
}
