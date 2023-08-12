import { getApplicativeMonoid } from 'fp-ts/lib/Applicative'
import * as M from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/Semigroup'

// Signature

// interface Monoid<A> extends Semigroup<A> {
//     readonly empty: A
// }

const monoidSum: M.Monoid<number> = {
  concat: (x, y) => x + y,
  empty: 0
}

const monoidProduct: M.Monoid<number> = {
  concat: (x, y) => x * y,
  empty: 1
}

const monoidString: M.Monoid<string> = {
  concat: (x, y) => x + y,
  empty: ''
}

/** boolean monoid under conjunction */
const monoidAll: M.Monoid<boolean> = {
  concat: (x, y) => x && y,
  empty: true
}

/** boolean monoid under disjunction */
const monoidAny: M.Monoid<boolean> = {
  concat: (x, y) => x || y,
  empty: false
}

type Point = {
  x: number
  y: number
}

const monoidPoint: M.Monoid<Point> = M.struct({
  x: monoidSum,
  y: monoidSum
})

type Vector = {
  from: Point
  to: Point
}

const monoidVector: M.Monoid<Vector> = M.struct({
  from: monoidPoint,
  to: monoidPoint
})

console.log(M.concatAll(monoidSum)([1, 2, 3, 4, 5]))
console.log(M.concatAll(monoidProduct)([1, 2, 3, 4]))
console.log(M.concatAll(monoidString)(['1', '2', '3', '4']))
console.log(M.concatAll(monoidAll)([true, false, true]))
console.log(M.concatAll(monoidAny)([true, false, false]))

const mm = O.getApplyMonoid(monoidSum)
console.log(mm.concat(O.some(1), O.none))
console.log(mm.concat(O.some(1), O.some(2)))
console.log(mm.concat(O.some(1), mm.empty))

// getLastMonoid can be useful for managing optional values

interface Settings {
  /** Controls the font family */
  fontFamily: O.Option<string>
  /** Controls the font size in pixels */
  fontSize: O.Option<number>
  /** Limit the width of the minimap to render at most a certain number of columns. */
  maxColumn: O.Option<number>
}

const monoidSettings: M.Monoid<Settings> = M.struct({
  fontFamily: O.getMonoid<string>(S.last()),
  fontSize: O.getMonoid<number>(S.last()),
  maxColumn: O.getMonoid<number>(S.last())
})

const workspaceSettings: Settings = {
  fontFamily: O.some('Courier'),
  fontSize: O.none,
  maxColumn: O.some(80)
}

const userSettings: Settings = {
  fontFamily: O.some('Fira Code'),
  fontSize: O.some(12),
  maxColumn: O.none
}

/** userSettings overrides workspaceSettings */
const result = monoidSettings.concat(workspaceSettings, userSettings)

console.log(result)
