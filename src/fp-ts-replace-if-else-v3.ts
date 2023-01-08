import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
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

const categories: Category[] = [
  { id: '1', slug: 'a' },
  { id: '2', slug: 'b' },
  { id: '3', slug: 'c' }
]

const getCategory = (
  possibleCategory: PossibleCategory,
  categories: Category[]
) =>
  pipe(
    categoryById(possibleCategory, categories),
    O.alt(() => categoryBySlug(possibleCategory, categories))
  )

const categoryById = (
  possibleCategory: PossibleCategory,
  categories: Category[]
): O.Option<Category> =>
  pipe(
    O.fromNullable(possibleCategory?.id),
    O.chain((id) =>
      pipe(
        categories,
        A.findFirst((c) => c.id === id)
      )
    )
  )

const categoryBySlug = (
  possibleCategory: PossibleCategory,
  categories: Category[]
): O.Option<Category> =>
  pipe(
    O.fromNullable(possibleCategory?.slug),
    O.chain((slug) =>
      pipe(
        categories,
        A.findFirst((c) => c.slug === slug)
      )
    )
  )

console.log(getCategory({ id: 'string' }, categories))
console.log(getCategory({ id: '1' }, categories))
console.log(getCategory({}, categories))
console.log(getCategory({ slug: 'b' }, categories))
console.log(getCategory(undefined, categories))
