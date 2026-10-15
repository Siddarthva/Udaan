const env = require('../config/env');

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    // express.json() reports malformed bodies as errors carrying status 400.
    const statusCode = err.name === 'MulterError' ? 400 : (err.statusCode || err.status || 500);

    console.error(`[API ERROR] ${new Date().toISOString()} ${req.method} ${req.originalUrl} -> ${statusCode}${req.user ? ` user=${req.user.id}` : ''}`);
    console.error(`[API ERROR] ${err.message}`);
    if (statusCode >= 500 && err.stack) console.error(err.stack);

    const message = env.isProduction && statusCode >= 500 ? 'Internal Server Error' : err.message;
    const body = { error: message };
    if (Array.isArray(err.errors) && err.errors.length > 0) body.errors = err.errors;
    if (!env.isProduction && statusCode >= 500 && err.stack) body.stack = err.stack;

    res.status(statusCode).json(body);
}

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
