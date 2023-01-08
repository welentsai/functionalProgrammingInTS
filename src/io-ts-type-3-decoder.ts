import * as E from 'fp-ts/Either'
import * as t from 'io-ts'
import * as D from 'io-ts/Decoder'
import { pipe } from 'fp-ts/function'

interface VersionBrand {
  readonly Version: unique symbol // use `unique symbol` here to ensure uniqueness across modules / packages
}

const TypeVersion = t.brand(
  t.string, // a codec representing the type to be refined
  (value: string): value is t.Branded<string, VersionBrand> =>
    /^\d+\.\d+\.\d+$/.test(value), // a custom type guard using the build-in helper `Branded`
  'Version' // the name must match the readonly field in the brand
)

const TypeMyStruct = t.type({
  version: TypeVersion
})

/**
 * Question: How io-ts derive an unbranded version from a branded version of a type?
 *
 * 可以用 decode 可以把 unbranded type 變成 branded type
 * 問題: 要如何把一個 branded type 變回 unbranded type
 */

type Version = t.TypeOf<typeof TypeVersion>
// type MyStruct = t.TypeOf<typeof TypeMyStruct>;

// Solution 1  - Extracting the the base type from a branded type
type BrandedBase<T> = T extends t.Branded<infer U, unknown> ? U : T
type Input = BrandedBase<Version> // string

// Solution 2 - Using the branded type docoder

const MyInputStruct = D.struct({
  version: D.string
})

const isVersionString = (
  value: string
): value is t.Branded<string, VersionBrand> => /^\d+\.\d+\.\d+$/.test(value)

const VersionType = pipe(
  D.string,
  D.refine(isVersionString, 'Invalid Version !!')
)

const MyStruct = pipe(
  MyInputStruct,
  D.parse(({ version }) =>
    pipe(
      VersionType.decode(version),
      E.map((ver) => ({
        version: ver
      }))
    )
  )
)

console.log(MyStruct.decode({ version: '1.2.3' })) // { _tag: 'Right', right: { version: '1.2.3' } }
console.log(MyStruct.decode({ version: '123' })) //{_tag: 'Left', left: { _tag: 'Of', value: { _tag: 'Leaf', actual: '123', error: 'Invalid Version !' }}}

//  test 3 -- using io-ts codec decode first

function useVersion(version: Version) {
  // Does something with the branded type
  console.log(`version is ${version}`)
}

const result = (args: unknown) =>
  pipe(
    TypeMyStruct.decode(args),
    E.map(({ version }) => useVersion(version)),
    E.fold(
      (l: t.Errors): void => console.error(l),
      (r) => {}
    )
  )

console.log(result({ version: '1.2.3' })) // [{ value: '123', context: [ [Object], [Object] ], message: undefined }]
console.log(result({ version: '123' })) // undefined
