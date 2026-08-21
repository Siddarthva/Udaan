class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.message = message;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            Object.assign(this, data);
        } else {
            this.data = data;
        }
    }
}

module.exports = ApiResponse;
