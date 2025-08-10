export function errorHandler(err, _req, res, _next) {
    const status = err.status ?? 500;
    const code = err.code ?? 'InternalError';
    const message = err.message ?? 'Unexpected error';
    if (process.env.NODE_ENV !== 'test')
        console.error(err);
    res.status(status).json({ error: { code, message } });
}
//# sourceMappingURL=error-handler.js.map