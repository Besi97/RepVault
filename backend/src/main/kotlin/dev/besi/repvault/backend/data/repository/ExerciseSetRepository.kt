package dev.besi.repvault.backend.data.repository

import dev.besi.repvault.backend.data.entity.ExerciseSet
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ExerciseSetRepository : JpaRepository<ExerciseSet, Long>
