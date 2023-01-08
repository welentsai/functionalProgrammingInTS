import * as O from 'fp-ts/Option'
import { pipe, flow, identity } from 'fp-ts/function'
import * as t from 'io-ts'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'

type Category = {
  id: string
  slug: string
}

const PossibleCategory = t.union([
  t.partial({
    id: t.string,
    slug: t.string
  }),
  t.undefined
])

type PossibleCategory = t.TypeOf<typeof PossibleCategory>

type GetCategory = (x: string) => E.Either<Error, O.Option<Category>>

const categories: Category[] = [
  { id: '1', slug: 'a' },
  { id: '2', slug: 'b' },
  { id: '3', slug: 'c' }
]

// placeholders for db calls
// const getCategoryById: GetCategory = (x: string) => E.right(O.none)
const getCategoryById: GetCategory = (id: string) =>
  pipe(
    O.fromNullable(id),
    O.chain((id) =>
      pipe(
        categories,
        A.findFirst((c) => c.id === id)
      )
    ),
    O.fold(
      () => E.right(O.none),
      (c) => E.right(O.some(c))
    )
  )
// const getCategoryBySlug: GetCategory = (x: string) => E.right(O.none)
const getCategoryBySlug: GetCategory = (slug: string) =>
  pipe(
    O.fromNullable(slug),
    O.chain((slug) =>
      pipe(
        categories,
        A.findFirst((c) => c.slug === slug)
      )
    ),
    O.fold(
      () => E.right(O.none),
      (c) => E.right(O.some(c))
    )
  )

const getCategory = (possibleCategory: PossibleCategory) =>
  pipe(
    categoryById(possibleCategory),
    E.chain(
      O.fold(
        () => categoryBySlug(possibleCategory),
        (c) => E.right(O.some(c))
      )
    )
  )

const categoryById = (possibleCategory: PossibleCategory) =>
  pipe(
    O.fromNullable(possibleCategory?.id),
    O.map(
      flow(
        getCategoryById,
        E.chainOptionK(() => new Error('id not found'))(identity)
      )
    ),
    O.sequence(E.Monad)
  )

const categoryBySlug = (possibleCategory: PossibleCategory) =>
  pipe(
    O.fromNullable(possibleCategory?.slug),
    O.map(
      flow(
        getCategoryBySlug,
        E.chainOptionK(() => new Error('slug not found'))(identity)
      )
    ),
    O.sequence(E.Monad)
  )

console.log(getCategory({ id: 'string' }))
console.log(getCategory({ id: '1' }))
console.log(getCategory({ slug: 'D' }))
console.log(getCategory({ slug: 'b' }))
