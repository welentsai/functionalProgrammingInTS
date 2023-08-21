import * as S from "@effect/schema/Schema";


const schema = S.union(S.literal("a"), S.literal("b"), S.literal("c"));

const of = S.parseEither(schema)

type ABC = S.To<typeof schema>
const ABC = { schema, of }