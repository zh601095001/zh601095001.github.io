const FULFILLED = "fulfilled"
const PENDING = "pending"
const REJECTED = "rejected"

class MyPromise {
    #state = PENDING
    #result = undefined
    #handlers = []

    constructor(executor) {
        const resolve = data => {
            this.#changeState(FULFILLED, data)
        }
        const reject = reason => {
            this.#changeState(REJECTED, reason)
        }
        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }

    #runMicroTask(func) {
        if (typeof process === "object" && typeof process.nextTick === "function") {
            process.nextTick(func)
        } else if (typeof queueMicrotask === "function") {
            queueMicrotask(func)
        } else if (typeof MutationObserver === "function") {
            // 没有queueMicrotask函数时执行这个方案
            const ob = new MutationObserver(func)
            const textNode = document.createTextNode("1")
            ob.observe(textNode, {
                characterData: true
            })
            textNode.data = "2"
        } else {
            setTimeout(func, 0)
        }
    }

    #runOne(callback, resolve, reject) {
        this.#runMicroTask(() => {
            if (typeof callback !== "function") {
                const settled = this.#state === FULFILLED ? resolve : reject
                settled(this.#result)
                return
            }
            try {
                const data = callback(this.#result)
                if (this.#isPromiseLike(data)) {
                    data.then(resolve, reject)
                } else {
                    resolve(data)
                }
            } catch (err) {
                reject(err)
            }
        })
    }

    #isPromiseLike(value) {
        if (value !== null && (typeof value === "object" || typeof value === "function")) {
            return typeof value.then === 'function'
        }
        return false
    }

    #run() {
        if (this.#state === PENDING) return
        while (this.#handlers.length) {
            const {onFulfilled, onRejected, resolve, reject} = this.#handlers.shift()
            if (this.#state === FULFILLED) {
                this.#runOne(onFulfilled, resolve, reject)
            } else {
                this.#runOne(onRejected, resolve, reject)
            }
        }
    }

    #changeState = (state, result) => {
        if (this.#state !== PENDING) return
        this.#state = state
        this.#result = result
        this.#run()
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            this.#handlers.push({
                onFulfilled,
                onRejected,
                resolve,
                reject
            })
            this.#run()
        })
    }

    catch(onRejected) {
        return this.then(undefined, onRejected)
    }

    finally(onFinally) {
        return this.then(data => {
            onFinally()
            return data
        }, err => {
            onFinally()
            throw err
        })
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value
        let _resolve, _reject
        const p = new MyPromise((resolve, reject) => {
            _resolve = resolve
            _reject = reject
        })
        if (p.#isPromiseLike(value)) {
            value.then(_resolve, _reject)
        } else {
            _resolve(value)
        }
        return p
    }

    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }

    static all(proms) {
        let _resolve, _reject;
        const p = new MyPromise((resolve, reject) => {
            _resolve = resolve
            _reject = reject
        })
        const result = []
        let count = 0
        let fulFilledCount = 0
        for (const prom of proms) {
            const i = count
            count++
            MyPromise.resolve(prom).then(data => {
                result[i] = data
                fulFilledCount++
                if (fulFilledCount === count) {
                    _resolve(result)
                }
            })
        }
        if (count === 0) {
            _resolve(result)
        }
        return p
    }
}
