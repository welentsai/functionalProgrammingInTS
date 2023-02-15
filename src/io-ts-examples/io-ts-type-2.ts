import * as t from 'io-ts'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { PathReporter } from 'io-ts/PathReporter'

interface NonEmptyString50Brand {
  readonly NonEmptyString50: unique symbol
}

const NonEmptyString50 = t.brand(
  t.string,
  (s: string): s is t.Branded<string, NonEmptyString50Brand> =>
    s.length > 0 && s.length <= 50,
  'NonEmptyString50'
)

type NonEmptyString50 = t.TypeOf<typeof NonEmptyString50>

// decode -> from primitive type to opaque type
console.log(PathReporter.report(NonEmptyString50.decode(42))) // validation
console.log(PathReporter.report(NonEmptyString50.decode('123')))
console.log('3->',NonEmptyString50.decode('123'))

// from brand type to primitive type
const decodeResult = pipe(
  NonEmptyString50.decode('123'),
  E.match(
    (e) => `Invalid input`,
    (data) => `${data}`
  )
)
console.log('decode result ->', decodeResult)

const GroupCodec = t.type({
  id: NonEmptyString50,
  name: t.string
})

console.log(GroupCodec.decode({ id: '123', name: 'welen!' }))
console.log(
  GroupCodec.decode({
    id: '123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    name: 'welen'
  })
)

const result = pipe(
  { id: '123', name: 'welen' },
  GroupCodec.decode,
  E.match(
    (e) => `Invalid input`,
    (data) => `${data.id} ${data.name}`
  )
)

console.log('opaque -> primitive:', result)

// const result = GroupCodec.encode({id: '123', name: 'welen'})
