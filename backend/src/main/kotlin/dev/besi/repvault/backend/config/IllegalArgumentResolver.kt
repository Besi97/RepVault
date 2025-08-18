package dev.besi.repvault.backend.config

import graphql.GraphQLError
import graphql.GraphqlErrorBuilder
import graphql.schema.DataFetchingEnvironment
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter
import org.springframework.graphql.execution.ErrorType
import org.springframework.stereotype.Component

@Component
class IllegalArgumentResolver : DataFetcherExceptionResolverAdapter() {
	override fun resolveToSingleError(
		ex: Throwable,
		env: DataFetchingEnvironment
	): GraphQLError? =
		if (ex is IllegalArgumentException) {
			GraphqlErrorBuilder.newError()
				.errorType(ErrorType.BAD_REQUEST)
				.message(ex.message)
				.path(env.executionStepInfo.path)
				.location(env.field.sourceLocation)
				.build()
		} else {
			null
		}
}