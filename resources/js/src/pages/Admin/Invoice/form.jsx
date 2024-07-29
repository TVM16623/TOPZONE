import React, { useEffect, useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastify from "../../../utils/toastify";

export default function PromotionForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        key: "",
        discount: null,
        quantity: null,
        minimum: null,
        start_date: null,
        end_date: null,
    });

    useEffect(() => {
        if (id) {
            let accessToken = token.get("access_token");
            let headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            Http.get(`/admin/promotions/${id}`, { headers })
                .then((res) => {
                    setForm({
                        key: res.key,
                        discount: res.discount,
                        quantity: res.quantity,
                        minimum: res.minimum,
                        start_date: res.start_date,
                        end_date: res.end_date,
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
        Http.post("/admin/promotions/store", form, { headers })
            .then((res) => {
                if (res.status === 200) {
                    toastify.success(res.message);
                    navigate("/admin/promotion");
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
                                htmlFor="key"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Mã phiếu
                            </label>
                            <input
                                type="text"
                                id="key"
                                value={form.key}
                                onChange={(e) =>
                                    setForm({ ...form, key: e.target.value })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="discount"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Giảm giá
                            </label>
                            <input
                                type="number"
                                id="discount"
                                value={form.discount}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        discount: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="discount"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Số lượng
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                value={form.quantity}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        quantity: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="minimum"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Giá trị tối thiểu
                            </label>
                            <input
                                type="number"
                                id="minimum"
                                value={form.minimum}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        minimum: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="start_date"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Ngày bắt đầu
                            </label>
                            <input
                                type="datetime-local"
                                id="start_date"
                                value={form.start_date}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        start_date: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="end_date"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Ngày kết thúc
                            </label>
                            <input
                                type="datetime-local"
                                id="end_date"
                                value={form.end_date}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        end_date: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                    </div>
                    <Link to="/admin/promotion">
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
