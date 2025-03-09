var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import EventRegistrations from "../../models/EventRegistration";
import Event from "../../models/Event";
export const eventRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const event = yield Event.findById(id);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        const ticket = new EventRegistrations({ eventId: id, userId });
        yield ticket.save();
        res.status(201).json({ message: "Ticket booked successfully", ticket });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
        return;
    }
});
