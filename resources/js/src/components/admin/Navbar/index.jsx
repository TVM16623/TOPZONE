import React, { useState } from "react";
import token from "../../../utils/token";
import Http from "../../../utils/http";
import { UserContext } from "../../..";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser } = React.useContext(UserContext);
    const handleLogout = () => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.post("/auth/logout", { headers })
            .then((response) => {
                if (response.status === "success") {
                    setUser({ ...user, isLoggedIn: false });
                    token.delete("access_token");
                    token.deleteUser();
                    toastify.success(response.message);
                } else if (response.status === "error") {
                    toastify.error(response.message);
                }
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
            <header className="w-full items-center bg-white py-2 px-6 hidden sm:flex">
                <div className="w-1/2">
                    {/* <div className="message flex justify-end">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                    </div> */}
                </div>
                <div className="relative w-1/2 flex justify-end">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="realtive z-10 w-12 h-12 rounded-full overflow-hidden border-2 border-gray-400 hover:border-gray-600 focus:border-gray-300 focus:outline-none"
                    >
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFGawQf5j61iM67TUx_tUeWgkP6cwQ4b9qgg&s" />
                    </button>
                    <div
                        className={`absolute w-32 bg-gray-200 rounded-lg shadow-lg py-2 mt-16 ${
                            isOpen ? "" : "hidden"
                        }`}
                    >
                        <a href="#" className="block px-4 py-2 text-blue-500">
                            xxx
                        </a>
                        <a href="#" className="block px-4 py-2 text-blue-500">
                            xxx
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-red-500"
                            onClick={handleLogout}
                        >
                            Sign Out
                        </a>
                    </div>
                </div>
            </header>
        </>
    );
}
