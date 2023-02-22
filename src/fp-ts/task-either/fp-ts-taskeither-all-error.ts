import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as RA from 'fp-ts/ReadonlyArray'
import * as A from 'fp-ts/Apply'

interface AppConfig {
  readonly host: string // web-server host name
  readonly port: number // a port our webserver will be listening
  readonly connectionString: string // a DB connection parameters
}

const data: AppConfig = {
  host: 'http://123.tsmc.com',
  port: 5566,
  connectionString: 'http://abcd'
}

const validateHost = (host: string): TE.TaskEither<Error[], string> =>
  pipe(
    T.of(new Date().toISOString() + '-validateHost-'),
    T.delay(2000),
    TE.fromTask,
    TE.mapLeft(() => [new Error('host not valid !!')])
  )

const validatePort = (port: number): TE.TaskEither<Error[], number> =>
  pipe(
    T.of(new Date().toISOString() + '-validatePort-'),
    T.delay(3000),
    TE.fromTask,
    TE.mapLeft(() => [new Error('port not valid !!')]),
    // TE.map(_ => port)
    TE.chain((_) => TE.left([new Error('port not valid !!')]))
  )

const validateConnectionString = (
  connectionString: string
): TE.TaskEither<Error[], string> =>
  pipe(
    T.of(new Date().toISOString() + '-validateConnectionString-'),
    T.delay(1000),
    TE.fromTask,
    TE.mapLeft(() => [new Error('connection string not valid !!')]),
    TE.chain((_) => TE.left([new Error('connection string not valid !!')]))
  )

const Applicative = TE.getApplicativeTaskValidation(
  T.ApplyPar,
  RA.getSemigroup<Error>()
)
const apS = A.apS(Applicative)

// parallel task and get all errors
const validateAppConfig = (
  input: AppConfig
): TE.TaskEither<readonly Error[], AppConfig> =>
  pipe(
    TE.Do,
    apS('host', validateHost(input.host)),
    apS('port', validatePort(input.port)),
    apS('connectionString', validateConnectionString(input.connectionString))
  )

validateAppConfig(data)().then((x) =>
  console.log(new Date().toISOString(), '--validateAppConfig--', x)
)

// [1] 2023-02-22T14:47:40.233Z --validateAppConfig-- {
// [1]   _tag: 'Left',
// [1]   left: [
// [1]     Error: port not valid !!
// [1]         at /Users/welentsai/Workspace/fpTs/dist/fp-ts-taskeither-all-error.js:39:207
// [1]         at /Users/welentsai/Workspace/fpTs/node_modules/fp-ts/lib/EitherT.js:77:116
// [1]         at /Users/welentsai/Workspace/fpTs/node_modules/fp-ts/lib/Task.js:146:37
// [1]         at async Promise.all (index 1)
// [1]         at async Promise.all (index 0),
// [1]     Error: connection string not valid !!
// [1]         at /Users/welentsai/Workspace/fpTs/dist/fp-ts-taskeither-all-error.js:40:256
// [1]         at /Users/welentsai/Workspace/fpTs/node_modules/fp-ts/lib/EitherT.js:77:116
// [1]         at /Users/welentsai/Workspace/fpTs/node_modules/fp-ts/lib/Task.js:146:37
// [1]         at async Promise.all (index 1)
// [1]   ]
// [1] }
