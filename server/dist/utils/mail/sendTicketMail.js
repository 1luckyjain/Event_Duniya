var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from 'nodemailer';
// Set GMAIL_USER and GMAIL_PASS in your .env
export function sendTicketMail(user, event, paymentId, bookingTime, tierName) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                },
            });
            const mailOptions = {
                from: `"EventDuniya" <${process.env.GMAIL_USER}>`,
                to: user.email,
                subject: 'Your EventDuniya Ticket Booking Confirmation',
                html: `
        <div style="background: #f9f9f9; font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 2rem;">
          <div style="text-align: center;">
            <img src="https://www.eventduniya.com/logo.png" alt="EventDuniya Logo" style="max-width: 120px; margin-bottom: 1rem;" />
          </div>
          <div style="background: #fff; border-radius: 8px; padding: 1.5rem;">
            <h2 style="color: #6b46c1; margin-bottom: 0.5rem;">Booking Confirmation</h2>
            <p style="margin: 0; color: #555;">Hello ${user.username},</p>
            <p style="color: #333;">Your ticket has been booked successfully on ${bookingTime === null || bookingTime === void 0 ? void 0 : bookingTime.toLocaleString()}. Here are your details:</p>
            <hr />
            <table style="width: 100%; margin: 1rem 0; color: #333;">
              <tr><td><strong>User Email:</strong></td><td>${user.email}</td></tr>
              <tr><td><strong>Phone:</strong></td><td>${user.phone || 'N/A'}</td></tr>
              <tr><td><strong>Event Name:</strong></td><td>${event.title}</td></tr>
              <tr><td><strong>Ticket Tier:</strong></td><td>${tierName}</td></tr>
              <tr><td><strong>Venue Date:</strong></td><td>${(_a = event.date) === null || _a === void 0 ? void 0 : _a.toDateString()} at ${event.time}</td></tr>
              <tr><td><strong>Location:</strong></td><td>${event.location}</td></tr>
              <tr><td><strong>Payment ID:</strong></td><td>${paymentId}</td></tr>
            </table>
            <p style="font-weight: 500; color: #555;">Enjoy the event and have a great time!</p>
          </div>
          <p style="font-size: 0.875rem; color: #999; margin-top: 1rem;">This is an automated email. Please do not reply.</p>
        </div>
      `,
            };
            yield transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Failed to send email:', error);
        }
    });
}
//# sourceMappingURL=sendTicketMail.js.map