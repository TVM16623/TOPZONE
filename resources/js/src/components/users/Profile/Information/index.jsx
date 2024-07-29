import { useEffect, useState } from "react";
import Title from "../../../../components/all/Title";
import Http from "../../../../utils/http";
import token from "../../../../utils/token";

export default function Information() {
    const [isGeneralDialogOpen, setIsGeneralDialogOpen] = useState(false);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: token.getUser().name || "",
        phone: token.getUser().phone || "",
        birthday: token.getUser().birthday || "",
        email: token.getUser().email || "",
        password: token.getUser().password || "", // assuming you have password in token
    });

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        Http.get("/user/address", { headers })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
        window.scrollTo(0, 0);
    }, []);

    const handleGeneralDialogOpen = () => {
        setIsGeneralDialogOpen(true);
    };

    const handleGeneralDialogClose = () => {
        setIsGeneralDialogOpen(false);
    };

    const handleLoginDialogOpen = () => {
        setIsLoginDialogOpen(true);
    };

    const handleLoginDialogClose = () => {
        setIsLoginDialogOpen(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted", userInfo);
        setIsGeneralDialogOpen(false);
        setIsLoginDialogOpen(false);
    };

    return (
        <>
            <Title>TopZone - Thông tin tài khoản</Title>
            <div className="min-h-100 border border-solid border-gray-400 rounded-lg mb-5 bg-gray-50">
                <div className="grid grid-cols-12 w-full px-28 gap-4">
                    <div className="col-span-8 w-full">
                        <h1 className="text-gray-950 text-3xl font-style:nomal mt-7">
                            Thông tin tài khoản
                        </h1>

                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-500 text-xl w-1/2">
                                Họ và tên
                            </h2>
                            <span className="w-1/2">{userInfo.name}</span>
                        </div>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-500 text-xl w-1/2">
                                Số điện thoại
                            </h2>
                            <span className="w-1/2">
                                {userInfo.phone || "Cập nhật số điện thoại"}
                            </span>
                        </div>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-500 text-xl w-1/2">
                                Ngày sinh
                            </h2>
                            <span className="w-1/2">
                                {userInfo.birthday || "Cập nhật ngày sinh"}
                            </span>
                        </div>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-500 text-xl w-1/2">
                                Email
                            </h2>
                            <span className="w-1/2">{userInfo.email}</span>
                        </div>
                        <button
                            className="bg-gray-50 hover:bg-gray-500 text-xl font-bold py-2 px-4 rounded-lg mt-4"
                            onClick={handleGeneralDialogOpen}
                        >
                            Cập nhật
                        </button>
                        <h1 className="text-gray-950 mt-6 text-3xl">
                            Thông tin đăng nhập
                        </h1>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-500 text-xl w-1/2">
                                Email
                            </h2>
                            <span className="w-1/2">{userInfo.email}</span>
                        </div>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-500 text-xl w-1/2">
                                Mật khẩu
                            </h2>
                            <span className="w-1/2">{userInfo.password}</span>
                        </div>

                        <button
                            className="bg-gray-50 hover:bg-gray-500 text-xl font-bold py-2 px-4 rounded-lg mt-4"
                            onClick={handleLoginDialogOpen}
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            </div>
            {isGeneralDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 w-full h-full bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                        <h2 className="text-2xl mb-4">Cập nhật thông tin</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={userInfo.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Cập nhật số điện thoại"
                                    value={userInfo.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    name="birthday"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Cập nhật ngày sinh"
                                    value={userInfo.birthday}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Lưu
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={handleGeneralDialogClose}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isLoginDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 w-full h-full bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                        <h2 className="text-2xl mb-4">
                            Cập nhật thông tin đăng nhập
                        </h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={userInfo.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={userInfo.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Lưu
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={handleLoginDialogClose}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
