package dev.besi.repvault.backend.data.entity

import jakarta.persistence.*

@Entity
data class Workout(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	val id: Long,

	@Column(nullable = false)
	val name: String,

	@OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
	val setGroups: Collection<SetGroup>
)