import redis from "../config/redis.js";

export async function distributedLock(req, res, next) {
    try {
        const key = req.headers["idempotency-key"];

        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Idempotency-Key is required"
            });
        }

        const lockKey = `lock:${key}`;

        // SET lockKey locked NX EX 30
        const lock = await redis.set(
            lockKey,
            "locked",
            "NX",
            "EX",
            30
        );

        if (!lock) {
            return res.status(409).json({
                success: false,
                message: "Another request is already being processed."
            });
        }

        req.lockKey = lockKey;

        next();

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}