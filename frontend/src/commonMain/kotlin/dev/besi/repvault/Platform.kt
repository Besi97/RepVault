package dev.besi.repvault

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform