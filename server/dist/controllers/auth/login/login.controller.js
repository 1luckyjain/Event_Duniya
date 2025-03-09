var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import createError from 'http-errors';
import User from '../../../models/User.js';
import Artist from '../../../models/Artist.js';
export const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    try {
        if (!username || !password) {
            res.status(422).json({ error: 'Please fill all the required fields' });
            return;
        }
        let user;
        if (role === 'artist') {
            user = yield Artist.findOne({ $or: [{ username }, { email: username }] });
        }
        else {
            user = yield User.findOne({ $or: [{ username }, { email: username }] });
        }
        if (!user) {
            throw createError.Unauthorized('Invalid username or password');
        }
        if (user.password !== password) {
            throw createError.Unauthorized('Invalid username or password');
        }
        req.userId = user._id;
        return next();
    }
    catch (error) {
        return next(error);
    }
});
//# sourceMappingURL=login.controller.js.map