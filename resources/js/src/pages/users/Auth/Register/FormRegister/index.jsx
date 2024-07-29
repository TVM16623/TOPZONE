import { useState } from "react";
import toastify from "../../../../../utils/toastify";
import Http from "../../../../../utils/http";
import token from "../../../../../utils/token";
import { useNavigate } from "react-router-dom";

export default function FormRegister({ data, setData, setUser, user }) {
    const navigate = useNavigate();
    const [passwordText, setPasswordText] = useState(false);
    const [passwordConfirmText, setPasswordConfirmText] = useState(false);
    function __setInput(attr) {
        return (e) => {
            setData((data) => ({ ...data, [attr]: e.target.value }));
        };
    }

    return (
        <form
            method="POST"
            className="min-h-[350px]"
            onSubmit={(e) => {
                e.preventDefault();
                if (data.email.length < 8) {
                    return toastify.error(
                        "Email không hợp lệ!",
                        "top",
                        "right"
                    );
                } else if (data.password.length < 8) {
                    return toastify.error(
                        "Password minimum 8 characters!",
                        "top",
                        "right"
                    );
                } else if (data.password !== data.password_confirmation) {
                    return toastify.error(
                        "Password and password confirm does not match!",
                        "top",
                        "right"
                    );
                }

                Http.post("/auth/register", { data }).then((res) => {
                    // if (res.status !== "success") {
                    //     toastify.error(res.message, "top", "right", 3000);
                    //     return;
                    // }
                    // token.setEmailVerify({ email: res.data.email, isWaiting: true });
                    toastify.success("Đăng ký tài khoản thành công");
                    // setUser({ ...user });
                    navigate("/auth/login");
                });
            }}
        >
            <div>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-gray-600 text-gray-200"
                >
                    Địa chỉ Email
                </label>
                <input
                    onChange={__setInput("email")}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="example@example.com"
                    className="
                        block w-full px-4 py-2 mt-2
                        placeholder-gray-400 bg-[#323232]
                        border border-gray-600 rounded-lg placeholder-gray-600  text-gray-300
                        border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400
                        focus:outline-none focus:ring focus:ring-opacity-40"
                />
            </div>

            <div>
                <label
                    htmlFor="name"
                    className="block mb-2 text-sm text-gray-600 text-gray-200 mt-4"
                >
                    Họ và tên
                </label>
                <input
                    onChange={__setInput("name")}
                    type="name"
                    name="name"
                    id="name"
                    placeholder="Nhập tên của bạn"
                    className="
                        block w-full px-4 py-2 mt-2 placeholder-gray-400 bg-[#323232]
                        border border-gray-600 rounded-lg placeholder-gray-600  text-gray-300
                        border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400
                        focus:outline-none focus:ring focus:ring-opacity-40
                    "
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
                        onChange={__setInput("password")}
                        required
                        type={passwordText ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Điền mật khẩu của bạn"
                        className="
                        block w-full px-4 pr-9 py-2 mt-2 placeholder-gray-400 bg-[#323232]
                        border border-gray-600 rounded-lg placeholder-gray-600  text-gray-300
                        border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400
                        focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                    <div className="relative">
                        <svg
                            onClick={() => {
                                setPasswordText(!passwordText);
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
            </div>

            <div className="mt-4">
                {/* Nhãn được đặt trong một thẻ div riêng biệt */}
                <div className="mb-2">
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm text-gray-600 text-gray-200"
                    >
                        Xác nhận mật khẩu
                    </label>
                </div>
                {/* Phần input và biểu tượng */}
                <div className="flex justify-between items-center">
                    <input
                        type={passwordConfirmText ? "text" : "password"}
                        onChange={__setInput("password_confirmation")}
                        name="password_confirmation"
                        id="password_confirmation"
                        placeholder="Điền lại mật khẩu của bạn"
                        className="
                        block w-full px-4 pr-9 py-2 mt-2 placeholder-gray-400 bg-[#323232]
                        border border-gray-600 rounded-lg placeholder-gray-600  text-gray-300
                        border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400
                        focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                    <div className="relative">
                        <svg
                            onClick={() => {
                                setPasswordConfirmText(!passwordConfirmText);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 size-6 text-zinc-500 pt-2"
                        >
                            {passwordConfirmText ? (
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
            </div>
            <div className="mt-4">
                <button
                    className="
                        w-full px-4 py-2 tracking-wide text-white
                        transition-colors duration-300 transform bg-blue-500
                        rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400
                        focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    type="submit"
                >
                    Đăng Kí
                </button>
            </div>
        </form>
    );
}
