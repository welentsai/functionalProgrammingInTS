import { describe, it, expect, assert } from 'vitest'
import { NotFoundError } from '../../src/effect_schema/validationError'
import * as E from 'fp-ts/Either'

// The two tests marked with concurrent will be run in parallel
describe('validation test suite', () => {
    it('NotFoundError test', async () => {
        const notFoundError = { _tag: 'NotFoundError', message: 'resource not found' }
        const result = NotFoundError.of('resource not found')
        assert.deepStrictEqual(result, E.right(notFoundError))
    })
})