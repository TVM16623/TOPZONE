import React, { useEffect, useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastify from "../../../utils/toastify";

export default function CategoryForm() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [form, setForm] = useState({
        name: "",
        image: "",
        logo: "",
    });

    useEffect(() => {
        if (slug) {
            let accessToken = token.get("access_token");
            let headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            Http.get(`/admin/categories/${slug}`, { headers })
                .then((res) => {
                    setForm({
                        name: res.name,
                        image: res.image,
                        logo: res.logo,
                        slug: res.slug,
                    });
                })
                .catch((err) => {
                    toastify.error("Đã xảy ra lỗi");
                    console.error(err);
                });
        }
    }, [slug]);

    function handleSubmit(e) {
        e.preventDefault();
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.post("/admin/categories/store", form, { headers })
            .then((res) => {
                if (res.status === 200) {
                    toastify.success(res.message);
                    navigate("/admin/categories");
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
                                Tên danh mục
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
                                htmlFor="image"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                URL ảnh
                            </label>
                            <input
                                type="text"
                                id="image"
                                value={form.image}
                                onChange={(e) =>
                                    setForm({ ...form, image: e.target.value })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="image"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                URL logo
                            </label>
                            <input
                                type="text"
                                id="logo"
                                value={form.logo}
                                onChange={(e) =>
                                    setForm({ ...form, logo: e.target.value })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                    </div>
                    <Link to="/admin/categories">
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
