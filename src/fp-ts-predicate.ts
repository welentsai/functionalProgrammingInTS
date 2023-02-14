import { Predicate } from "fp-ts/Predicate"
import {getMonoid} from "fp-ts/function"
import * as B from 'fp-ts/boolean'
import assert from "assert"

/**
    -- Predicate 的定義

    export interface Predicate<A> {
        (a: A): boolean
    }

 */

const f: Predicate<number> = (n) => n <= 2
const g: Predicate<number> = (n) => n >= 0

const M1 = getMonoid(B.MonoidAll)<number>()

assert.deepStrictEqual(M1.concat(f,g)(1), true)
assert.deepStrictEqual(M1.concat(f,g)(3), false)

const M2 = getMonoid(B.MonoidAny)<number>()
assert.deepStrictEqual(M2.concat(f,g)(1), true)
assert.deepStrictEqual(M2.concat(f,g)(3), true)

