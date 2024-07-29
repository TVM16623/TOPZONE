import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import { formatVND } from "../../../utils/Hepers";
import { STATUS, STATUS_TEXT } from "../../../constants";

export default function InvoiceDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        if (id) {
            Http.get(`/admin/invoices/${id}`, {
                headers,
            })
                .then((res) => {
                    setData(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [id]);

    const handleChangeConfirmStatus = () => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const payload = {
            id: id,
            status: STATUS.DA_XAC_NHAN,
        };
        Http.post(`/admin/invoices/status`, payload, {
            headers,
        })
            .then((res) => {
                setData(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleChangeStatusDelivery = () => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const payload = {
            id: id,
            status: STATUS.DANG_GIAO,
        };
        Http.post(`/admin/invoices/status`, payload, {
            headers,
        })
            .then((res) => {
                setData(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleChangeCancelStatus = () => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const payload = {
            id: id,
            status: STATUS.DA_HUY,
        };
        Http.post(`/admin/invoices/status`, payload, {
            headers,
        })
            .then((res) => {
                setData(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg px-10 py-10 max-w-4xl mx-auto mt-5">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-gray-700">
                        <div className="text-sm">Code #: {data?.code}</div>
                    </div>
                </div>
                <div className="border-b-2 border-gray-300 pb-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Hóa đơn:</h2>
                    <div className="text-gray-700 mb-2">{data?.name}</div>
                    <div className="text-gray-700 mb-2">
                        {data?.address +
                            ", " +
                            data?.sub_district?.name +
                            ", " +
                            data?.district?.name +
                            ", " +
                            data?.city?.name}
                    </div>
                    <div className="text-gray-700 mb-2">{data?.phone}</div>
                    <div className="text-gray-700 mb-2">{data?.user.email}</div>
                    <div className="text-gray-700">
                        {STATUS_TEXT(data?.status)}
                    </div>
                </div>
                <table className="w-full text-left mb-8">
                    <thead>
                        <tr>
                            <th className="text-gray-700 font-bold uppercase px-5 py-2">
                                Tên sản phẩm
                            </th>
                            <th className="text-gray-700 font-bold uppercase px-5 py-2">
                                Số lượng
                            </th>
                            <th className="text-gray-700 font-bold uppercase px-5 py-2">
                                Đơn giá
                            </th>
                            <th className="text-gray-700 font-bold uppercase px-5 py-2">
                                Thành tiền
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.invoice_details.map((item) => (
                            <tr key={item.id}>
                                <td className="py-4 px-5 text-gray-700">
                                    {item.product_detail.product.name}
                                </td>
                                <td className="py-4 px-5 text-gray-700">
                                    {item.quantity}
                                </td>
                                <td className="py-4 px-5 text-gray-700">
                                    {formatVND(item.product_detail.price)}đ
                                </td>
                                <td className="py-4 px-5 text-gray-700">
                                    {formatVND(item.price)}đ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end mb-8">
                    <div className="text-gray-700 mr-2">Tổng hóa đơn:</div>
                    <div className="text-gray-700 font-bold text-xl">
                        {formatVND(data?.total)}đ
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <Link to="/admin/order">
                            <button className="py-2.5 px-5 ms-3 text-sm me-3 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                Trở về
                            </button>
                        </Link>
                    </div>
                    <div className="flex justify-between items-center">
                        {data?.status === STATUS.DA_XAC_NHAN ? (
                            <>
                                <button
                                    onClick={() => handleChangeStatusDelivery()}
                                    className="focus:outline-none text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                                >
                                    Đơn hàng đang giao
                                </button>
                                <button
                                    onClick={() => handleChangeCancelStatus()}
                                    className="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                                >
                                    Hủy đơn hàng
                                </button>
                            </>
                        ) : data?.status === STATUS.DA_DAT ||
                          data?.status === STATUS.DA_THANH_TOAN ? (
                            <button
                                onClick={() => handleChangeConfirmStatus()}
                                className="focus:outline-none text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                            >
                                Xác nhận đơn hàng
                            </button>
                        ) : data?.status === STATUS.DANG_GIAO ? (
                            <button
                                onClick={() => handleChangeCancelStatus()}
                                className="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                            >
                                Hủy đơn hàng
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
