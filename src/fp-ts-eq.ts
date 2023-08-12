// Eq definition

// interface Eq<A> {
//   /** returns `true` if `x` is equal to `y` */
//   readonly equals: (x: A, y: A) => boolean
// }

import { Eq } from 'fp-ts/Eq'
import { struct } from 'fp-ts/Eq'
import { contramap } from 'fp-ts/Eq'

// 建立Eq (方法1)
const eqNumber: Eq<number> = {
  equals: (x, y) => x === y
}

// function elem<A>(e: Eq<A>): (a: A, as: Array<A>) => boolean {
//   return (a, as) => as.some((item) => e.equals(item, a))
// }

function elem<A>(e: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some((item) => e.equals(item, a))
}

console.log(elem(eqNumber)(1, [1, 2, 3])) // true
console.log(elem(eqNumber)(4, [1, 2, 3])) // false

//-------------------------

//
type Point = {
  x: number
  y: number
}

// Eq for complex types
// 建立Eq (方法2 使用 struct utility)
const eqPoint: Eq<Point> = struct({
  x: eqNumber,
  y: eqNumber
})

const pointA = {
  x: 5,
  y: 5
}

const pointB = {
  x: 5,
  y: 5
}

console.log(eqPoint.equals(pointA, pointB))

// Finally another useful way to build an Eq instance is the contramap combinator
// given an instance of Eq for A and a function from B to A, we can derive an instance of Eq for B

// export declare const contramap: <A, B>(f: (b: B) => A) => (fa: Eq<A>) => Eq<B>

type User = {
  userId: number
  name: string
}

// 建立Eq (方法3 使用 contramap utility)
/** two users are equal if their `userId` field is equal */
const eqUser = contramap((user: User) => user.userId)(eqNumber)

console.log(
  'eqUser',
  eqUser.equals(
    { userId: 1, name: 'Giulio' },
    { userId: 1, name: 'Giulio Canti' }
  )
) // true
console.log(
  'eqUser',
  eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 2, name: 'Giulio' })
) // false
