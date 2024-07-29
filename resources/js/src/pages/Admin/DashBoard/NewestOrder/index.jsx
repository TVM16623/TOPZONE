import React from "react";
import { Link } from "react-router-dom";
import { displaySTT, formatVND } from "../../../../utils/Hepers";

const NewestOrder = ({ data }) => {
    return (
        <div className="bg-white">
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
                                Tổng tiền
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data &&
                            data?.map((item, index) => (
                                <tr className="bg-white border-b" key={item.id}>
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">{item.code}</td>
                                    <td className="px-6 py-4">{item.name}</td>
                                    <td className="px-6 py-4">
                                        {formatVND(item.total)}đ
                                    </td>
                                    <td className="px-6 py-4">{item.status}</td>
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
        </div>
    );
};

export default NewestOrder;
