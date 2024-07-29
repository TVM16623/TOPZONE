import React, { useEffect, useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import Pagination from "../../../components/admin/Pagination";
import { Link } from "react-router-dom";
import { displaySTT } from "../../../utils/Hepers";
import ConfirmDelete from "../../../components/admin/Modal/ConfirmDelete";
import toastify from "../../../utils/toastify";

export default function Color() {
    const [data, setData] = useState(null);
    const [keywords, setKeywords] = useState("");
    const [isShow, setShow] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        last_page: 0,
        per_page: 0,
    });

    const search = (currentPage, keywords) => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get(`/admin/colors?page=${currentPage}&keywords=${keywords}`, {
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
        search(page, keywords);
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

        Http.post(`/admin/colors/delete`, payload, { headers })
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
        search(pagination.current_page, keywords);
    }, []);

    return (
        <>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="pb-4 flex gap-3">
                        <label htmlFor="table-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="table-search"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                                placeholder="Nhập tên tên màu..."
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                search(pagination.current_page, keywords)
                            }
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                        >
                            Tìm kiếm
                        </button>
                    </div>

                    <Link
                        to={"/admin/color/create"}
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
                                    Tên màu
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mã màu
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Màu
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
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.value}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className="w-10 h-10 rounded-full"
                                                style={{
                                                    backgroundColor: item.value,
                                                }}
                                            ></div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                to={`/admin/color/edit/${item.id}`}
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
