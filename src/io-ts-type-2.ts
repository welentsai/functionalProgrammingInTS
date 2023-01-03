import * as t from 'io-ts'
import * as E from 'fp-ts/Either'
import {pipe} from 'fp-ts/lib/function'
import { PathReporter } from 'io-ts/PathReporter'

interface NonEmptyString50Brand {
    readonly NonEmptyString50: unique symbol
}

const NonEmptyString50 = t.brand(
    t.string,
    (s: string): s is t.Branded<string, NonEmptyString50Brand> => s.length > 0 && s.length <= 50,
    'NonEmptyString50'
    )

type NonEmptyString50 = t.TypeOf<typeof NonEmptyString50>

console.log(PathReporter.report(NonEmptyString50.decode(42)))


const GroupCodec = t.type({
    id: NonEmptyString50,
    name: t.string,
});

console.log(GroupCodec.decode({id: '123', name: 'welen'}))
console.log(GroupCodec.decode({id: '123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', name: 'welen'}))

