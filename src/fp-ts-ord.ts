import { Ord, fromCompare, contramap, reverse } from 'fp-ts/Ord'

// A type class Ord, intended to contain types that admit a total ordering

/**
 x < y => compare(x,y) = -1
 x = y => compare(x,y) = 0
 x > y => compare(x,y) = 1
 */

// 方法1
const ordNumber: Ord<number> = {
  equals: (x, y) => x === y,
  // equals: (x, y) => x === y,
  compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0)
}

console.log(ordNumber.compare(1, 2))

// 方法2 : fromCompare utility
const ordNumber2: Ord<number> = fromCompare((x, y) =>
  x < y ? -1 : x > y ? 1 : 0
)

function min<A>(o: Ord<A>): (x: A, y: A) => A {
  return (x, y) => (o.compare(x, y) === 1 ? y : x)
}

console.log(min(ordNumber)(2, 1)) // 1A

type User = {
  name: string
  age: number
}

const byAge: Ord<User> = fromCompare((x, y) => ordNumber.compare(x.age, y.age))
const byAge2: Ord<User> = contramap((user: User) => user.age)(ordNumber)

console.log(
  'byAge',
  byAge.compare({ name: 'Giulio', age: 12 }, { name: 'Giulio Canti', age: 15 })
) // -1

console.log(
  'byAge2',
  byAge2.compare({ name: 'Giulio', age: 12 }, { name: 'Giulio Canti', age: 15 })
) // -1

const getYounger = min(byAge)
console.log(
  'getYounger',
  getYounger({ name: 'Guido', age: 44 }, { name: 'Giulio', age: 45 })
) // { name: 'Giulio', age: 44 }

// reverse

function max<A>(ord: Ord<A>): (x: A, y: A) => A {
  return min(reverse(ord))
}

const getOlder = max(byAge2)
console.log(
  'getOlder',
  getOlder({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 })
) // getOlder { name: 'Guido', age: 48 }
