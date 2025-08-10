export const validate = (schema) => (req, _res, next) => {
    try {
        const parsed = schema.parse({ query: req.query, body: req.body });
        req.query = parsed.query ?? req.query;
        req.body = parsed.body ?? req.body;
        next();
    }
    catch (e) {
        e.status = 400;
        e.code = 'BadRequest';
        next(e);
    }
};
//# sourceMappingURL=validate.js.map