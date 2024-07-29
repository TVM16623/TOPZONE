import React, { useEffect, useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import Pagination from "../../../components/admin/Pagination";
import { Link } from "react-router-dom";
import { displaySTT, formatVND } from "../../../utils/Hepers";
import ConfirmDelete from "../../../components/admin/Modal/ConfirmDelete";
import toastify from "../../../utils/toastify";

export default function Promotions() {
    const [data, setData] = useState(null);
    const [isShow, setShow] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
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
        Http.get(`/admin/promotions?page=${currentPage}`, {
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

        Http.post(`/admin/promotions/delete`, payload, { headers })
            .then((res) => {
                if (res.status === 200) {
                    setData(data.filter((item) => item.id !== deleteId));
                    toastify.success(res.message);
                    setDeleteId(null);
                }
            })
            .catch((err) => {
                console.error(err);
                toastify.error("Đã xảy ra lỗi");
            });
    };

    useEffect(() => {
        search(pagination.current_page);
    }, []);

    return (
        <>
            <div className="p-4">
                <div className="text-end mb-5">
                    <Link
                        to={"/admin/promotion/create"}
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
                                    Mã phiếu
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Giảm giá
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Số lượng
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Giá trị tối thiểu
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Thời gian bắt đầu
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Thời gian kết thúc
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
                                data?.map((item, index) => (
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
                                            {item.key}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatVND(item.discount)}đ
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatVND(item.minimum)}đ
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.start_date}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.end_date}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                to={`/admin/promotion/edit/${item.id}`}
                                            >
                                                <button className='className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"'>
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
                                ))}
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
        </>
    );
}
