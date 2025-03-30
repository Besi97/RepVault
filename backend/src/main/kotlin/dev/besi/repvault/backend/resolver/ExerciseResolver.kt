package dev.besi.repvault.backend.resolver

import dev.besi.repvault.backend.ExerciseMapper
import dev.besi.repvault.backend.data.repository.ExerciseRepository
import dev.besi.repvault.lib.graphql.api.CreateExerciseMutationResolver
import dev.besi.repvault.lib.graphql.api.DeleteExerciseMutationResolver
import dev.besi.repvault.lib.graphql.api.ExercisesQueryResolver
import dev.besi.repvault.lib.graphql.api.UpdateExerciseMutationResolver
import dev.besi.repvault.lib.graphql.model.*
import org.springframework.stereotype.Controller

@Controller
class ExerciseResolver(
    private val exerciseRepository: ExerciseRepository,
    private val exerciseMapper: ExerciseMapper
) :
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

    override fun exercises(): List<Exercise> =
        exerciseRepository.findAll()
            .map { exerciseMapper.toGraphQL(it) }

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