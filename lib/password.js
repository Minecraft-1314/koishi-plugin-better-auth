"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomId = randomId;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = require("crypto");
function randomId(length = 40) {
    const bytes = Math.ceil(length * 3 / 4);
    return (0, crypto_1.randomBytes)(bytes).toString('base64url').slice(0, length);
}
function safeEqual(a, b) {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    return left.length === right.length && (0, crypto_1.timingSafeEqual)(left, right);
}
function hashPassword(password) {
    const salt = randomId(16);
    const digest = (0, crypto_1.createHash)('sha256').update(salt + password).digest('hex');
    return `${salt}:${digest}`;
}
function verifyPassword(plain, hashed) {
    if (!hashed)
        return false;
    const index = hashed.indexOf(':');
    const digest = index >= 0
        ? (0, crypto_1.createHash)('sha256').update(hashed.slice(0, index) + plain).digest('hex')
        : (0, crypto_1.createHash)('sha256').update(plain).digest('hex');
    return safeEqual(digest, index >= 0 ? hashed.slice(index + 1) : hashed);
}
