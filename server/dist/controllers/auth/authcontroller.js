// // src/controllers/authController.ts
// import { Request, Response } from 'express';
// import { registerArtist, RegisterArtistDto, registerUser, RegisterUserDto, login } from '../../services/auth/authservice';
// import { generateAccessToken, generateRefreshToken } from '../../services/tokenservice/tokenService';
// export const register = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     // Determine if we are registering an Artist based on the "role" in the request body.
//     const { role, ...data } = req.body;
//     let user;
//     if (role && role === 'Artist') {
//       user = await registerArtist(data as RegisterArtistDto);
//     } else {
//       user = await registerUser(data as RegisterUserDto);
//     }
//     return res.status(201).json({ message: 'Registration successful', user });
//   } catch (error: any) {
//     return res.status(400).json({ message: error.message });
//   }
// };
// export const loginController = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { email, password } = req.body;
//     const user = await login(email, password);
//     const accessToken = generateAccessToken({ id: user._id, username: user.username, role: user.role });
//     const refreshToken = generateRefreshToken({ id: user._id, username: user.username, role: user.role });
//     // Set tokens as HTTP‑only cookies.
//     res.cookie('accessToken', accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 15 * 60 * 1000, // 15 minutes
//     });
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });
//     return res.json({ message: 'Login successful', user });
//   } catch (error: any) {
//     return res.status(401).json({ message: error.message });
//   }
// };
