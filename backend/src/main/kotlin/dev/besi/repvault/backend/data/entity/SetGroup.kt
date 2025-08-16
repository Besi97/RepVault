package dev.besi.repvault.backend.data.entity

import jakarta.persistence.*

@Entity
data class SetGroup(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	val id: Long,

	@OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
	val sets: Collection<Set>,
)
