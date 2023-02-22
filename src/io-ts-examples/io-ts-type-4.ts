import * as t from 'io-ts'
import { PathReporter } from 'io-ts/PathReporter'
import { withMessage } from 'io-ts-types'

interface NonEmptyString50Brand {
  readonly NonEmptyString50: unique symbol
}

const NonEmptyString50 = t.brand(
  t.string,
  (s: string): s is t.Branded<string, NonEmptyString50Brand> =>
    s.length > 0 && s.length <= 50,
  'NonEmptyString50'
)

type NonEmptyString50T = t.TypeOf<typeof NonEmptyString50>

console.log(PathReporter.report(NonEmptyString50.decode(42)))
console.log(PathReporter.report(NonEmptyString50.decode('abc')))
console.log(NonEmptyString50.decode('abc'))

const FirstName = withMessage(
  NonEmptyString50,
  (input) =>
    `First name value must be a string (size between 1 and 50 chars), got: ${input}`
)

const LastName = withMessage(
  NonEmptyString50,
  (input) =>
    `Last name value must be a string (size between 1 and 50 chars), got: ${input}`
)

console.log(FirstName.decode(42))
console.log(FirstName.decode('abc'))

/**
 * Email Address
 */

interface EmailAddressBrand {
  readonly EmailAddress: unique symbol
}

const emailPattern =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
const EmailAddress = withMessage(
  t.brand(
    t.string,
    (s: string): s is t.Branded<string, EmailAddressBrand> =>
      emailPattern.test(s),
    'EmailAddress'
  ),
  (input) => `Email address value must be a valid email address, got: ${input}`
)

type EmailAddressT = t.TypeOf<typeof EmailAddress>

/**
 * Date
 */
interface TimestampBrand {
  readonly Timestamp: unique symbol
}

const Timestamp = t.brand(
  t.Int,
  (t: t.Int): t is t.Branded<t.Int, TimestampBrand> =>
    t >= -8640000000000000 && t <= 8640000000000000,
  'Timestamp'
)

type TimestampT = t.TypeOf<typeof Timestamp>

const UserLikePartiallyValid = t.strict({
  firstName: FirstName,
  lastName: LastName,
  emailAddress: EmailAddress
})
