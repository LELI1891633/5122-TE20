import 'dotenv/config';
export const config = {
    port: Number(process.env.PORT ?? 3000),
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100),
};
//# sourceMappingURL=config.js.map