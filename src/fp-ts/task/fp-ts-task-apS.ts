import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'

// parallel tasks
pipe(
  T.Do,
  T.apS('foo', pipe(T.of('a -' + new Date().toISOString()), T.delay(2000))),
  T.apS('bar', pipe(T.of('b -' + new Date().toISOString()), T.delay(2000))),
  T.apS('buzz', pipe(T.of('c -' + new Date().toISOString()), T.delay(2000)))
)().then(console.log) // => { foo: 'a', bar: 'b' }

/** 
{ 
  foo: 'a -2023-02-20T13:52:44.344Z',
  bar: 'b -2023-02-20T13:52:44.344Z',
  buzz: 'c -2023-02-20T13:52:44.344Z' 
} 
*/
