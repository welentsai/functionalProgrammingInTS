import { pipe } from 'fp-ts/lib/function'
import * as t from 'io-ts'
import * as E from 'fp-ts/Either'

interface TimestampBrand {
  readonly Timestamp: unique symbol
}

const Timestamp = t.brand(
  t.Int,
  (t: t.Int): t is t.Branded<t.Int, TimestampBrand> => t >= -8640000000000000 && t <= 8640000000000000,
  'Timestamp'
)


/**
 * Type<A, O, I> (called “codec”) is the runtime representation of the static type A
 *
 * A codec can:
 *  - decode input of type I
 *  - encode output of type O
 *  - be used as a custom type guard
 */

const DateFromStringCodec = new t.Type<Date, string, unknown>(
  'DateFromString',
  (u): u is Date => u instanceof Date,
  (u, c) =>
    E.Monad.chain(t.string.validate(u, c), (s) => {
      const d = new Date(s)
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d)
    }),
  (a) => a.toISOString()
)

export type DateFromString = t.TypeOf<typeof DateFromStringCodec>

console.log(DateFromStringCodec.decode('2022-01-01'))
console.log(DateFromStringCodec.encode(new Date(1973, 10, 30)))


const myStructCodec = t.type({
    myStr: t.string,
    myDate: DateFromStringCodec
})

console.log(myStructCodec.decode({myStr: '123', myDate: '2022-01-01'}))


const result = pipe(
    {myStr: '123', myDate: '2022-01-01a'},
    myStructCodec.decode,
    E.map(data => data.myDate)
)

console.log(result)
