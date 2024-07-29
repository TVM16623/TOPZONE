import React, { useEffect, useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastify from "../../../utils/toastify";
import AddProductDetailForm from "../../../components/admin/AddProductDetailForm";

const ProductForm = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [form, setForm] = useState({
        name: "",
        sub_category_id: undefined,
        sub_description: "",
        description: "",
        discount: undefined,
    });
    const [details, setDetails] = useState([
        {
            color_id: undefined,
            image: "",
            type_id: "",
            sku: "",
            price: undefined,
            stock: undefined,
            specifications: "",
        },
    ]);
    const [subCategories, setSubCategories] = useState(null);
    const [colorsData, setColorsData] = useState(null);
    const [typesData, setTypesData] = useState(null);

    const fetchData = async () => {
        try {
            let accessToken = token.get("access_token");
            let headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const colorsPromise = Http.get(`/admin/colors/getAll`, { headers });
            const subCategoriesPromise = Http.get(`/admin/subCategories`, {
                headers,
            });
            const typesPromise = Http.get(`/admin/types`, { headers });

            const [colorsRes, subCategoriesRes, typesRes] = await Promise.all([
                colorsPromise,
                subCategoriesPromise,
                typesPromise,
            ]);

            setColorsData(colorsRes);
            setSubCategories(subCategoriesRes);
            setTypesData(typesRes);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (slug) {
            let accessToken = token.get("access_token");
            let headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            Http.get(`/admin/products/${slug}`, { headers })
                .then((res) => {
                    setForm({
                        slug: res.data.product.slug,
                        name: res.data.product.name,
                        sub_category_id: res.data.product.sub_category_id,
                        sub_description: res.data.product.sub_description,
                        description: res.data.product.description,
                        discount: res.data.product.discount,
                    });
                    setDetails(res.data.product.product_details);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [slug]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const payload = {
            ...form,
            product_details: details,
        };

        console.log("payload", payload);

        Http.post(`/admin/products/store`, payload, {
            headers,
        })
            .then((res) => {
                if (res.status === 200) {
                    toastify.success(res.message);
                    navigate("/admin/product");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            <div className="p-4">
                <form onSubmit={handleSubmit} method="post">
                    <div className="grid gap-6 mb-6 md:grid-cols-3">
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Tên sản phẩm
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
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Danh mục
                            </label>
                            <select
                                id="sub_category_id"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        sub_category_id: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                <option value="">-- Danh mục --</option>
                                {subCategories &&
                                    subCategories.map((subCategory) => (
                                        <option
                                            key={subCategory.id}
                                            value={subCategory.id}
                                            selected={
                                                subCategory.id ==
                                                form.sub_category_id
                                            }
                                        >
                                            {subCategory.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="image"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Mô tả
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value,
                                    })
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
                                Mô tả ngắn gọn
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={form.sub_description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        sub_description: e.target.value,
                                    })
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
                                Giảm giá
                            </label>
                            <input
                                type="number"
                                id="name"
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
                        <div className="col-span-12">
                            <AddProductDetailForm
                                details={details}
                                setDetails={setDetails}
                                colors={colorsData}
                                types={typesData}
                            />
                        </div>
                    </div>
                    <Link to="/admin/product">
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
};

export default ProductForm;
