package dev.besi.repvault.backend.data.repository

import dev.besi.repvault.backend.data.entity.Workout
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface WorkoutRepository : JpaRepository<Workout, Long>
