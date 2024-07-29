import { Link, Navigate, useNavigate } from "react-router-dom";
import Title from "../../../../components/all/Title";
import toastify from "../../../../utils/toastify";
import { useContext, useState } from "react";
import { UserContext } from "../../../../index";
import token from "../../../../utils/token";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "../../../../components/users/GoogleLogin";
import Http from "../../../../utils/http";
import { useCart } from "../../../../Context/CartContext";

export default function Login() {
    const navigate = useNavigate();
    const [passwordText, setPasswordText] = useState();
    const { setUpdateCart } = useCart();
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const { user, setUser } = useContext(UserContext);
    function __setInput(attr) {
        return (e) => {
            setData((data) => ({ ...data, [attr]: e.target.value }));
        };
    }

    return (
        <>
            <Title>TopZone - Đăng nhập</Title>
            <div className="h-[600px]">
                <div className="py-2 px-32 h-full">
                    <div className="flex justify-center h-full bg-[#323232] rounded-lg shadow-lg">
                        <div
                            className="hidden bg-cover lg:block lg:w-2/3 rounded-l-lg bg-[#323232]"
                            style={{
                                backgroundImage:
                                    "url(https://phongvu.vn/cong-nghe/wp-content/uploads/2021/05/hanh-trinh-phat-trien-apple-phong-vu-4.jpg)",
                            }}
                        ></div>

                        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-1/3">
                            <div className="flex-1">
                                <div className="text-center">
                                    <div className="flex justify-center mx-auto">
                                        <img
                                            className="w-auto h-7 sm:h-8"
                                            src="/../assets/images/logo.png"
                                            alt=""
                                        />
                                    </div>
                                    {/* <p className="mt-3 text-gray-500 text-gray-300">Sign in to access your account</p> */}
                                </div>

                                <div className="mt-8">
                                    <form
                                        method="POST"
                                        onSubmit={(e) => {
                                            e.preventDefault();

                                            Http.post("/auth/login", data).then(
                                                (res) => {
                                                    if (
                                                        res.status !== "success"
                                                    ) {
                                                        toastify.error(
                                                            res.message
                                                        );
                                                        return;
                                                    }
                                                    toastify.success(
                                                        res.message
                                                    );
                                                    setUser({
                                                        ...user,
                                                        isLoggedIn: true,
                                                    });
                                                    token.setUser(res.user);
                                                    setUpdateCart(true);
                                                    if (res.user.is_admin) {
                                                        navigate("/admin");
                                                        return;
                                                    }
                                                }
                                            );
                                        }}
                                    >
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block mb-2 text-sm text-gray-600 text-gray-200"
                                            >
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder="example@example.com"
                                                className="block w-full px-4 py-2 mt-2 placeholder-gray-400 bg-[#323232]
                                            border border-gray-600 rounded-lg placeholder-gray-600  text-gray-300
                                            border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400
                                            focus:outline-none focus:ring focus:ring-opacity-40"
                                                onChange={__setInput("email")}
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="password"
                                                    className="block text-sm text-gray-600 text-gray-200"
                                                >
                                                    Mật khẩu
                                                </label>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <input
                                                    onChange={__setInput(
                                                        "password"
                                                    )}
                                                    required
                                                    type={
                                                        passwordText
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="password"
                                                    id="password"
                                                    placeholder="Điền mật khẩu của bạn"
                                                    className="block w-full px-4 pr-9 py-2 mt-2 placeholder-gray-400
                                                    bg-[#323232] border border-gray-600 rounded-lg placeholder-gray-600
                                                    text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400
                                                    focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                                />
                                                <div className="relative">
                                                    <svg
                                                        onClick={() => {
                                                            setPasswordText(
                                                                !passwordText
                                                            );
                                                        }}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 size-6 text-zinc-500 pt-2"
                                                    >
                                                        {passwordText ? (
                                                            <>
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                                />
                                                            </>
                                                        ) : (
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                                            />
                                                        )}
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="mt-2">
                                                <Link
                                                    to="/../auth/forgot-password"
                                                    className="text-sm text-blue-500 focus:underline hover:underline"
                                                >
                                                    Quên mật khẩu ?
                                                </Link>
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="mb-2 w-full px-4 py-2 tracking-wide text-white
                                                    transition-colors duration-300 transform bg-blue-500 rounded-lg
                                                    hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring
                                                    focus:ring-blue-300 focus:ring-opacity-50"
                                            >
                                                Đăng Nhập
                                            </button>
                                            <ButtonLoginGoogle />
                                        </div>
                                    </form>

                                    <p className="mt-4 text-sm text-center text-gray-400">
                                        Bạn chưa có tài khoản?
                                        <Link
                                            to="/../auth/register"
                                            className="text-blue-500 focus:underline hover:underline"
                                        >
                                            Đăng kí
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function ButtonLoginGoogle() {
    const { user, setUser } = useContext(UserContext);
    const { setUpdateCart } = useCart();
    const navigate = useNavigate();

    const handleLogin = (data) => {
        if (data?.status === "success") {
            setUser({
                ...user,
                name: data.user.name,
                email: data.user.email,
                isLoggedIn: true,
            });

            token.set("access_token", data.access_token);
            token.setUser(data.user);

            toastify.success(data.message);
            setUpdateCart(true);
            return navigate("/");
        }

        return toastify.error(data.message);
    };
    return (
        <>
            {token.has("user") ? (
                ""
            ) : (
                <GoogleOAuthProvider clientId="869011497190-45chn705s0tajnohe3hju69vivs4qc3a.apps.googleusercontent.com">
                    <GoogleLogin onGet={handleLogin} />
                </GoogleOAuthProvider>
            )}
        </>
    );
}
