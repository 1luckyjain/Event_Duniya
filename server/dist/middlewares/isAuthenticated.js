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
import dotenv from 'dotenv';
import User from '../models/User.js';
import Artist from '../models/Artist.js';
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const isAuthenticated = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const authToken = req.get('Authorization');
            const accessToken = authToken === null || authToken === void 0 ? void 0 : authToken.split('Bearer ')[1];
            if (!accessToken) {
                next(createError.Unauthorized());
                return;
            }
            const cookies = (_a = req.headers.cookie) === null || _a === void 0 ? void 0 : _a.split('; ');
            if (!(cookies === null || cookies === void 0 ? void 0 : cookies.length)) {
                return;
            }
            const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith(`refreshToken=`));
            if (!refreshTokenCookie) {
                return;
            }
            const refreshToken = refreshTokenCookie.split('=')[1];
            if (!refreshToken) {
                res.sendStatus(204);
                return;
            }
            if (!refreshToken) {
                next(createError.Unauthorized());
                return;
            }
            let decodedToken;
            try {
                decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            }
            catch (err) {
                console.log("Token verification failed.");
                next(createError.Unauthorized());
                return;
            }
            const { userId } = decodedToken;
            // Log the userId from the token to help with debugging
            console.log(`Token contains userId: ${userId}`);
            let foundUser;
            if (roles === 'artist' || roles === 'user&artist') {
                foundUser = yield Artist.findById(userId);
            }
            if (!foundUser && (roles === 'user' || roles === 'user&artist')) {
                foundUser = yield User.findById(userId);
            }
            if (!foundUser) {
                next(createError.Unauthorized());
                return;
            }
            // Make sure userId is stored as a string to avoid comparison issues
            req.userId = foundUser._id.toString();
            console.log(`Setting req.userId to: ${req.userId}`);
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
        }
    });
};
//# sourceMappingURL=isAuthenticated.js.map