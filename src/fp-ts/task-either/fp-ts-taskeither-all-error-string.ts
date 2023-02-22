import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as string from 'fp-ts/string'
import * as S from 'fp-ts/Semigroup'
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

const validateHost = (host: string): TE.TaskEither<string, string> =>
  pipe(
    T.of(new Date().toISOString() + '-validateHost-'),
    T.delay(2000),
    TE.fromTask,
    TE.mapLeft(() => 'host not valid !!')
  )

const validatePort = (port: number): TE.TaskEither<string, number> =>
  pipe(
    T.of(new Date().toISOString() + '-validatePort-'),
    T.delay(3000),
    TE.fromTask,
    TE.mapLeft(() => 'port not valid !!'),
    TE.chain((_) => TE.left('port not valid !!'))
  )

const validateConnectionString = (
  connectionString: string
): TE.TaskEither<string, string> =>
  pipe(
    T.of(new Date().toISOString() + '-validateConnectionString-'),
    T.delay(1000),
    TE.fromTask,
    TE.mapLeft(() => 'connection string not valid !!'),
    TE.chain((_) => TE.left('connection string not valid !!'))
  )

const Applicative_2 = TE.getApplicativeTaskValidation(
  T.ApplyPar,
  pipe(string.Semigroup, S.intercalate(', '))
)
const apS_2 = A.apS(Applicative_2)
// get all errors
const validateAppConfig_2 = (
  input: AppConfig
): TE.TaskEither<string, AppConfig> =>
  pipe(
    TE.Do,
    apS_2('host', validateHost(input.host)),
    apS_2('port', validatePort(input.port)),
    apS_2('connectionString', validateConnectionString(input.connectionString))
  )

validateAppConfig_2(data)().then((x) =>
  console.log(new Date().toISOString(), '---validateAppConfig_2---', x)
)

// [1] 2023-02-22T15:07:20.916Z ---validateAppConfig_2--- {
// [1]   _tag: 'Left',
// [1]   left: 'port not valid !!, connection string not valid !!'
// [1] }
