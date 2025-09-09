 export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            next(new Error(err.message, { cause: err.cause || 500 }))
        })
    }
}

export const globalErrorHandling = (err, req, res, next) => {
    if (err) {
        const statusCode = err.cause || 500
        const message = err.message || 'Internal Server Error'
        
        if (process.env.MOOD === "DEV") {
            res.status(statusCode).json({
                success: false,
                message: message,
                error: err.message,
                stack: err.stack
            })
        } else {
            res.status(statusCode).json({
                success: false,
                message: message,
                error: err.message
            })
        }
    }
}