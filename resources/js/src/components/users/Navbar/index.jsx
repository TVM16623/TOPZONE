import React, { createContext, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryContext } from "../../../Context/CategoryContext";
import useStickyNavbar from "../../../hooks/useStickyNavbar";
import { UserContext } from "../../..";
import Search from "../../all/Search";
import token from "../../../utils/token";
import Http from "../../../utils/http";
import toastify from "../../../utils/toastify";
import { useCart } from "../../../Context/CartContext";

export default function Navbar() {
    const isSticky = useStickyNavbar();
    const categories = useContext(CategoryContext);
    const { quantity } = useCart();

    return (
        <>
            <header
                className={`p-2 transition-all ease-in-out duration-1000 ${
                    isSticky ? "sticky top-0 shadow-lg" : "top-[-50px]"
                }`}
            >
                <div className="head ">
                    <div className="logo-topzone">
                        <Link to="/">
                            <i className="topzone-logo"></i>
                        </Link>
                        {/* <Link to="/">
                            <img src="/../assets/images/apple.gif" alt="logo-apple" className="h-12" />
                        </Link> */}
                    </div>
                    <ul className="menu h-full">
                        {categories?.map((cat, index) => (
                            <li className="menu-ip m-h-" key={index}>
                                <Link
                                    to={`category/${cat.slug}`}
                                    className="h-full"
                                >
                                    <span className="h-full text-base">
                                        {cat.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="filter-product">
                        <Search />
                    </div>

                    {token.has("user") ? (
                        <>
                            <Cart _quantity={quantity} />
                            <User />
                        </>
                    ) : (
                        <div className="gap-2 grid grid-cols-2">
                            <LoginRegisterButton />
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}

const User = () => {
    const { user, setUser } = React.useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const listMenu = [
        // {
        //     name: "Lịch Sử Đơn Hàng",
        //     image: "/../",
        //     url: "orders",
        // },
        // {
        //     name: "Sổ Địa Chỉ",
        //     image: "/../",
        //     url: "user-address",
        // },
        // {
        //     name: "Cài Đặt Tài Khoản",
        //     image: "/../",
        //     url: "info",
        // },
        // {
        //     name: "Đánh Giá Và Phản Hồi",
        //     image: "/../",
        //     url: "reviews",
        // },
        {
            name: "Tài khoản",
            url: "/user",
        },
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.post("/auth/logout", { headers })
            .then((response) => {
                setUser({ ...user, isLoggedIn: false });
                token.delete("access_token");
                token.deleteUser();
                toastify.success(response.message);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                window.location.reload();
            });
    };

    return (
        <>
            <div className="relative inline-block text-left z-10 pt-2">
                <div>
                    <button
                        type="button"
                        onClick={toggleDropdown}
                        className="md:w-[150px]
                            inline-flex justify-center rounded-md
                            border border-gray-300 shadow-sm px-4 py-2 bg-white
                            text-sm font-medium text-gray-700 hover:bg-gray-50
                            focus:outline-none"
                    >
                        <span className="truncate">{token.getUser().name}</span>
                        <svg
                            className="-mr-1 ml-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                            {listMenu?.map((item, index) => (
                                <Link
                                    to={item.url}
                                    key={index}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <hr />
                            <button
                                className="text-start block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full hover:text-red-600"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export function LoginRegisterButton() {
    return (
        <>
            <Link
                to="/../auth/login"
                className="text-center hover:bg-[#1e1b4b] text-[#fff] font-semibold hover:text-white py-2 px-4 border border-[#292524] hover:border-transparent rounded"
            >
                Login
            </Link>

            <Link
                to="/../auth/register"
                className="text center hover:bg-[#052e16] text-[#fff] font-semibold hover:text-white py-2 px-4 border border-[#1c1917] hover:border-transparent rounded"
            >
                Register
            </Link>
        </>
    );
}

export function Cart({ _quantity }) {
    return (
        <>
            <div className="cart-product">
                <Link className="relative py-2 cursor-pointer" to="/cart">
                    <div className="t-0 absolute left-3">
                        <p
                            className="flex h-2 w-2 items-center
                                    justify-center rounded-full bg-red-500
                                    p-[10px] text-xs text-white"
                        >
                            {_quantity}
                        </p>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="file: mt-4 h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5
                                14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684
                                2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106
                                 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75
                                 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                    </svg>
                </Link>
            </div>
        </>
    );
}
