package dev.besi.repvault.backend.resolver

import dev.besi.repvault.backend.data.repository.WorkoutRepository
import dev.besi.repvault.backend.mapper.WorkoutMapper
import dev.besi.repvault.lib.graphql.api.CreateWorkoutMutationResolver
import dev.besi.repvault.lib.graphql.api.DeleteWorkoutMutationResolver
import dev.besi.repvault.lib.graphql.api.UpdateWorkoutMutationResolver
import dev.besi.repvault.lib.graphql.api.WorkoutsQueryResolver
import dev.besi.repvault.lib.graphql.model.Workout
import dev.besi.repvault.lib.graphql.model.WorkoutInput
import org.springframework.stereotype.Controller
import java.lang.Long.parseLong
import java.util.Optional

@Controller
class WorkoutResolver(
	private val workoutRepository: WorkoutRepository,
	private val workoutMapper: WorkoutMapper
) : WorkoutsQueryResolver, CreateWorkoutMutationResolver, UpdateWorkoutMutationResolver, DeleteWorkoutMutationResolver {
	override fun workouts(id: String?): List<Workout> =
		Optional.ofNullable(id)
			.map { parseLong(it) }
			.flatMap { workoutRepository.findById(it) }
			.map { listOf(it) }
			.orElse(workoutRepository.findAll())
			.map { workoutMapper.toGraphQL(it) }

	override fun createWorkout(input: WorkoutInput): Workout =
		workoutRepository.save(workoutMapper.toEntity(input)).let { workoutMapper.toGraphQL(it) }

	override fun updateWorkout(
		id: String,
		input: WorkoutInput
	): Workout =
		workoutRepository.findById(parseLong(id))
			.map { existingWorkout ->
				existingWorkout.copy(
					name = input.name,
					setGroups = input.setGroups.map { workoutMapper.toEntity(it) }
				)
			}
			.map { workoutRepository.save(it) }
			.map { workoutMapper.toGraphQL(it) }
			.orElseThrow { IllegalArgumentException("Exercise with ID $id not found") }


	override fun deleteWorkout(id: String): Boolean =
		workoutRepository.findById(parseLong(id)).map { workoutRepository.delete(it) }.map { true }
			.orElseThrow { IllegalArgumentException("Exercise with ID $id not found") }

}