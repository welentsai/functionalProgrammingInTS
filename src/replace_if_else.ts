import { match, P } from 'ts-pattern'

interface WeatherConfig {
    sunny: "Sunny"
    rainy: "Rainy"
    snowy: "Snowy"
}

type Weather = WeatherConfig[keyof WeatherConfig]

let currentWeather = "Sunny"

const weatherToFeeling: string = (currentWeather === "Sunny") ? "happy" : (currentWeather === "Rainy") ? "sad" : "cold"

console.log(weatherToFeeling)


/**
 * Pattern Matching
 */

const weatherToFeeling2 = match(currentWeather)
    .with("Sunny", () => "happy")
    .with("Rainy", () => "sad")
    .with("Snowy", () => "cold")
    .otherwise(() => "Unknown!")

console.log("=== Pattern Matching ===")
console.log(weatherToFeeling2)

currentWeather = ""
const weatherToFeeling3 = match(currentWeather)
    .with("Sunny", () => "happy")
    .with("Rainy", () => "sad")
    .with("Snowy", () => "cold")
    .with(P.string, () => "unknown weather") // wildcard
    .with(P.nullish, () => "it is either null or undefined!") // wildcard
    .exhaustive()


console.log("=== Pattern Matching ===")
console.log(weatherToFeeling3)


type Weather2 =
    | { type: "Sunny" }
    | { type: "Rainy" }
    | { type: "Snowy" }

let input: Weather2 = { type: "Rainy" }

const output = match(input)
    .with({ type: "Sunny" }, () => "happy")
    .with({ type: "Rainy" }, () => "sad")
    .with({ type: "Snowy" }, () => "cold")
    .exhaustive()

console.log("=== Pattern Matching ===")
console.log(output)