import React from 'react';
import { UserContext } from '../..';
import token from '../../utils/token';
import { Navigate, Outlet } from "react-router-dom";

function UserMiddleware() {
    const userInfo = React.useContext(UserContext);

    //Nếu không có token hoặc không có user trong localStorage
    if (!token.get('access_token') || !token.get('user')) {
        return <Navigate to="/auth/login" />;
    }

    //Nếu isLogin = true có nghĩa là đang fetch data user
    if (userInfo.user.isLoggedIn === false) {
        return (<p>Đang xác thực...</p>);
    }

    return <Outlet />;
}

function GuestMiddleware() {
    // chưa login mới cho vào.
    // login | register page
    const userInfo = React.useContext(UserContext);

    //Nếu không có token hoặc không có user trong localStorage
    if (token.get('access_token') || token.get('user')) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export { UserMiddleware, GuestMiddleware }
