import { useEffect, useState } from "react";
import Title from "../../../../components/all/Title";
import Http from "../../../../utils/http";
import token from "../../../../utils/token";
import time from "../../../../utils/time";
import toastify from "../../../../utils/toastify";

export default function Information() {
    const [isGeneralDialogOpen, setIsGeneralDialogOpen] = useState(false);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    console.log(token.getUser());
    const [userInfo, setUserInfo] = useState({
        name: token.getUser().name || "",
        phone: token.getUser().phone || "",
        birthday: token.getUser().birthday || "",
        email: token.getUser().email || "",
    });
    const [isRequiredInfoComplete, setIsRequiredInfoComplete] = useState(true);
    const [maxDate, setMaxDate] = useState("");
    const [newpassword, setNewPassWord] = useState("");
    const [oldpassword, setOldPassWord] = useState("");
    useEffect(() => {
        // Set the max date for the birthday input
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
        const dd = String(today.getDate()).padStart(2, "0");
        setMaxDate(`${yyyy}-${mm}-${dd}`);

        // Fetch user address
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

        // Check if the value is numeric for phone input
        if (name === "phone") {
            // Allow only numeric values and limit to 10 digits
            if (!/^[0-9]*$/.test(value) || value.length > 10) {
                return; // Do not update state if input is not numeric or exceeds 10 digits
            }
        }

        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (
            !userInfo.name ||
            !userInfo.email ||
            !userInfo.phone ||
            !userInfo.birthday
        ) {
            setIsRequiredInfoComplete(false);
            return;
        }

        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        Http.post("/user/information-account/update", userInfo, {
            headers,
        }).then((res) => {
            setIsGeneralDialogOpen(false);
            setIsLoginDialogOpen(false);
            if (res.status === "error") toastify.error(res.message);
            else toastify.success("Cập nhật thành công");
        });
    };
    const handledSubmitResetPassword = (e) => {
        e.preventDefault();
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.post(
            "/user/information-account/resetpassword",
            { password: oldpassword, newpassword: newpassword },
            { headers }
        ).then((res) => {
            if (res.status === "error") toastify.error(res.message);
            else {
                toastify.success("Cập nhật thành công");
            }
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const formattedBirthday = formatDate(userInfo.birthday);

    return (
        <>
            <Title>TopZone - Thông tin tài khoản</Title>
            <div className="min-h-100 border border-solid border-gray-400 rounded-lg mb-5 bg-gray-50">
                <div className="grid grid-cols-12 w-full px-28 gap-4">
                    <div className="col-span-8 w-full">
                        <h1 className="text-gray-950 text-3xl font-style:normal mt-7">
                            Thông tin tài khoản
                        </h1>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-950 text-xl w-1/2">
                                Họ và Tên
                            </h2>
                            <span className="w-1/2">{userInfo.name}</span>
                        </div>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-950 text-xl w-1/2">
                                Số điện thoại
                            </h2>
                            <span className="w-1/2">
                                {userInfo.phone || "Cập nhật số điện thoại"}
                            </span>
                        </div>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-950 text-xl w-1/2">
                                Ngày sinh
                            </h2>
                            <span className="w-1/2">
                                {time.format(userInfo.birthday) ||
                                    "Cập nhật ngày sinh"}
                            </span>
                        </div>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-950 text-xl w-1/2">
                                Email
                            </h2>
                            <span className="w-1/2">{userInfo.email}</span>
                        </div>
                        <button
                            className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 mt-4"
                            onClick={handleGeneralDialogOpen}
                        >
                            Cập nhật
                        </button>
                        <h1 className="text-gray-950 mt-6 text-3xl">
                            Thông tin đăng nhập
                        </h1>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-950 text-xl w-1/2">
                                Email
                            </h2>
                            <span className="w-1/2">{userInfo.email}</span>
                        </div>
                        <div className="flex mt-7 text-xl">
                            <h2 className="text-gray-950 text-xl w-1/2">
                                Mật khẩu
                            </h2>
                            <span className="w-1/2">
                                {userInfo.password || "Cập nhật mật khẩu"}
                            </span>
                        </div>
                        <button
                            className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 mt-4 mb-5"
                            onClick={handleLoginDialogOpen}
                        >
                            Đổi mật khẩu
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
                                    type="tel"
                                    name="phone"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Cập nhật số điện thoại"
                                    value={userInfo.phone}
                                    onChange={handleInputChange}
                                    pattern="[0-9]*"
                                    maxLength="10" // Limit the input to 10 digits
                                    required
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
                                    value={formattedBirthday}
                                    onChange={handleInputChange}
                                    max={maxDate} // Set the max attribute dynamically
                                />
                            </div>
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
                        {!isRequiredInfoComplete && (
                            <div className="text-red-500 text-sm mt-2">
                                Vui lòng điền đầy đủ thông tin bắt buộc.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isLoginDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 w-full h-full bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                        <h2 className="text-2xl mb-4">Đổi mật khẩu</h2>
                        <form onSubmit={handledSubmitResetPassword}>
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
                                    value={oldpassword}
                                    onChange={(e) => {
                                        setOldPassWord(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    name="newpassword"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={newpassword}
                                    onChange={(e) => {
                                        setNewPassWord(e.target.value);
                                    }}
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
                        {!isRequiredInfoComplete && (
                            <div className="text-red-500 text-sm mt-2">
                                Vui lòng điền đầy đủ thông tin bắt buộc.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
