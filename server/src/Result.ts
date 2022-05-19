import {UniversalError} from "./sockets/UniversalError";

export class Result<T> {

    static ok<T>(value: T): Result<T> {
        return new Result<T>(value)
    }

    static fail<T>(error: UniversalError): Result<T> {
        return new Result<T>(error)
    }

    constructor(private readonly it: T | UniversalError) {
    }

    get isError() {
        return typeof this.it === "number"
    }

    map<U>(f: (value: T) => U): Result<U> {
        if (typeof this.it === "number")
            return new Result<U>(this.it)
        return new Result(f(this.it))
    }

    bind<U>(f: (value: T) => Result<U>): Result<U> {
        if (typeof this.it === "number")
            return new Result<U>(this.it)
        return f(this.it)
    }

    handleError(f: (error: UniversalError) => void, replacement: T): T {
        if (typeof this.it === "number") {
            f(this.it)
            return replacement
        }
        return this.it
    }

}
