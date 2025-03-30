package dev.besi.repvault.backend.resolver

import dev.besi.repvault.lib.graphql.api.CreateExerciseMutationResolver
import dev.besi.repvault.lib.graphql.api.DeleteExerciseMutationResolver
import dev.besi.repvault.lib.graphql.api.ExercisesQueryResolver
import dev.besi.repvault.lib.graphql.api.UpdateExerciseMutationResolver
import dev.besi.repvault.lib.graphql.model.*
import org.springframework.stereotype.Controller

@Controller
class ExerciseResolver :
    ExercisesQueryResolver,
    CreateExerciseMutationResolver,
    UpdateExerciseMutationResolver,
    DeleteExerciseMutationResolver {

    val barbellCurl = Exercise(
        id = "barbell-curl",
        name = "Barbell Curl",
        aliases = listOf("Standing Barbell Curl"),
        primaryMuscles = listOf(Muscle.BICEPS),
        secondaryMuscles = listOf(Muscle.FOREARMS),
        force = Force.PULL,
        level = Level.BEGINNER,
        mechanic = Mechanic.ISOLATION,
        equipment = Equipment.BARBELL,
        category = Category.STRENGTH,
        instructions = listOf(
            "Stand up with your torso upright while holding a barbell at a shoulder-width grip. The palm of your hands should be facing forward and the elbows should be close to the torso. This will be your starting position.",
            "While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out. Tip: Only the forearms should move.",
            "Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second and squeeze the biceps hard.",
            "Slowly begin to bring the bar back to starting position as your breathe in.",
            "Repeat for the recommended amount of repetitions."
        ),
        description = "A fundamental exercise for strengthening the biceps.",
        tips = listOf("Keep your elbows close to your torso.", "Only move your forearms. Avoid swinging.")
    )

    override fun exercises(): List<Exercise> {

        val pushUp = Exercise(
            id = "push-up",
            name = "Push-Up",
            aliases = listOf("Pushup", "Press-Up"),
            primaryMuscles = listOf(Muscle.CHEST),
            secondaryMuscles = listOf(Muscle.TRICEPS, Muscle.SHOULDERS),
            force = Force.PUSH,
            level = Level.INTERMEDIATE,
            mechanic = Mechanic.COMPOUND,
            equipment = Equipment.BODY,
            category = Category.WEIGHTED_BODYWEIGHT,
            instructions = listOf(
                "Get into a high plank position with your hands slightly wider than shoulder-width apart.",
                "Keep your body straight from head to heels. Engage your core to avoid arching your back.",
                "Lower your body until your chest is just above the ground, bending your elbows while keeping them close to your body.",
                "Push yourself back up to the starting position by extending your elbows.",
                "Repeat the movement."
            ),
            description = "A classic bodyweight exercise that targets the chest, shoulders, and triceps.",
            tips = listOf("Keep your core tight.", "Do not let your hips sag or rise too high.")
        )

        val deadlift = Exercise(
            id = "deadlift",
            name = "Deadlift",
            aliases = null, // No aliases available
            primaryMuscles = listOf(Muscle.HAMSTRINGS, Muscle.GLUTES, Muscle.LOWER_BACK),
            secondaryMuscles = listOf(Muscle.TRAPS, Muscle.FOREARMS),
            force = Force.PULL,
            level = Level.INTERMEDIATE,
            mechanic = Mechanic.COMPOUND,
            equipment = Equipment.BARBELL,
            category = Category.STRENGTH,
            instructions = listOf(
                "Approach a loaded barbell with feet shoulder-width apart and toes pointing slightly outward.",
                "Hinge at your hips and knees to grip the bar just outside your knees with a double overhand or mixed grip.",
                "Keep your chest up, back straight, and shoulders back as you begin the lift.",
                "Drive through your heels to lift the bar up, keeping it close to your body as you extend your knees and hips.",
                "Lower the bar back down in a controlled manner by hinging at your hips first, then bending your knees.",
                "Repeat for the recommended number of repetitions."
            ),
            description = "A strength training exercise targeting multiple muscle groups.",
            tips = listOf("Keep the bar close to your body.", "Engage your core to protect your lower back.")
        )

        return listOf(barbellCurl, pushUp, deadlift)
    }

    override fun createExercise(input: ExerciseInput): Exercise {
        return barbellCurl
    }

    override fun updateExercise(id: String, input: ExerciseInput): Exercise {
        return barbellCurl
    }

    override fun deleteExercise(id: String): Boolean {
        return true
    }
}