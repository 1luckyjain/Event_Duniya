// src/services/tokenService.ts
import jwt from 'jsonwebtoken';
/**
 * Generate a short‑lived access token.
 */
export const generateAccessToken = (user) => {
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};
/**
 * Generate a long‑lived refresh token.
 */
export const generateRefreshToken = (user) => {
    return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
/**
 * Verify the access token.
 */
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
/**
 * Verify the refresh token.
 */
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
