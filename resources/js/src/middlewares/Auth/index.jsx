import AdminMiddleware from "./Admin.middleware";
import { UserMiddleware, GuestMiddleware } from "./User.middleware";


export default {
    isLogin: UserMiddleware,
    notLoggedIn: GuestMiddleware,
    isAdmin: AdminMiddleware
}
