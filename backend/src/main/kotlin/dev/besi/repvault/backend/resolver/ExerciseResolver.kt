package dev.besi.repvault.backend.resolver

import dev.besi.repvault.backend.data.repository.ExerciseRepository
import dev.besi.repvault.backend.mapper.ExerciseMapper
import dev.besi.repvault.lib.graphql.api.CreateExerciseMutationResolver
import dev.besi.repvault.lib.graphql.api.DeleteExerciseMutationResolver
import dev.besi.repvault.lib.graphql.api.ExercisesQueryResolver
import dev.besi.repvault.lib.graphql.api.UpdateExerciseMutationResolver
import dev.besi.repvault.lib.graphql.model.Exercise
import dev.besi.repvault.lib.graphql.model.ExerciseInput
import org.springframework.stereotype.Controller
import java.lang.Long.parseLong
import java.util.Optional

@Controller
class ExerciseResolver(
	private val exerciseRepository: ExerciseRepository,
	private val exerciseMapper: ExerciseMapper
) :
	ExercisesQueryResolver,
	CreateExerciseMutationResolver,
	UpdateExerciseMutationResolver,
	DeleteExerciseMutationResolver {

	override fun exercises(id: String?): List<Exercise> =
		Optional.ofNullable(id)
			.map { parseLong(it) }
			.map {
				exerciseRepository.findById(it)
					.orElseThrow { IllegalArgumentException("Exercise with ID $id not found") }
			}
			.map { listOf(it) }
			.orElse(exerciseRepository.findAll())
			.map { exerciseMapper.toGraphQL(it) }

	override fun createExercise(input: ExerciseInput): Exercise =
		exerciseRepository.save(exerciseMapper.toEntity(input)).let { exerciseMapper.toGraphQL(it) }

	override fun updateExercise(id: String, input: ExerciseInput): Exercise =
		exerciseRepository.findById(parseLong(id))
			.map { existingExercise ->
				existingExercise.copy(
					name = input.name,
					aliases = input.aliases,
					primaryMuscles = exerciseMapper.toEntityMuscles(input.primaryMuscles),
					secondaryMuscles = exerciseMapper.toEntityMuscles(input.secondaryMuscles),
					force = exerciseMapper.toEntityForce(input.force),
					level = exerciseMapper.toEntityLevel(input.level),
					mechanic = exerciseMapper.toEntityMechanic(input.mechanic),
					equipment = exerciseMapper.toEntityEquipment(input.equipment),
					category = exerciseMapper.toEntityCategory(input.category),
					instructions = input.instructions,
					description = input.description,
					tips = input.tips
				)
			}
			.map { exerciseRepository.save(it) }
			.map { exerciseMapper.toGraphQL(it) }
			.orElseThrow { IllegalArgumentException("Exercise with ID $id not found") }

	override fun deleteExercise(id: String): Boolean =
		exerciseRepository.findById(parseLong(id)).map { exerciseRepository.delete(it) }.map { true }
			.orElseThrow { IllegalArgumentException("Exercise with ID $id not found") }
}