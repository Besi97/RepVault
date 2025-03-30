package dev.besi.repvault.backend

import org.mapstruct.Mapper
import dev.besi.repvault.backend.data.entity.Exercise
import dev.besi.repvault.lib.graphql.model.Exercise as GraphQLExercise

@Mapper(componentModel = "spring")
interface ExerciseMapper {
    fun toGraphQL(exercise: Exercise): GraphQLExercise
}