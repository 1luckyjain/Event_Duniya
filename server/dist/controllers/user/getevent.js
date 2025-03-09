var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import EventRegistrations from '../../models/EventRegistration.js';
// GET /api/eventregistrations/my
export const getUserEventIds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure userId exists on the request (set by your authentication middleware)
        const userId = req.body.userId;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        // Find all event registrations for this user
        const registrations = yield EventRegistrations.find({ userId });
        // Extract the eventIds from the registrations
        const eventIds = registrations.map((registration) => registration.eventId);
        res.status(200).json({ eventIds });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=getevent.js.map