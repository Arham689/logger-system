class CustomError extends Error {
    readonly statusCode: number;
    readonly status: 'fail' | 'error';
    readonly isOperational: boolean;

    /**
     * Creates an instance of CustomError.
     * @param {string} message - The error message.
     * @param {number} statusCode - The HTTP status code for the error.
     */
    constructor(message: string, statusCode: number) {
        super(message);

        this.name = this.constructor.name;

        this.statusCode = statusCode;

        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;
