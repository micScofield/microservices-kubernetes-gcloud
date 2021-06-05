import { ValidationError } from 'express-validator'

export class RequestValidationError extends Error {
    /*
    errors: ValidationError[]
    constructor(errors: ValidationError[]) {
        super()
        this.errors = errors
    } 
    is equivalent of below:
    constructor(public errors: ValidationError[]) {
        super()
    }
    */

    constructor(public errors: ValidationError[]) {
        super()
        
        //only because of typescript, we need to specify that we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype) 
    }
}

