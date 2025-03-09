var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { clearTokens } from '../../../utils/auth/auth.js';
export const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use the utility function to clear tokens
        yield clearTokens(req, res);
        // Also try clearing without options for older browsers
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        // Clear any potential additional cookies used for auth
        res.clearCookie('connect.sid'); // Express session cookie
        // Respond with 200 and a success message
        res.status(200).json({ message: 'Logged out successfully', success: true });
    }
    catch (error) {
        console.error('Logout error:', error);
        // Ensure we always send a successful response
        res.status(200).json({ message: 'Logged out on client', success: true });
    }
});
//# sourceMappingURL=logout.controller.js.map