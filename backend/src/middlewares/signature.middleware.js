import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../../");

export const verifySignature = async (req, res, next) => {
    try {
        const signature = req.headers["x-signature"];

        if (!signature) {
            return res.status(401).json({
                success: false,
                message: "Missing signature"
            });
        }

        const publicKeyPath = path.resolve(backendRoot, config.PUBLIC_KEY_PATH);
        const publicKey = fs.readFileSync(publicKeyPath, "utf8");
        const payload = JSON.stringify(req.body);

        const verify = crypto.createVerify("RSA-SHA256");
        verify.update(payload);
        verify.end();

        const isValid = verify.verify(publicKey, signature, "base64");

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid signature"
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Signature verification failed"
        });
    }
};
