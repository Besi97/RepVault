package dev.besi.repvault.backend.mapper

import dev.besi.repvault.backend.data.entity.*
import dev.besi.repvault.backend.data.repository.ExerciseRepository
import dev.besi.repvault.backend.data.repository.SetGroupRepository
import dev.besi.repvault.lib.graphql.model.SetInput
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.springframework.beans.factory.annotation.Autowired
import dev.besi.repvault.lib.graphql.model.Set as GraphQLSet
import dev.besi.repvault.lib.graphql.model.SetGroup as GraphQLSetGroup
import dev.besi.repvault.lib.graphql.model.SetType as GraphQLSetType
import dev.besi.repvault.lib.graphql.model.WeightUnit as GraphQLWeightUnit
import dev.besi.repvault.lib.graphql.model.Workout as GraphQLWorkout

@Mapper(componentModel = "spring")
abstract class WorkoutMapper {
	@Autowired
	private lateinit var exerciseRepository: ExerciseRepository
	@Autowired
	private lateinit var setGroupRepository: SetGroupRepository

	abstract fun toGraphQL(workout: Workout): GraphQLWorkout
	abstract fun toGraphQL(setGroup: SetGroup): GraphQLSetGroup
	abstract fun toGraphQL(set: ExerciseSet): GraphQLSet
	abstract fun toGraphQl(unit: GraphQLWeightUnit?): WeightUnit
	abstract fun toGraphQl(type: GraphQLSetType?): SetType

	@Mapping(target = "exercise", source = "exerciseId")
	abstract fun toEntity(set: SetInput): ExerciseSet
	@Mapping(target = "exercise", source = "set.exerciseId")
	@Mapping(target = "setGroup", source = "setGroupId")
	abstract fun toEntity(setGroupId: String, set: SetInput): ExerciseSet
	abstract fun toEntity(unit: WeightUnit?): GraphQLWeightUnit
	abstract fun toEntity(type: SetType?): GraphQLSetType

	fun toExercise(id: String): Exercise =
		exerciseRepository.findById(id.toLong())
			.orElseThrow { IllegalArgumentException("Exercise with ID $id not found") }

	fun toSetGroup(id: String): SetGroup =
		setGroupRepository.findById(id.toLong())
			.orElseThrow { IllegalArgumentException("SetGroup with ID $id not found") }
}
