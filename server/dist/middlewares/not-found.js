export function notFound(_req, res, _next) {
    res.status(404).json({ error: { code: 'NotFound', message: 'Route not found' } });
}
//# sourceMappingURL=not-found.js.map