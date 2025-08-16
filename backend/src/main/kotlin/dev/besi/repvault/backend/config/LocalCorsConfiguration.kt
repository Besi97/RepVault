package dev.besi.repvault.backend.config

import org.jetbrains.annotations.NotNull
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@Profile("local")
class LocalCorsConfiguration {
	@Bean
	fun corsConfigurer(): WebMvcConfigurer {
		return object : WebMvcConfigurer {
			override fun addCorsMappings(@NotNull registry: CorsRegistry) {
				registry.addMapping("/**")
					.allowedOrigins("http://localhost:3000")
					.allowedMethods("*")
					.allowedHeaders("*")
					.allowCredentials(true)
			}
		}
	}
}