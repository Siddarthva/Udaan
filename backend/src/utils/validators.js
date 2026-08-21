const ApiError = require('./ApiError');

const registerValidator = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }
    next();
};

const loginValidator = (req, res, next) => {
    const loginInput = req.body.loginInput || req.body.email;
    const { password } = req.body;
    if (!loginInput || !password) {
        throw new ApiError(400, 'Email/Username and password are required');
    }
    next();
};

const startupValidator = (req, res, next) => {
    const { title, domain } = req.body;
    if (req.method === 'POST' && (!title || !domain)) {
        throw new ApiError(400, 'Startup title and domain are required.');
    }
    next();
};

const memberValidator = (req, res, next) => {
    next();
};

const profileValidator = (req, res, next) => {
    next();
};

module.exports = {
    registerValidator,
    loginValidator,
    startupValidator,
    memberValidator,
    profileValidator
};
