package dev.besi.repvault.backend.data.repository

import dev.besi.repvault.backend.data.entity.Exercise
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ExerciseRepository : JpaRepository<Exercise, Long> {
	fun findAllByNameContainsIgnoreCase(name: String, page: Pageable): Page<Exercise>
}
