import { Request, Response, NextFunction } from 'express'

import { RequestValidationError } from '../errors/request-validation-error'
import { DatabaseConnectionError } from '../errors/database-connection-error'

//follow same structure when throwing any error. { errors: [{ message: ... }] }

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof RequestValidationError) {
        // send a formatted error message and not entire validation array
        const formattedErrors = err.errors.map(error => ({ message: error.msg, field: error.param }))
        
        return res.status(422).send({ errors: formattedErrors })
    }
    
    if(err instanceof DatabaseConnectionError) {
        const formattedError = [{ message: err.reason }]
        return res.status(500).send({ errors: formattedError })
    }

    return res.status(500).send({errors: [{ message: 'Something went wrong !' }]})
}