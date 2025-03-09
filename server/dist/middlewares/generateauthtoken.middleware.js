var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateJWT } from '../utils/auth/auth.js';
import User from '../models/User.js';
import Artist from '../models/Artist.js';
import dotenv from 'dotenv';
dotenv.config();
const ACCESS_TOKEN_LIFE_SECOND = Number(process.env.ACCESS_TOKEN_LIFE_SECOND) || 15 * 60;
const REFRESH_TOKEN_LIFE_SECOND = Number(process.env.REFRESH_TOKEN_LIFE_SECOND) || 7 * 24 * 60 * 60;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const NODE_ENV = process.env.NODE_ENV;
const dev = NODE_ENV === 'development';
export const generateAuthTokens = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let foundUser = yield User.findById(req.userId);
        if (!foundUser) {
            foundUser = yield Artist.findById(req.userId);
        }
        if (!foundUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const refreshToken = generateJWT(req.userId, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE_SECOND);
        const accessToken = generateJWT(req.userId, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE_SECOND);
        const refreshDuration = REFRESH_TOKEN_LIFE_SECOND * 1000; // in ms
        const accessDuration = ACCESS_TOKEN_LIFE_SECOND * 1000; // in ms
        res.cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + refreshDuration),
            secure: true,
            sameSite: "none",
        });
        const expiresAt = new Date(Date.now() + accessDuration);
        res.status(200).json({
            user: foundUser,
            token: accessToken,
            expiresAt
        });
        return;
    }
    catch (error) {
        return next(error);
    }
});
//# sourceMappingURL=generateauthtoken.middleware.js.map