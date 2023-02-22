import assert from 'assert'
import * as R from 'fp-ts/lib/Refinement'
import * as O from 'fp-ts/Option'
import { Predicate } from 'fp-ts/lib/Predicate'

// type alias
type Email = string

// Predicate
// type Predicate<A> = (a: A) => boolean;

// predicate 可以檢查 value (type 己知)
const f: Predicate<number> = (n) => n <= 2

assert.deepStrictEqual(f(2), true)
assert.deepStrictEqual(f(3), false)

// Refinement
// type Refinement<A, B> = (a: A) => a is B;

const isString = (x: unknown): x is string => typeof x === 'string'

const isStringRefinement: R.Refinement<unknown, string> = (x): x is string =>
  typeof x === 'string'

// refinement 可以檢查 type
assert.deepStrictEqual(isStringRefinement('abc'), true)
assert.deepStrictEqual(isStringRefinement(123), false)

// 利用 refinement + Option 來做資料檢查
declare function updateState(x: string): void
declare function showErrorMessage(x: string): void

type Payload = string
type SuccessResponse = { success: true; payload: Payload }
type FailureResponse = { success: false; error: Error }
type ApiResponse = SuccessResponse | FailureResponse
const parseSuccessResponse = (res: ApiResponse): O.Option<SuccessResponse> =>
  res.success === true ? O.some(res) : O.none

const isSuccessResponse = R.fromOptionK(parseSuccessResponse)

//
const handleApiResponse = (response: ApiResponse) => {
  if (isSuccessResponse(response)) {
    return updateState(response.payload) // 👈 The type of response is inferred to be SuccessResponse
  }
  // The type of response is inferred to be FailureResponse 👇  (typescript compiler 可以幫忙檢查出是 FailureResponse, 更安全)
  showErrorMessage(response.error.message || 'Something went wrong')
}
