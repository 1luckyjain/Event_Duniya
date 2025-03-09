import { login } from "./login/login.controller.js";
import { signUp } from "./signup/signup.controller.js";
import { logout } from "./logout/logout.controller.js";
import { refreshAccessToken } from "./refresh/refresh.controller.js";
import { googleAuth } from "./googleauth/googleAuth.js";
export const authController = { login, signUp, logout, refreshAccessToken, googleAuth };
//# sourceMappingURL=index.js.map