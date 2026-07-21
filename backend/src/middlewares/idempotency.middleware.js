import redis from "../config/redis.js";

export async function idempotencyMiddleware(req, res, next) {
    try {
        const idempotencyKey = req.headers["idempotency-key"];

        if (!idempotencyKey) {
            return res.status(400).json({
                success: false,
                message: "Idempotency-Key header is required"
            });
        }

        const existingKey = await redis.get(`idempotency:${idempotencyKey}`);

        if (existingKey) {
            return res.status(409).json({
                success: false,
                message: "Duplicate request detected"
            });
        }

        req.idempotencyKey = idempotencyKey;

        next();

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}