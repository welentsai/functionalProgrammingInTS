import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { category } from 'fp-ts'

type Category = {
  id: string
  slug: string
}

const categories: Category[] = [
  { id: '1', slug: 'a' },
  { id: '2', slug: 'b' },
  { id: '3', slug: 'c' }
]

// Functions to retrieve the category from the database
// declare const getCategoryById: (id: string) => E.Either<Error, O.Option<Category>>
const getCategoryById: (id: string) => E.Either<Error, O.Option<Category>> = (
  id: string
) =>
  pipe(
    O.fromNullable(id),
    O.chain((id) => O.fromNullable(categories.find((c) => c.id === id))),
    O.match(
      () => E.right(O.none),
      (category) => E.right(O.of(category))
    )
  )

//declare const getCategoryBySlug: (slug: string) => E.Either<Error, O.Option<Category>>
const getCategoryBySlug: (
  slug: string
) => E.Either<Error, O.Option<Category>> = (slug: string) =>
  pipe(
    O.fromNullable(slug),
    O.chain((slug) => O.fromNullable(categories.find((c) => c.slug === slug))),
    O.match(
      () => E.right(O.none),
      (cat) => E.right(O.of(cat))
    )
  )

const getCategory = (category: unknown): E.Either<Error, O.Option<Category>> =>
  pipe(
    O.fromNullable(category),
    O.filter((c): c is Partial<Category> => typeof c === 'object'),
    O.match(
      // If it's None, return Right(None)
      () => E.right(O.none),
      // If it's Some(category)...
      (category) =>
        // Retrieve the category from the database
        category?.id
          ? getCategoryById(category.id)
          : category?.slug
          ? getCategoryBySlug(category.slug)
          : // If there's no id or slug, return Right(None)
            E.right(O.none)
    )
  )

console.log(getCategory({ id: '1', slug: null }))
console.log(getCategory({ id: null, slug: null }))
console.log(getCategory({ id: null, slug: 'c' }))
