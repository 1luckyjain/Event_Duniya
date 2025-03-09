var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { clearTokens, generateJWT } from '../../../utils/auth/auth.js';
import User from '../../../models/User.js';
import Artist from '../../../models/Artist.js';
import dotenv from 'dotenv';
dotenv.config();
// Ensure environment variables are properly loaded
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('Missing required environment variables');
}
const ACCESS_TOKEN_LIFE_SECONDS = Number(process.env.ACCESS_TOKEN_LIFE_SECOND);
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken; // Use cookie-parser middleware
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const { userId } = decoded;
        let user = yield User.findById(userId);
        if (!user) {
            user = yield Artist.findById(userId);
        }
        // If user does not exist, clear tokens and return error
        if (!user) {
            yield clearTokens(req, res);
            return next(createError.Unauthorized('User not found'));
        }
        // Generate a new access token
        const accessToken = generateJWT(user._id.toString(), ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE_SECONDS);
        // Send new access token
        res.status(200).json({
            user,
            accessToken,
            expiresAt: new Date(Date.now() + ACCESS_TOKEN_LIFE_SECONDS * 1000),
        });
    }
    catch (error) {
        // Clear tokens in case of invalid refresh token
        yield clearTokens(req, res);
        return next(createError.Unauthorized('Invalid refresh token'));
    }
});
//# sourceMappingURL=refresh.controller.js.map