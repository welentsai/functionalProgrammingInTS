import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'

interface Category {
  id: string
  slug: string
}

const categories: Category[] = [
  { id: '1', slug: 'a' },
  { id: '2', slug: 'b' },
  { id: '3', slug: 'c' }
]

function getCategory(categoryId: string | null, slug: string | null) {
  const id = O.fromNullable(categoryId)
  const s = O.fromNullable(slug)

  return pipe(
    id,
    O.chain((id) => O.fromNullable(categories.find((c) => c.id === id))),
    O.alt(() =>
      pipe(
        s,
        O.chain((someSlug) =>
          O.fromNullable(categories.find((c) => c.slug === someSlug))
        )
      )
    )
  )
}

console.log(getCategory('1', null))
console.log(getCategory(null, null))
console.log(getCategory(null, 'c'))
