import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectToDatabase from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/auth/auth.route.js';
import eventRoutes from './routes/event/event.route.js';
import userRoutes from './routes/user/user.route.js';
import artistRoutes from './routes/artist/artist.route.js';
import eventRegistratoinRoute from './routes/event/eventregistration/eventregistration.route.js';
import artistReviews from './routes/artist/review/review.js';
import fileUpload from './routes/fileupload/fileuplad.js';
import contact from './routes/artist/contact/contact.js';
import savedArtist from './routes/user/favartist/favartist.js';
import paymentRoutes from './routes/payment/payment.route.js';
import bookingsRouter from './routes/bookings/bookings.route.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
const app = express();
// Setup middleware
app.use(cookieParser(process.env.SECRET_COOKIE));
app.set("trust proxy", 1);
app.use(session({
    secret: process.env.SECRET_COOKIE,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production", // Secure only in production
        sameSite: "none", // Required for cross-origin cookies
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    },
}));
// Configure CORS with proper options
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect to MongoDB
connectToDatabase();
// Add route debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});
// Add a test route to verify API is working
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});
// Register routes - moving payments to the top
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/user', userRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/bookticket', eventRegistratoinRoute);
app.use('/api/review', artistReviews);
app.use('/api/image', fileUpload);
app.use('/api/contact', contact);
app.use('/api/savedartist', savedArtist);
app.use('/api/bookings', bookingsRouter);
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.status(200).json({ data: "EventDuniya API is running" });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
//# sourceMappingURL=app.js.map