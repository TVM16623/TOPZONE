import React, { useEffect, useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastify from "../../../utils/toastify";

export default function ColorForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        name: "",
        value: "",
    });

    useEffect(() => {
        if (id) {
            let accessToken = token.get("access_token");
            let headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            Http.get(`/admin/colors/${id}`, { headers })
                .then((res) => {
                    setForm({
                        name: res.name,
                        value: res.value,
                        id: res.id,
                    });
                })
                .catch((err) => {
                    toastify.error("Đã xảy ra lỗi");
                    console.error(err);
                });
        }
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.post("/admin/colors/store", form, { headers })
            .then((res) => {
                if (res.status === 200) {
                    toastify.success(res.message);
                    navigate("/admin/color");
                }
            })
            .catch((err) => {
                toastify.error("Đã xảy ra lỗi");
                console.error(err);
            });
    }

    return (
        <>
            <div className="p-4">
                <form onSubmit={handleSubmit} method="post">
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Tên màu
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="value"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Mã màu
                            </label>
                            <input
                                type="color"
                                id="value"
                                value={form.value}
                                onChange={(e) =>
                                    setForm({ ...form, value: e.target.value })
                                }
                                className=""
                                required
                            />
                        </div>
                    </div>
                    <Link to="/admin/color">
                        <button className="py-2.5 px-5 ms-3 text-sm me-3 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                            Trở về
                        </button>
                    </Link>

                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        Lưu
                    </button>
                </form>
            </div>
        </>
    );
}
