import { type Context, type Next } from 'hono';

type AsyncHonoHandler = (c: Context, next: Next) => Promise<any>;
type WrappedHonoHandler = (c: Context, next: Next) => Promise<void>;

/**
 * Wraps an asynchronous Hono handler function to automatically catch
 * any errors that occur during its execution and pass them to the
 * next error handling middleware in the Hono application.
 *
 * This prevents unhandled promise rejections from crashing the application
 * and centralizes error handling for asynchronous operations.
 *
 * @param {AsyncHonoHandler} func - The asynchronous Hono handler function to wrap.
 * This function should take `Context` and `Next` as arguments
 * and return a Promise.
 * @returns {WrappedHonoHandler} A new Hono handler function that executes the
 * original function and catches any errors,
 * passing them to `next(err)`.
 */
export const asyncErrorHandler = (func: AsyncHonoHandler): WrappedHonoHandler => {
    return async (c: Context, next: Next) => {
        try {
            return await func(c, next);
        } catch (err: any) {
            console.error('Caught error in asyncErrorHandler:', err);

            if (err?.code === '23505') {
                return c.json(
                    {
                        status: 'error',
                        message: 'Email already exists',
                    },
                    409
                );
            }

            return c.json(
                {
                    status: 'error',
                    message: err?.message || 'Internal Server Error',
                },
                500
            );
        }
    };
};
