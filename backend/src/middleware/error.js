const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || (err.status ? err.status : 500);
    const timestamp = new Date().toISOString();

    console.error(`\n=================== [API ERROR LOG] ===================`);
    console.error(`[${timestamp}] ${req.method} ${req.originalUrl} -> Status: ${statusCode}`);
    if (req.user) {
        console.error(`[USER]: ${req.user.id} (${req.user.email || req.user.username || 'authenticated'})`);
    }
    if (req.body && Object.keys(req.body).length > 0) {
        const safeBody = { ...req.body };
        if (safeBody.password) safeBody.password = '***REDACTED***';
        console.error(`[BODY]:`, JSON.stringify(safeBody));
    }
    console.error(`[MESSAGE]: ${err.message}`);
    if (err.stack) {
        console.error(`[STACK TRACE]:\n${err.stack}`);
    }
    console.error(`========================================================\n`);

    const message = env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal Server Error'
        : err.message;

    res.status(statusCode).json({
        error: message,
        ...(env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : {})
    });
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
