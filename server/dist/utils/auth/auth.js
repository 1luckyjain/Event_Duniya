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
const dev = process.env.NODE_ENV === 'development';
export const generateJWT = (userId, secret, expirationTime) => {
    return jwt.sign({ userId }, secret, { expiresIn: expirationTime });
};
export const clearTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        signed: true,
    });
    // Clear any other cookies if they exist
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    // Clear the session if it exists
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
        });
    }
});
//# sourceMappingURL=auth.js.map