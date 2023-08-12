import { Predicate } from 'fp-ts/Predicate'
import { getSemigroup } from 'fp-ts/function'
import * as B from 'fp-ts/boolean'
import assert from 'assert'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/Semigroup'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as A from 'fp-ts/Array'

const f: Predicate<number> = (n) => n <= 2
const g: Predicate<number> = (n) => n >= 0

const S1 = getSemigroup(B.SemigroupAll)<number>()

assert.deepStrictEqual(S1.concat(f, g)(1), true)
assert.deepStrictEqual(S1.concat(f, g)(3), false)

const S2 = getSemigroup(B.SemigroupAny)<number>()

assert.deepStrictEqual(S2.concat(f, g)(1), true)
assert.deepStrictEqual(S2.concat(f, g)(3), true)

console.log(`ok`)

/**

interface Semigroup<A> {
  concat: (x: A, y: A) => A
}

// Semigroups capture the essence of parallelizable operations

 */

const semigroupProduct: S.Semigroup<number> = {
  concat: (x, y) => x * y
}

console.log(semigroupProduct.concat(2, 2))

const semigroupSum: S.Semigroup<number> = {
  concat: (x, y) => x + y
}

const semigroupString: S.Semigroup<string> = {
  concat: (x, y) => x + y
}

/** Always return the first argument */
function getFirstSemigroup<A = never>(): S.Semigroup<A> {
  return { concat: (x, y) => x }
}

/** Always return the second argument */
function getLastSemigroup<A = never>(): S.Semigroup<A> {
  return { concat: (x, y) => y }
}

function getArraySemigroup<A = any>(): S.Semigroup<Array<A>> {
  return { concat: (x, y) => x.concat(y) }
}

function of<A>(a: A): Array<A> {
  return [a]
}

console.log(getArraySemigroup().concat(['a', 1], ['b']))

const semigroupMin: S.Semigroup<number> = S.min(N.Ord)

console.log(semigroupMin.concat(1, 2))

const semigroupMax: S.Semigroup<number> = S.max(N.Ord)
console.log(semigroupMax.concat(1, 2))

type Point = {
  x: number
  y: number
}

const semigroupPoint: S.Semigroup<Point> = {
  concat: (p1, p2) => ({
    x: semigroupSum.concat(p1.x, p2.x),
    y: semigroupSum.concat(p1.y, p2.y)
  })
}

console.log(
  'semigroupPoint',
  semigroupPoint.concat({ x: 1, y: 2 }, { x: 3, y: 4 })
)

const semigroupPoint2: S.Semigroup<Point> = S.struct({
  x: semigroupSum,
  y: semigroupSum
})

console.log(
  'semigroupPoint2',
  semigroupPoint2.concat({ x: 1, y: 2 }, { x: 3, y: 4 })
)

type Vector = {
  from: Point
  to: Point
}

const semigroupVector: S.Semigroup<Vector> = S.struct({
  from: semigroupPoint,
  to: semigroupPoint
})

/** `semigroupAll` is the boolean semigroup under conjunction */
const semigroupPredicate: S.Semigroup<(p: Point) => boolean> = getSemigroup(
  B.SemigroupAll
)<Point>()

const isPositiveX = (p: Point): boolean => p.x >= 0
const isPositiveY = (p: Point): boolean => p.y >= 0

const isPositiveXY = semigroupPredicate.concat(isPositiveX, isPositiveY)

assert.deepStrictEqual(isPositiveXY({ x: 1, y: 1 }), true)
assert.deepStrictEqual(isPositiveXY({ x: 1, y: -1 }), false)
assert.deepStrictEqual(isPositiveXY({ x: -1, y: 1 }), false)
assert.deepStrictEqual(isPositiveXY({ x: -1, y: -1 }), false)

const sum = S.concatAll(semigroupSum)
console.log('sum', sum(0)([1, 2, 3, 4, 5]))

const product = S.concatAll(semigroupProduct)
console.log('product', product(1)([1, 2, 3, 4, 5]))

const S3 = O.getApplySemigroup(semigroupSum)

S3.concat(O.some(1), O.none) // none
S3.concat(O.some(1), O.some(2)) // some(3)

interface Customer {
  name: string
  favouriteThings: Array<string>
  registeredAt: number
  lastUpdatedAt: number
  hasMadePurchase: boolean
}

// merge/combine two duplicate records by using semigroup
const semigroupCustomer: S.Semigroup<Customer> = S.struct({
  // keep the longer name
  name: S.max(Ord.contramap((str: string) => str.length)(N.Ord)),
  // accumulate things
  favouriteThings: A.getMonoid<string>(), // The function getMonoid returns a Semigroup for Array<string>
  // keep the lease recent date
  registeredAt: S.min(N.Ord),
  // keep the most recent date
  lastUpdatedAt: S.max(N.Ord),
  // Boolean semigroup under disjunction
  hasMadePurchase: B.SemigroupAny
})

const result = semigroupCustomer.concat(
  {
    name: 'Giulio',
    favouriteThings: ['math', 'climbing'],
    registeredAt: new Date(2018, 1, 20).getTime(),
    lastUpdatedAt: new Date(2018, 2, 18).getTime(),
    hasMadePurchase: false
  },
  {
    name: 'Giulio Canti',
    favouriteThings: ['functional programming'],
    registeredAt: new Date(2018, 1, 22).getTime(),
    lastUpdatedAt: new Date(2018, 2, 9).getTime(),
    hasMadePurchase: true
  }
)

console.log(result)
