
// reference videos : https://www.youtube.com/watch?v=6cpBP61PgEM&list=PLU-JpnaCc5-djVi1UvSqPgm_1pxqkOOJ1&index=8


type Prop<T> = {
    get: () => T
    set: (t: T) => void
}

function createProp<T>(val: T) : Prop<T> {
    return {
        get: () => val,
        set: (v: T) => {val = v}
    }
}

type PropMap = {
    name : string
    age: number
}

type Props = {
    [PropName in keyof PropMap] : Prop<PropMap[PropName]>
}

const props2 : Props = {
    name: createProp('tt'),
    age: createProp(41)
}

function xx<K extends keyof Props>(k: K) {
    const y = props2[k]
    const z = y.get()
    y.set(z)
}






