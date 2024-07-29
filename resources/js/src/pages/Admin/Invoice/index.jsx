import React, { useEffect, useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import Pagination from "../../../components/admin/Pagination";
import { Link } from "react-router-dom";
import { displaySTT, formatVND } from "../../../utils/Hepers";
import { STATUS_TEXT } from "../../../constants";

export default function Invoices() {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState("");
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        last_page: 0,
        per_page: 0,
    });

    const search = (currentPage, status) => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get(`/admin/invoices?page=${currentPage}&status=${status}`, {
            headers,
        })
            .then((res) => {
                const { data, current_page, total, last_page, per_page } = res;
                console.log(data);
                setData(data);
                setPagination({ current_page, total, last_page, per_page });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleChangePage = (page) => {
        search(page, status);
    };

    useEffect(() => {
        search(pagination.current_page, status);
    }, []);

    return (
        <>
            <div className="p-4">
                <div className="mb-5 flex items-center gap-4">
                    <select
                        class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[300px] p-2.5"
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="" selected>
                            --- Tình trạng đơn hàng ---
                        </option>
                        <option value="DA_DAT">Đã đặt</option>
                        <option value="DA_XAC_NHAN">Đã xác nhận</option>
                        <option value="DA_THANH_TOAN">Đã thanh toán</option>
                        <option value="DANG_GIAO">Đang giao</option>
                        <option value="DA_HUY">Đã hủy</option>
                        <option value="DA_GIAO">Đã giao thành công</option>
                    </select>
                    <button
                        type="button"
                        onClick={() => search(pagination.current_page, status)}
                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                    >
                        Tìm kiếm
                    </button>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-white uppercase bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    STT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mã đơn hàng
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tên khách hàng
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Số điện thoại
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Địa chỉ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tổng tiền
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Phương thức thanh toán
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ghi chú
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Trạng thái
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
                                            {item.code}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.address +
                                                ", " +
                                                item?.sub_district?.name ||
                                                "N/A" +
                                                    ", " +
                                                    item?.district?.name ||
                                                "N/A" +
                                                    ", " +
                                                    item?.city?.name ||
                                                "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatVND(item.total)}đ
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.payment.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.note}
                                        </td>
                                        <td className="px-6 py-4">
                                            {STATUS_TEXT(item.status)}
                                        </td>
                                        <td className="px-6 py-4 flex flex-col gap-y-2">
                                            <Link
                                                to={`/admin/order/detail/${item.id}`}
                                            >
                                                <button className='className="focus:outline-none text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-9"'>
                                                    Xem
                                                </button>
                                            </Link>
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
        </>
    );
}
