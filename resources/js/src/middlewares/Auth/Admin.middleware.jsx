import React, { useContext } from "react";
import { UserContext } from "../../index";
import token from "../../utils/token";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminMiddleware({ user }) {
    const userInfo = useContext(UserContext);

    if (!token.getUser()) {
        return <Navigate to="/" />;
    }
    if (userInfo.user.isAdmin === false) return <Navigate to="/" />;

    return <Outlet />;
}
