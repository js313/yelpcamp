function one(pfunc) {
    console.log("lolo")
    return function two(arg) {
        console.log(arg)
    }
}

function afunc() {return "Ret"}

console.log(one(afunc))