const log = console.log
function* range(stop) {
    let i = -1;
    while (++i < stop) yield i
}
// TODO: need to figure out how currying works
const curry = f => (a, ...bs) => (bs.length) ? f(a, ...bs) : (...bs) => f(a, ...bs)
// NOTE: iterator function does lazy evaluation by default
const filter = curry(function* (f, iter) {
    for (const a of iter) {
        if (f(a)) yield a;
    }
})
const map = curry(function* (f, iter) {
    for (const a of iter) {
        if (a) yield f(a)
    }
})
const take = curry(function (length, iter) {
    let res = [];
    for (const a of iter) {
        res.push(a)
        if (res.length === length) return res
    }
    return res
})
const reduce = curry(function (f, acc, iter) {
    if (arguments.length == 2) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value;
    }
    for (const a of iter) {
        acc = f(acc, a)
    }
    return acc
})
const add = curry((a, b) => a + b)
const go = (...as) => reduce((a, f) => f(a), as)
const flat = curry(function* (iter) {
    for (const a of iter) {
        if (!!(a && a[Symbol.iterater]())) yield* a
        else yield a      
    }
})
const f = (list, length) =>
    reduce(add, 0,
        take(length,
            map(a => a * a,
                filter(a => a % 2, list))))
const f2 = (list, length) =>
    go(list, filter(a => a % 2), map(a => a * a), take(length), reduce(add))

function main() {
    log(f([1, 2, 3, 4, 5], 3));
    log(f2(range(Infinity), 200));
    log(go(10, a => a + 10, a => a + 1))
    log(add(10)(2))
}
main()