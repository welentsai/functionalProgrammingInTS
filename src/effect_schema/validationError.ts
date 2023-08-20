import * as S from '@effect/schema/Schema'
import { pipe, flow } from 'fp-ts/function'
import * as E from 'fp-ts/Either'

const String50 = S.string.pipe(S.maxLength(50))

type ErrorMessageTooLongError = {
    _tag: string,
    message: string
}

const errorMessageTooLongError: ErrorMessageTooLongError = {
    _tag: 'ErrorMessageTooLongError',
    message: 'Error message too long !'
}

const NotFoundErrorSchema = S.struct({
    _tag: S.literal('NotFoundError'),
    message: String50
})

const errorMessageTooLongErrorOf = (message: unknown) => pipe(
    message,
    S.parseEither(String50),
    E.map((message) => ({
        _tag: 'NotFoundError',
        message
    })),
    E.mapLeft(() => errorMessageTooLongError)
)

export type NotFoundError = S.To<typeof NotFoundErrorSchema>
export const NotFoundError = {
    schema: NotFoundErrorSchema,
    of: errorMessageTooLongErrorOf
}


const InvalidArgumentErrorSchema = S.struct({
    _tag: S.literal('InvalidArgumentError'),
    message: String50
})

const invalidArgumentErrorOf = (message: unknown) => pipe(
    message,
    S.parseEither(String50),
    E.map((message) => ({
        _tag: 'InvalidArgumentError',
        message
    })),
    E.mapLeft(() => errorMessageTooLongError)
)

export type InvalidArgumentError = S.To<typeof InvalidArgumentErrorSchema>
export const InvalidArgumentError = {
    schema: InvalidArgumentErrorSchema,
    of: invalidArgumentErrorOf
}

const validationErrorSchema = S.union(NotFoundErrorSchema, InvalidArgumentErrorSchema)

const validationErrorSchemaOf = flow(
    S.parseEither(validationErrorSchema),
    E.mapLeft(() => errorMessageTooLongError),
)

export type ValidationError = S.To<typeof validationErrorSchema>
export const ValidationError = {
    schema: validationErrorSchema,
    of: validationErrorSchemaOf
}



