Array.prototype.test = function () {
    return [...arguments, ...this]
}

arr = [1,2,3,4]

arr.test(4,5,6)

console.log(arr)