import * as t from 'io-ts'
import * as E from 'fp-ts/Either'

// using typeof to refer and get basic types
// ReturnType<T>. It takes a function type and produces its return type:
let s = "hello";
let n: typeof s;

type Predicate = (x: unknown) => boolean;  // function type
type K = ReturnType<Predicate>;  // produces its return type

// 'f' refers to a value
function f() {
    return { x: 10, y: 3 };
}

console.log("typeof f => ", typeof f)

// ReturnType<T>. It takes a function type and produces its return type:
type P = ReturnType<typeof f>;


// interface

interface Person {
    name: string;
    age: number;
}


// 
const conference = {
    name: 'MOPCON',
    year: 2021,
    isAddToCalendar: true,
    website: 'https://mopcon.org/2021/',
};

type Conference = typeof conference
type ConferenceKeys = keyof typeof conference;


/**
 * Type<A, O, I> (called “codec”) is the runtime representation of the static type A
 * 
 * A codec can:
 *  - decode input of type I
 *  - encode output of type O
 *  - be used as a custom type guard
 */

const myString = new t.Type<string, string, unknown>(
    'string',
    (input: unknown): input is string => typeof input === 'string',
    (input:unknown, context: t.Context) =>  (typeof input === 'string' ? t.success(input) : t.failure(input, context)),
    t.identity
)


console.log("decode string", myString.decode('a string'))
console.log("decode null", myString.decode(null))



console.log('typeof a => ', typeof 'a')



/**
 * We can combine these codecs through combinators to build composite types
 */

const GroupCodec = t.type({
    id: t.number,
    name: t.string,
});


//***  typeof => evaluate the return value of some identifier
type t = typeof GroupCodec

/**
 * The advantage of using io-ts to define the runtime type is that we can validate the type at runtime, 
 * and we can also extract the corresponding static type, so we don’t have to define it twice.
 * 
 * t.TypeOf wil evaluate the return value of (typeof GroupCodec)
 */
export type Group = t.TypeOf<typeof GroupCodec>;

/**
 *  解釋
 *  -  input is tring  => 這是 type guard (type predicate), 在 compiler time 有用, 但runtime 沒有差別
 *  -  a 是一個 predicate function , unknown => boolean
 */
const a = (input: unknown): input is string => typeof input === 'string'

console.log("a", a(null))


const b = (input:unknown, context: t.Context) =>  (typeof input === 'string' ? t.success(input) : t.failure(input, context, `Unknown Color ${input}`))

console.log(b(null, [])) 
/**
 {
   _tag: 'Left',
   left: [ { value: null, context: null, message: 'Unknown Color null' } ]
}
 */
console.log(b('string', [])) // { _tag: 'Right', right: 'string' }