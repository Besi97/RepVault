package dev.besi.repvault.backend.data.entity

import jakarta.persistence.*

@Entity
data class ExerciseSet(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @ManyToOne(optional = false)
    @JoinColumn(name = "set_group_id")
    val setGroup: SetGroup,

    @ManyToOne(optional = false)
    val exercise: Exercise,

    @Column
    val repetitions: Int?,

    @Column
    val weight: Double?,

    @Enumerated(EnumType.STRING)
    val weightUnit: WeightUnit?,

    @Enumerated(EnumType.STRING)
    val setType: SetType?,

    /** Resting time after this set in seconds */
    @Column
    val restAfter: Int?
)

enum class WeightUnit {
    KG,
    LB
}

enum class SetType {
    WARM_UP,
    MAIN
}
