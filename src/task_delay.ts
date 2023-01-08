import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'
import { sequenceT } from 'fp-ts/Apply'

const myDelay = (ms: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const completeAfter1s = T.delay(1000)(T.of('result1'))
const completeAfter2s = T.delay(2000)(T.of('result2'))

const myAnswer: T.Task<string> = async () => {
  console.log(Date.now(), 'myTask! -- Start --')
  await completeAfter2s()
  return '23!'
}

const getName: T.Task<string> = async () => {
  console.log(Date.now(), 'getHello! -- Start--')
  await completeAfter1s()
  return 'My dear '
}

pipe(
  sequenceT(T.MonadTask)(myAnswer, getName), //[F[A], F[B]] => F[A, B]
  T.map(([answer, name]) =>
    console.log(`Hello ${name}! The answer you're looking for is ${answer}`)
  )
)()

// example 2
const log: Array<string> = []

const append = (message: string): T.Task<void> =>
  T.fromIO(() => {
    log.push(message)
  })

const test = async () => {
  const fa = append(`${Date.now()} a`)
  const fb = T.delay(20)(append('b'))
  const fc = T.delay(10)(append('c'))
  const fd = append(`${Date.now()} d`)
  //await sequenceT(T.ApplyPar)(fa, fb, fc, fd)()  // T.ApplyPar -> Runs computations in parallel.
  //console.log("logs->", log)
  await sequenceT(T.ApplySeq)(fa, fb, fc, fd)() // T.ApplySeq -> Runs computations sequentially.
  console.log('logs->', log)
}

test()
