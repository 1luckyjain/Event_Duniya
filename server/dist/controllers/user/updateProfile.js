var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../../models/User.js';
export const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        // Log IDs to help with debugging
        console.log(`Request userId: ${req.userId}`);
        console.log(`Parameter id: ${id}`);
        // Convert both IDs to strings for reliable comparison
        const requestUserId = (_a = req.userId) === null || _a === void 0 ? void 0 : _a.toString();
        const paramId = id.toString();
        // Only allow users to update their own profile
        // or bypass check if it's a development environment
        if (process.env.NODE_ENV !== 'development' && requestUserId !== paramId) {
            console.log(`Permission denied: ${requestUserId} trying to update ${paramId}`);
            res.status(403).json({ error: 'You can only update your own profile' });
            return;
        }
        // Fields that are allowed to be updated
        const allowedUpdates = ['username', 'email', 'avatar', 'phone', 'bio', 'location'];
        const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));
        // Create an object with only the allowed fields
        const updateData = {};
        updates.forEach(key => {
            updateData[key] = req.body[key];
        });
        // Find and update the user
        const updatedUser = yield User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Remove sensitive data
        const userToReturn = updatedUser.toObject();
        delete userToReturn.password;
        res.status(200).json(userToReturn);
    }
    catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (likely email)
            res.status(409).json({ error: 'Email already in use' });
            return;
        }
        console.error('Error updating user profile:', error);
        res.status(500).json({
            error: 'Failed to update profile',
            message: error.message
        });
    }
});
//# sourceMappingURL=updateProfile.js.map