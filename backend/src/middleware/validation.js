const { schemas, validateBody } = require('../utils/validators');

module.exports = {
    registerValidator: validateBody(schemas.register),
    loginValidator: (req, res, next) => {
        // Accept the legacy `email` field as the login identifier.
        if (req.body && !req.body.loginInput && req.body.email) req.body.loginInput = req.body.email;
        return validateBody(schemas.login)(req, res, next);
    },
    profileValidator: validateBody(schemas.profileUpdate),
    startupCreateValidator: validateBody(schemas.startupCreate),
    startupUpdateValidator: validateBody(schemas.startupUpdate),
    messageValidator: validateBody(schemas.message),
    messageRequestValidator: validateBody(schemas.messageRequest)
};
