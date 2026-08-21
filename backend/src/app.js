const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const env = require('./config/env');
const setupSwagger = require('./config/swagger');
const { errorHandler } = require('./middleware/error');

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

app.use(helmet());
app.use(cors({
    origin: env.clientUrl,
    credentials: true
}));

app.use(morgan('combined'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.env === 'production' ? 100 : 100000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => env.env !== 'production',
    message: { error: "Too many requests, please try again later." }
});
app.use(`${env.api.prefix}/`, limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/mock-files', express.static(path.join(__dirname, '../mock-storage')));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

setupSwagger(app);

app.use(`${env.api.prefix}/auth`, authRoutes);
app.use(`${env.api.prefix}/startups`, startupRoutes);
app.use(`${env.api.prefix}/projects`, startupRoutes);
app.use(`${env.api.prefix}/upload`, uploadRoutes);
app.use(`${env.api.prefix}/messages`, messagesRoutes);
app.use(`${env.api.prefix}/requests`, requestsRoutes);
app.use(`${env.api.prefix}/follow`, followRoutes);
app.use(`${env.api.prefix}/notifications`, notificationsRoutes);
app.use(`${env.api.prefix}/ai`, aiRoutes);
app.use(`${env.api.prefix}/community`, communityRoutes);

app.use(errorHandler);

module.exports = app;
