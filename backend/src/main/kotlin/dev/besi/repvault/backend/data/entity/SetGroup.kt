package dev.besi.repvault.backend.data.entity

import jakarta.persistence.*

@Entity
data class SetGroup(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	val id: Long,

	@ManyToOne(optional = false)
	@JoinColumn(name = "workout_id")
	val workout: Workout,

	@OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true, mappedBy = "setGroup")
	val sets: Collection<ExerciseSet>,
)
