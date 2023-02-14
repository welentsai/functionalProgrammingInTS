import { Predicate } from 'fp-ts/Predicate'
import { getSemigroup } from 'fp-ts/function'
import * as B from 'fp-ts/boolean'
import assert from "assert"

const f: Predicate<number> = (n) => n <= 2
const g: Predicate<number> = (n) => n >= 0

const S1 = getSemigroup(B.SemigroupAll)<number>()

assert.deepStrictEqual(S1.concat(f, g)(1), true)
assert.deepStrictEqual(S1.concat(f, g)(3), false)

const S2 = getSemigroup(B.SemigroupAny)<number>()

assert.deepStrictEqual(S2.concat(f, g)(1), true)
assert.deepStrictEqual(S2.concat(f, g)(3), true)

console.log(`ok`)
