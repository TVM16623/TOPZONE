import React, { useEffect, useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import Pagination from "../../../components/admin/Pagination";
import { Link } from "react-router-dom";
import ConfirmDelete from "../../../components/admin/Modal/ConfirmDelete";
import toastify from "../../../utils/toastify";
import { displaySTT } from "../../../utils/Hepers";
import StarRatingDisplay from "../../../components/users/Star";
import Reply from "../../../components/admin/Modal/Reply";

export default function Reviews() {
    const [data, setData] = useState(null);
    const [isShow, setShow] = useState(false);
    const [reviewId, setReviewId] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        last_page: 0,
        per_page: 0,
    });
    const search = (currentPage) => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get(`/admin/reviews?page=${currentPage}`, {
            headers,
        })
            .then((res) => {
                const { data, current_page, total, last_page, per_page } = res;
                console.log(res);
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

    const onCloseModal = () => {
        search(pagination.current_page);
    };

    const handleShowModal = (id) => {
        setShow(true);
        setReviewId(id);
    };

    useEffect(() => {
        search(pagination.current_page);
    }, []);

    const baseURL = import.meta.env.VITE_BASE_URL;

    return (
        <>
            <div className="p-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-white uppercase bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    STT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Số sao
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Nội dung
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Trả lời
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ảnh
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tên sản phẩm
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
                                                <StarRatingDisplay
                                                    starCount={item.star}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.content}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.reply}
                                            </td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={`${baseURL}/storage/images/${item?.image}`}
                                                    className="h-20 w-20"
                                                    alt=""
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {
                                                    item.invoice_detail
                                                        .product_detail.product
                                                        .name
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        handleShowModal(item.id)
                                                    }
                                                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                                >
                                                    Trả lời
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
            <Reply
                isShow={isShow}
                setShow={setShow}
                reviewId={reviewId}
                onCloseModal={onCloseModal}
            />
        </>
    );
}
