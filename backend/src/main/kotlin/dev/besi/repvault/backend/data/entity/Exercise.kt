package dev.besi.repvault.backend.data.entity

import jakarta.persistence.*

@Entity
data class Exercise(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @Column(nullable = false)
    val name: String,

    @ElementCollection
    val aliases: List<String>?,

    @Enumerated(EnumType.STRING)
    @ElementCollection
    val primaryMuscles: List<Muscle> = emptyList(),

    @Enumerated(EnumType.STRING)
    @ElementCollection
    val secondaryMuscles: List<Muscle>?,

    @Enumerated(EnumType.STRING)
    @Column(name = "force_type")
    val force: Force?,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val level: Level,

    @Enumerated(EnumType.STRING)
    val mechanic: Mechanic?,

    @Enumerated(EnumType.STRING)
    val equipment: Equipment?,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val category: Category,

    @ElementCollection
    @Column(columnDefinition = "TEXT")
    val instructions: List<String> = emptyList(),

    @Column(columnDefinition = "TEXT")
    val description: String? = null,

    @ElementCollection
    @Column(columnDefinition = "TEXT")
    val tips: List<String>? = emptyList()
)

enum class Force {
    PULL,
    PUSH,
    STATIC
}

enum class Mechanic {
    COMPOUND,
    ISOLATION
}

enum class Level {
    BEGINNER,
    INTERMEDIATE,
    EXPERT
}

enum class Muscle {
    ABDOMINALS,
    HAMSTRINGS,
    CALVES,
    SHOULDERS,
    ADDUCTORS,
    GLUTES,
    QUADRICEPS,
    BICEPS,
    FOREARMS,
    ABDUCTORS,
    TRICEPS,
    CHEST,
    LOWER_BACK,
    TRAPS,
    MIDDLE_BACK,
    LATS,
    NECK
}

enum class Equipment {
    BODY,
    MACHINE,
    KETTLEBELLS,
    DUMBBELL,
    CABLE,
    BARBELL,
    BANDS,
    MEDICINE_BALL,
    EXERCISE_BALL,
    E_Z_CURL_BAR,
    FOAM_ROLL
}

enum class Category {
    STRENGTH,
    STRETCHING,
    PLYOMETRICS,
    STRONGMAN,
    POWERLIFTING,
    CARDIO,
    OLYMPIC_WEIGHTLIFTING,
    CROSSFIT,
    WEIGHTED_BODYWEIGHT,
    ASSISTED_BODYWEIGHT
}
