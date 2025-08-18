package dev.besi.repvault.backend.resolver

import dev.besi.repvault.backend.data.repository.ExerciseSetRepository
import dev.besi.repvault.backend.data.repository.SetGroupRepository
import dev.besi.repvault.backend.data.repository.WorkoutRepository
import dev.besi.repvault.backend.mapper.WorkoutMapper
import dev.besi.repvault.lib.graphql.api.*
import dev.besi.repvault.lib.graphql.model.SetInput
import dev.besi.repvault.lib.graphql.model.Workout
import org.springframework.stereotype.Controller
import java.lang.Long.parseLong
import java.util.*

@Controller
class WorkoutResolver(
	private val workoutRepository: WorkoutRepository,
	private val setGroupRepository: SetGroupRepository,
	private val exerciseSetRepository: ExerciseSetRepository,
	private val workoutMapper: WorkoutMapper,
) : WorkoutsQueryResolver,
	CreateEmptyWorkoutMutationResolver,
	UpdateWorkoutNameMutationResolver,
	DeleteWorkoutMutationResolver,
	AddNewSetGroupMutationResolver,
	DeleteSetGroupMutationResolver,
	AddNewSetMutationResolver,
	UpdateSetMutationResolver,
	DeleteSetMutationResolver {

	override fun workouts(id: String?): List<Workout> = Optional.ofNullable(id).map { parseLong(it) }.map {
		workoutRepository.findById(it).orElseThrow { IllegalArgumentException("Workout with ID $id not found") }
	}.map { listOf(it) }.orElse(workoutRepository.findAll()).map { workoutMapper.toGraphQL(it) }

	override fun createEmptyWorkout(name: String): Workout =
		workoutRepository.save(dev.besi.repvault.backend.data.entity.Workout(-1L, name, listOf()))
			.let { workoutMapper.toGraphQL(it) }

	override fun updateWorkoutName(id: String, newName: String): Workout = workoutRepository.findById(parseLong(id))
		.map { it.copy(name = newName) }
		.map { workoutRepository.save(it) }
		.map { workoutMapper.toGraphQL(it) }
		.orElseThrow { IllegalArgumentException("Workout with ID $id not found") }

	override fun deleteWorkout(id: String): Boolean = workoutRepository.findById(parseLong(id))
		.map { workoutRepository.delete(it) }
		.map { true }
		.orElseThrow { IllegalArgumentException("Workout with ID $id not found") }

	override fun addNewSetGroup(workoutId: String): Workout = workoutRepository.findById(parseLong(workoutId))
		.map {
			it.copy(
				setGroups = listOf(
					*it.setGroups.toTypedArray(), dev.besi.repvault.backend.data.entity.SetGroup(-1L, it, listOf())
				)
			)
		}
		.map { workoutRepository.save(it) }
		.map { workoutMapper.toGraphQL(it) }
		.orElseThrow { IllegalArgumentException("Workout with ID $workoutId not found") }

	override fun deleteSetGroup(setGroupId: String): Workout = setGroupRepository.findById(parseLong(setGroupId))
		.map {
			val workout = it.workout
			setGroupRepository.delete(it)
			return@map workout
		}
		.map { workoutMapper.toGraphQL(it) }
		.orElseThrow { IllegalArgumentException("SetGroup with ID $setGroupId not found") }

	override fun addNewSet(setGroupId: String, set: SetInput): Workout =
		setGroupRepository.findById(parseLong(setGroupId))
			.map {
				val set = workoutMapper.toEntity(set)
				return@map it.copy(
					sets = listOf(*it.sets.toTypedArray(), set)
				)
			}
			.map { setGroupRepository.save(it) }
			.map { it.workout }
			.map { workoutMapper.toGraphQL(it) }
			.orElseThrow { IllegalArgumentException("SetGroup with ID $setGroupId not found") }

	override fun updateSet(setId: String, set: SetInput): Workout =
		exerciseSetRepository.findById(parseLong(setId))
			.map {
				val updatedSet = workoutMapper.toEntity(set)
				return@map it.copy(
					exercise = updatedSet.exercise,
					repetitions = updatedSet.repetitions,
					weight = updatedSet.weight,
					weightUnit = updatedSet.weightUnit,
					setType = updatedSet.setType,
					restAfter = updatedSet.restAfter,
				)
			}
			.map { exerciseSetRepository.save(it) }
			.map { it.setGroup.workout }
			.map { workoutMapper.toGraphQL(it) }
			.orElseThrow { IllegalArgumentException("Set with ID $setId not found") }

	override fun deleteSet(setId: String): Workout = exerciseSetRepository.findById(parseLong(setId)).map {
		val workout = it.setGroup.workout
		exerciseSetRepository.delete(it)
		return@map workout
	}.map { workoutMapper.toGraphQL(it) }.orElseThrow { IllegalArgumentException("Set with ID $setId not found") }
}