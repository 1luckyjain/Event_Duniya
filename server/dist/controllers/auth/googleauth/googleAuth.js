var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OAuth2Client } from 'google-auth-library';
import createError from 'http-errors';
import User from '../../../models/User.js';
const client = new OAuth2Client(process.env.GOOGLE_AUTH);
export const googleAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credential } = req.body;
        if (!credential) {
            return next(createError(400, "Missing Google credential"));
        }
        const ticket = yield client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
        let user = yield User.findOne({ email });
        if (!user) {
            user = yield User.create({
                username: name,
                email,
                password: "nopassword",
                role: "User",
                avatar: picture,
            });
        }
        req.userId = user._id;
        next();
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=googleAuth.js.map