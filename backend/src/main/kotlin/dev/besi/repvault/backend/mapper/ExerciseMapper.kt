package dev.besi.repvault.backend.mapper

import dev.besi.repvault.backend.data.entity.*
import dev.besi.repvault.lib.graphql.model.ExerciseInput
import org.mapstruct.Mapper
import dev.besi.repvault.lib.graphql.model.Category as GraphQLCategory
import dev.besi.repvault.lib.graphql.model.Equipment as GraphQLEquipment
import dev.besi.repvault.lib.graphql.model.Exercise as GraphQLExercise
import dev.besi.repvault.lib.graphql.model.Force as GraphQLForce
import dev.besi.repvault.lib.graphql.model.Level as GraphQLLevel
import dev.besi.repvault.lib.graphql.model.Mechanic as GraphQLMechanic

@Mapper(componentModel = "spring")
interface ExerciseMapper {
	fun toGraphQL(exercise: Exercise): GraphQLExercise

	fun toEntity(exercise: ExerciseInput): Exercise

	// Enum mappings from ExerciseInput to entity enums
	fun toEntityForce(force: GraphQLForce?): Force
	fun toEntityLevel(level: GraphQLLevel?): Level
	fun toEntityMechanic(mechanic: GraphQLMechanic?): Mechanic
	fun toEntityEquipment(equipment: GraphQLEquipment?): Equipment
	fun toEntityCategory(category: GraphQLCategory?): Category
	fun toEntityMuscle(muscle: dev.besi.repvault.lib.graphql.model.Muscle?): Muscle
	fun toEntityMuscles(muscles: Collection<dev.besi.repvault.lib.graphql.model.Muscle>?): Collection<Muscle>

	// Enum mappings from entity enums to GraphQL enums
	fun toGraphQLForce(force: Force?): GraphQLForce
	fun toGraphQLLevel(level: Level?): GraphQLLevel
	fun toGraphQLMechanic(mechanic: Mechanic?): GraphQLMechanic
	fun toGraphQLEquipment(equipment: Equipment?): GraphQLEquipment
	fun toGraphQLCategory(category: Category?): GraphQLCategory
	fun toGraphQLMuscle(muscle: Muscle?): dev.besi.repvault.lib.graphql.model.Muscle
	fun toGraphQLMuscles(muscles: Collection<Muscle>?): Collection<dev.besi.repvault.lib.graphql.model.Muscle>
}