const requests = new Map();

export function rateLimiter(req, res, next) {
    const key = req.ip;
    const now = Date.now();

    if (!requests.has(key)) {
        requests.set(key, []);
    }

    const timestamps = requests.get(key).filter(t => now - t < 60000);

    if (timestamps.length >= 10) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later."
        });
    }

    timestamps.push(now);
    requests.set(key, timestamps);

    next();
}

setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requests) {
        const valid = timestamps.filter(t => now - t < 60000);
        if (valid.length === 0) {
            requests.delete(key);
        } else {
            requests.set(key, valid);
        }
    }
}, 60000);
