import * as t from 'io-ts'
import assert from 'assert'

// ##### example 1 #####
type FinalInvoice = {
  __typename: 'FinalInvoice'
}

type DraftInvoice = {
  __typename: 'DraftInvoice'
}

type Invoice = FinalInvoice | DraftInvoice

const isFinalInvoice = (invoice: Invoice): invoice is FinalInvoice => {
  return invoice.__typename === 'FinalInvoice'
}

const isDraftInvoice = (invoice: Invoice): invoice is DraftInvoice => {
  return invoice.__typename === 'DraftInvoice'
}

const selectedInvoice: Invoice = { __typename: 'FinalInvoice' }

if (isFinalInvoice(selectedInvoice)) {
  console.log(`Final Invoice !`)
} else {
  console.log(`Draft Invoice`)
}

// ##### example 2 #####
function isString(test: any): test is string {
  return typeof test === 'string'
}

const input: unknown = `123`
if (isString(input)) {
  console.log(input.length)
}

// ##### example 3 - io-ts #####

interface NonEmptyString50Brand {
  readonly NonEmptyString50: unique symbol
}

const NonEmptyString50Codec = t.brand(
  t.string,
  (s: string): s is t.Branded<string, NonEmptyString50Brand> =>
    s.length > 0 && s.length <= 50,
  'NonEmptyString50'
)

type NonEmptyString50 = t.TypeOf<typeof NonEmptyString50Codec>

console.log(NonEmptyString50Codec.decode('abc'))

const result = NonEmptyString50Codec.decode(123)

console.log(result)
