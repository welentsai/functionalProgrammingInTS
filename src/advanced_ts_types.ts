import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { cons } from 'fp-ts-contrib/lib/List'

/**
 *  Conditional Types **************************
 */
type SomeType = number
type MyConditionalType = SomeType extends string ? string : null

function someFunction<T>(value: T) {
  type A = T extends boolean ? 'TYPE A' : 'TYPE B'
  const someOtherFunction = (
    someArg: T extends boolean ? 'TYPE A' : 'TYPE B'
  ) => {
    const a: 'TYPE A' | 'TYPE B' = someArg
  }
  return someOtherFunction
}

const result = someFunction(true)

/**
 *  Indexed Access Types **************************
 */

interface ColorVariants {
  primary: 'blue'
  secondary: 'red'
  tertiary: 'green'
}

type PrimaryColor = ColorVariants['primary']
type NonPrimaryColor = ColorVariants['secondary' | 'tertiary']
type EveryColor = ColorVariants[keyof ColorVariants]

type Letters = ['a', 'b', 'c']
type AOrB = Letters[0 | 1]
type Letter = Letters[number]

interface UserRoleConfig {
  user: ['view', 'update']
  superAdmin: ['view', 'create', 'delete']
}

type Role = UserRoleConfig[keyof UserRoleConfig][number]

/**
 *  Function Signature **************************
 */

declare const getCategoryById: (id: string) => E.Either<Error, O.Option<string>>

// Unique resource identifier — a type tag:

// Variables can be declared using const
const URIOri = 'Task'
console.log(URIOri)
// typeof 是 type predicates

// Type aliases create a new name for a type,  type aliases can act sort of like interfaces
// URI is a type alias
type URI = typeof URIOri

const a: URI = 'Task' // pass compiler check
// const b: URI = 'TaskC' // can not pass compiler check