// src/models/User.ts
import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    phone: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['User', 'Admin', 'Artist'],
        default: 'User',
    },
    bookedEvents: [{
            type: String,
            default: [],
        }],
});
const User = model('User', UserSchema);
export default User;
//# sourceMappingURL=User.js.map