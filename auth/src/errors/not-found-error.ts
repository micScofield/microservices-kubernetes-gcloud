import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
    statusCode = 404
    reason = 'Route not found'

    constructor() {
        super('Route not found - 404')

        //only because of typescript, we need to specify that we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype) 
    }

    serializeErrors = () => ([{ message: this.reason }])
}

