import React from "react";
import Title from "../../../../components/all/Title";

const orders = [
    {
        id: 1,
        image: "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/Products/Images/42/305658/s16/iphone-15-pro-max-blue-1-2-650x650.png",
        name: "Iphone 15 promax",
    },
    {
        id: 2,
        image: "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/Products/Images/42/305658/s16/iphone-15-pro-max-blue-1-2-650x650.png",
        name: "Iphone 15 promax",
    },
    {
        id: 3,
        image: "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/Products/Images/42/305658/s16/iphone-15-pro-max-blue-1-2-650x650.png",
        name: "Iphone 15 promax",
    },
];

export default function Order() {
    return (
        <>
            <Title>TopZone - Lịch sử mua hàng </Title>
            <div className="min-h-full border border-solid border-gray-400 rounded-lg mb-5 bg-gray-50">
                <h1 className="text-gray-950 text-3xl font-normal mt-7 ml-9">
                </h1>
                <h2 className="text-gray-500 text-xl mt-5 ml-9">
                    Đơn hàng của bạn
                </h2>
                {orders.length > 0 ? (
                    <div className="overflow-x-auto mt-5 ml-9 mr-9">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Ảnh sản phẩm</th>
                                    <th className="py-2 px-4 border-b">Tên sản phẩm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="py-2 px-4 border-b">
                                            <img src={order.image} alt={order.name} className="w-20 h-20 object-cover" />
                                        </td>
                                        <td className="py-2 px-4 border-b">{order.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <h2 className="ml-9 mt-5">Bạn chưa có đơn hàng nào</h2>
                )}
                <div className="flex justify-end mt-5 mr-9">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
                        Cần hỗ trợ
                    </button>
                    <button className="bg-green-500 text-white py-2 px-4 rounded">
                        Mua lại
                    </button>
                </div>
            </div>
        </>
    );
}
