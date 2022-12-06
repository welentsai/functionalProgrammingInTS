import * as t from 'io-ts'

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

// io-ts 

const GroupCodec = t.type({
    id: t.number,
    name: t.string,
});


type t = typeof GroupCodec

// t.TypeOf wil evaluate the return value of (typeof GroupCodec)
export type Group = t.TypeOf<typeof GroupCodec>;


