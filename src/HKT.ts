interface MapForArray {
  readonly map: <A, B>(f: (a: A) => B) => (as: A[]) => B[]
}

// --> MapForXXX can have a lot <--
// type MapForSet   = <A, B>(f: (a: A) => B) => (as: Set<A>) => Set<B>;
// type MapForMap   = <A, B>(f: (a: A) => B) => (as: Map<FixedKeyType, A>) => Map<FixedKeyType, B>;
// type MapForTree  = <A, B>(f: (a: A) => B) => (as: Tree<A>) => Tree<B>;
// type MapForStack = <A, B>(f: (a: A) => B) => (as: Stack<A>) => Stack<B>;

export const URI = 'Identity'

export type URI = typeof URI

export type Identity<A> = A

export interface Left<E> {
    readonly _tag: 'Left'
    readonly left: E
  }
  
  export interface Right<A> {
    readonly _tag: 'Right'
    readonly right: A
  }
  
  export type Either<E, A> = Left<E> | Right<A>

// 1. Replace the variable type F with a unique type identifier -> 替一個type constructor 做一個 unique type identifier
interface URItoKind<A> {
  readonly Array: Array<A>
  readonly Set: Set<A>
  readonly Identity: Identity<A>
} // a dictionary for 1-arity types: Array, Set, Tree, Promise, Maybe, Task...

// URI
interface URItoKind2<A, B> {
  readonly Map: Map<A, B>
  readonly Either: Either<A, B> // Either<E, A>
} // a dictionary for 2-arity types: Map, Either, Bifunctor...

// type URIS = "Array"
type URIS = keyof URItoKind<unknown> // sum type of names of all 1-arity types

// type URIS2 = "Map"
type URIS2 = keyof URItoKind2<unknown, unknown> // sum type of names of all 2-arity types
// and so on, as you desire

// 2. Create a utility type constructor Kind<IdF, A>
type Kind<F extends URIS, A> = URItoKind<A>[F]
type Kind2<F extends URIS2, A, B> = URItoKind2<A, B>[F]

// 3. Use Kind (Lightweight higher-kinded polymorphism)
type Test1 = Kind<'Set', string>
// type Test1 = Set<string>

// interface Mappable<F> {
//   // Type 'F' is not generic. ts(2315)
//   readonly map: <A, B>(f: (a: A) => B) => (as: F<A>) => F<B>
// }

interface Mappable<F extends URIS> {
  readonly map: <A, B>(f: (a: A) => B) => (as: Kind<F, A>) => Kind<F, B>
}

const mappableArray: Mappable<'Array'> = {
  map: (f) => (as) => as.map(f)
}

const mappableSet: Mappable<'Set'> = {
  map: (f) => (as) => new Set(Array.from(as).map(f))
}




