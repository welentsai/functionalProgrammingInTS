import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'

// sequencial tasks
pipe(
  T.Do,
  T.apS('foo', pipe(T.of('a'), T.delay(1000))),
  T.apS('bar', pipe(T.of('b'), T.delay(2000))),
  T.apS('buzz', pipe(T.of('c'), T.delay(2000)))
)().then(console.log) // => { foo: 'a', bar: 'b' }
