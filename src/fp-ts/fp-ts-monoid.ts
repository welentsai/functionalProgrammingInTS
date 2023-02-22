import { flow, pipe } from 'fp-ts/lib/function'
import * as M from 'fp-ts/Monoid'

const monoidString: M.Monoid<string> = {
  concat: (x, y) => x + y,
  empty: ''
}

//注意: pipe 跟 flow 使用不同的 function signature

// solution5 is a anomymous function with type
const solution5 = (input: ReadonlyArray<string>): string =>
  pipe(input, M.concatAll(monoidString))

const solution6: (input: ReadonlyArray<string>) => string = flow(
  M.concatAll(monoidString)
)

console.log('solution5', solution5(['->1', '2', '3<-'])) //solution5 ->123<-
console.log('solution5', solution5([])) //solution5

console.log('solution6', solution6(['->1', '2', '3<-'])) //solution6 ->123<-
console.log('solution6', solution6([])) //solution6
