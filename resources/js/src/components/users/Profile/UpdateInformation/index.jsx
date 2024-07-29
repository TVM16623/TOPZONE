import Title from "./../../../../components/all/Title/index";
import { useState } from "react";

export default function UpdateInformation() {
    const [formData, setFormData] = useState({
        hoTen: "",
        ngaySinh: {
            ngay: 1,
            thang: 1,
            nam: 1970,
        },
        gioiTinh: "Nam",
        soDienThoai: "",
        batDangNhapSDT: false,
        chieuCao: 158,
        canNang: 60,
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
    };
    return (
        <>
            <Title>Chỉnh sửa thông tin tài khoản </Title>
            <div className="container mx-auto max-w-sm p-4">
                <h2 className="text-2xl font-bold text-center">
                    Chỉnh sửa thông tin tài khoản
                </h2>
            </div>
            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                        Họ tên của bạn
                    </label>
                    <input
                        type="text"
                        name="hoTen"
                        value={formData.hoTen}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                        Ngày sinh
                    </label>
                    <div className="flex items-center">
                        <select
                            name="ngay"
                            value={formData.ngaySinh.ngay}
                            onChange={handleChange}
                            className="mr-2 w-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                                (ngay) => (
                                    <option key={ngay} value={ngay}>
                                        {ngay}
                                    </option>
                                )
                            )}
                        </select>
                        <select
                            name="thang"
                            value={formData.ngaySinh.thang}
                            onChange={handleChange}
                            className="mr-2 w-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (thang) => (
                                    <option key={thang} value={thang}>
                                        {thang}
                                    </option>
                                )
                            )}
                        </select>
                        <select
                            name="nam"
                            value={formData.ngaySinh.nam}
                            onChange={handleChange}
                            className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Array.from(
                                { length: 100 },
                                (_, i) => 1970 + i
                            ).map((nam) => (
                                <option key={nam} value={nam}>
                                    {nam}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </form>
        </>
    );
}
