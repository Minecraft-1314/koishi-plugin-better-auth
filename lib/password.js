"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomId = randomId;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.checkPasswordPolicy = checkPasswordPolicy;
exports.fingerprint = fingerprint;
const crypto_1 = require("crypto");
const SPECIAL_CHAR = /[!-/:-@[-`{-~]/;
const DEFAULT_MIN_LENGTH = 6;
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
function checkPasswordPolicy(password, config = {}) {
    const minLength = config.passwordMinLength ?? DEFAULT_MIN_LENGTH;
    if (password.length < minLength)
        return `密码长度不能少于 ${minLength} 位`;
    if (config.passwordRequireSpecialChar && !SPECIAL_CHAR.test(password))
        return '密码必须包含特殊字符';
    return null;
}
function fingerprint(value) {
    return (0, crypto_1.createHash)('sha256').update(`better-auth:${value}`).digest('hex');
}
