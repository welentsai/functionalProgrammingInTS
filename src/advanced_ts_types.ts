/**
 *  Conditional Types **************************
 */
type SomeType = number
type MyConditionalType = SomeType extends string ? string : null

function someFunction<T>(value: T) {
    type A = T extends boolean ? 'TYPE A' : 'TYPE B'
    const someOtherFunction = (
        someArg: T extends boolean ? 'TYPE A' : 'TYPE B'
    ) => {
        const a: 'TYPE A' | 'TYPE B' = someArg
    }
    return someOtherFunction
}

const result = someFunction(true)


/**
 *  Indexed Access Types **************************
 */

interface ColorVariants {
    primary: "blue"
    secondary: "red"
    tertiary: "green"
}

type PrimaryColor = ColorVariants["primary"]
type NonPrimaryColor = ColorVariants["secondary" | "tertiary"]
type EveryColor = ColorVariants[keyof ColorVariants]

type Letters = ["a", "b", "c"]
type AOrB = Letters[0 | 1]
type Letter = Letters[number]

interface UserRoleConfig {
    user: ["view", "update"];
    superAdmin: ["view", "create", "delete"];
}

type Role = UserRoleConfig[keyof UserRoleConfig][number]