const swaggerUi = require('swagger-ui-express');

const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'UDAAN Platform API 3.0',
        version: '3.0.0',
        description: 'Modular REST API for UDAAN platform with Community Directory, Groq AI Assistant, follow systems, message requests, startup updates, and notifications.'
    },
    servers: [
        { url: 'http://localhost:8000/api', description: 'Development Server' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    paths: {
        '/auth/register': {
            post: {
                summary: 'Register new user',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                    name: { type: 'string' },
                                    role: { type: 'string', example: 'Innovator' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Registered successfully' } }
            }
        },
        '/auth/login': {
            post: {
                summary: 'Login user',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Login successful' } }
            }
        },
        '/community': {
            get: {
                summary: 'List community members',
                tags: ['Community'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'role', in: 'query', schema: { type: 'string' } },
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                    { name: 'sort', in: 'query', schema: { type: 'string' } }
                ],
                responses: { 200: { description: 'List of ecosystem members' } }
            }
        },
        '/ai/bio': {
            post: {
                summary: 'Generate bio with AI',
                tags: ['AI Assistant'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Generated bio' } }
            }
        },
        '/startups/trending': {
            get: {
                summary: 'List trending startups',
                tags: ['Startups'],
                responses: { 200: { description: 'List of trending startups' } }
            }
        },
        '/requests': {
            get: {
                summary: 'Get unified message requests',
                tags: ['Requests'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Requests list' } }
            }
        },
        '/notifications': {
            get: {
                summary: 'Get user notifications',
                tags: ['Notifications'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'User notifications' } }
            }
        }
    }
};

function setupSwagger(app) {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
