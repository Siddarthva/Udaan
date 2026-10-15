const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const setupSwagger = require('./config/swagger');
const { errorHandler } = require('./middleware/error');
const ApiError = require('./utils/ApiError');

const authRoutes = require('./modules/auth/routes');
const startupRoutes = require('./modules/startup/routes');
const uploadRoutes = require('./modules/upload/routes');
const messagesRoutes = require('./modules/messages/routes');
const followRoutes = require('./modules/follow/routes');
const notificationsRoutes = require('./modules/notifications/routes');
const requestsRoutes = require('./modules/requests/routes');
const aiRoutes = require('./modules/ai/routes');
const communityRoutes = require('./modules/community/routes');

const app = express();

// Behind a reverse proxy (nginx / hosting platform) so rate limiting and secure cookies see the real client.
if (env.isProduction) app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
    origin: env.clientUrl.split(',').map((o) => o.trim()),
    credentials: true
}));

app.use(morgan(env.isProduction ? 'combined' : 'dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => !env.isProduction,
    message: { error: 'Too many requests, please try again later.' }
});
app.use(`${env.api.prefix}/`, limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/** Liveness plus a real dependency check against Supabase (503 when the database is unreachable). */
app.get('/health', async (req, res) => {
    const body = { status: 'healthy', timestamp: new Date().toISOString() };
    if (req.query.deep === 'false') return res.status(200).json(body);
    try {
        const { getAdminClient } = require('./config/supabase');
        const { error } = await getAdminClient().from('profiles').select('id').limit(1);
        if (error) throw new Error(error.message);
        res.status(200).json({ ...body, database: 'ok' });
    } catch (err) {
        console.error(`[HEALTH] database check failed: ${err.message}`);
        res.status(503).json({ ...body, status: 'degraded', database: 'unreachable' });
    }
});

setupSwagger(app);

app.use(`${env.api.prefix}/auth`, authRoutes);
app.use(`${env.api.prefix}/startups`, startupRoutes);
app.use(`${env.api.prefix}/upload`, uploadRoutes);
app.use(`${env.api.prefix}/messages`, messagesRoutes);
app.use(`${env.api.prefix}/requests`, requestsRoutes);
app.use(`${env.api.prefix}/follow`, followRoutes);
app.use(`${env.api.prefix}/notifications`, notificationsRoutes);
app.use(`${env.api.prefix}/ai`, aiRoutes);
app.use(`${env.api.prefix}/community`, communityRoutes);

app.use((req, res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`)));
app.use(errorHandler);

module.exports = app;
