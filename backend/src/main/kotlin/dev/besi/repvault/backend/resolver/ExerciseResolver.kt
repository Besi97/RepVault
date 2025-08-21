package dev.besi.repvault.backend.resolver

import dev.besi.repvault.backend.data.repository.ExerciseRepository
import dev.besi.repvault.backend.mapper.ExerciseMapper
import dev.besi.repvault.lib.graphql.api.CreateExerciseMutationResolver
import dev.besi.repvault.lib.graphql.api.DeleteExerciseMutationResolver
import dev.besi.repvault.lib.graphql.api.ExercisesQueryResolver
import dev.besi.repvault.lib.graphql.api.UpdateExerciseMutationResolver
import dev.besi.repvault.lib.graphql.model.*
import org.springframework.data.domain.*
import org.springframework.stereotype.Controller
import java.lang.Long.parseLong
import java.util.*

@Controller
class ExerciseResolver(
	private val exerciseRepository: ExerciseRepository,
	private val exerciseMapper: ExerciseMapper,
) : ExercisesQueryResolver,
	CreateExerciseMutationResolver,
	UpdateExerciseMutationResolver,
	DeleteExerciseMutationResolver {

	override fun exercises(filters: ExerciseFilters?, pagination: PaginationInput?): ExercisesResponse =
		Optional.ofNullable(filters?.id).map { parseLong(it) }.map {
			exerciseRepository.findById(it)
				.orElseThrow { IllegalArgumentException("Exercise with ID ${filters?.id} not found") }
		}.map<Page<dev.besi.repvault.backend.data.entity.Exercise>> { PageImpl(listOf(it)) }.or {
			val sort = Sort.by("name")
			val pageRequest = Optional.ofNullable(pagination).map<Pageable> {
				PageRequest.of(it.pageIndex ?: 0, it.count, sort)
			}.orElse(Pageable.unpaged(sort))
			return@or Optional.of(filters?.name?.let {
				exerciseRepository.findAllByNameContainsIgnoreCase(
					it,
					pageRequest
				)
			} ?: exerciseRepository.findAll(pageRequest))
		}.map {
			ExercisesResponse(
				exerciseMapper.toGraphQL(it.content),
				PageInfo(it.number, it.totalPages > it.number + 1),
				it.totalElements.toInt()
			)
		}.get()

	override fun createExercise(input: ExerciseInput): Exercise =
		exerciseRepository.save(exerciseMapper.toEntity(input)).let { exerciseMapper.toGraphQL(it) }

	override fun updateExercise(id: String, input: ExerciseInput): Exercise = exerciseRepository.findById(parseLong(id))
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

	override fun deleteExercise(id: String): Boolean = exerciseRepository.findById(parseLong(id))
		.map { exerciseRepository.delete(it) }
		.map { true }
		.orElseThrow { IllegalArgumentException("Exercise with ID $id not found") }
}