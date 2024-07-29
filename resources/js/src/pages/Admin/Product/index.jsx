import React, { useEffect, useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import Pagination from "../../../components/admin/Pagination";
import { Link } from "react-router-dom";
import ConfirmDelete from "../../../components/admin/Modal/ConfirmDelete";
import toastify from "../../../utils/toastify";
import { displaySTT, formatVND } from "../../../utils/Hepers";
import ProductDetailModal from "../../../components/admin/Modal/ProductDetailModal";

export default function Products() {
    const [data, setData] = useState(null);
    const [isShow, setShow] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        last_page: 0,
        per_page: 0,
    });
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleShowModalDetail = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    const search = (currentPage) => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get(`/admin/products?page=${currentPage}`, {
            headers,
        })
            .then((res) => {
                const { data, current_page, total, last_page, per_page } = res;
                setData(data);
                setPagination({ current_page, total, last_page, per_page });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleChangePage = (page) => {
        search(page);
    };

    const handleShowModal = (id) => {
        setShow(true);
        setDeleteId(id);
    };

    const handleDelete = () => {
        setShow(false);
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const payload = {
            id: deleteId,
        };

        Http.post(`/admin/products/delete`, payload, { headers })
            .then((res) => {
                if (res.status === 200) {
                    setData(data.filter((item) => item.id !== deleteId));
                    toastify.success(res.message);
                    setDeleteId(null);
                }
            })
            .catch((err) => {
                toastify.error("Đã xảy ra lỗi");
            });
    };

    useEffect(() => {
        search(pagination.current_page);
    }, []);

    return (
        <>
            <div className="p-4">
                <div className="flex items-center justify-end">
                    <Link
                        to={"/admin/product/create"}
                        className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    >
                        Thêm mới
                    </Link>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-white uppercase bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    STT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Slug
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tên sản phẩm
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ảnh sản phẩm
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Giảm giá
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center"
                                >
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data &&
                                data.map((item, index) => {
                                    const firstColorKey = item.image
                                        ? Object.keys(item.image)[0]
                                        : null;
                                    const firstImageUrl =
                                        firstColorKey &&
                                        item.image[firstColorKey] &&
                                        item.image[firstColorKey][0];

                                    return (
                                        <tr
                                            className="bg-white border-b"
                                            key={item.id}
                                        >
                                            <td className="px-6 py-4">
                                                {displaySTT(
                                                    pagination.current_page,
                                                    pagination.per_page,
                                                    index
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.slug}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {firstImageUrl && (
                                                    <img
                                                        src={firstImageUrl} // Display the first image of the first color
                                                        className="h-auto w-[100px] object-contain"
                                                        alt={item.name}
                                                    />
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.discount}%
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        handleShowModalDetail(
                                                            item
                                                        )
                                                    }
                                                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 me-2 py-2.5"
                                                >
                                                    Chi tiết
                                                </button>
                                                <Link
                                                    to={`/admin/product/edit/${item.slug}`}
                                                >
                                                    <button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                                        Cập nhật
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleShowModal(item.id)
                                                    }
                                                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    pagination={pagination}
                    handleChangePage={handleChangePage}
                />
            </div>
            <ConfirmDelete
                isShow={isShow}
                setShow={setShow}
                handleDelete={handleDelete}
            />
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}
