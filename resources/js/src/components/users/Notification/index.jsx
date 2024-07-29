import React, { useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export default function UserNotification({ isOpen, time, onTimeout, children }) {
    const id = useMemo(() => Math.floor(Math.random() * 999), []);

    useEffect(() => {
        const notify = document.querySelector(`#user_notify_${id}`);
        notify.classList[isOpen ? "add" : "remove"]("fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-md shadow-lg");

        if (isOpen === true) {
            const timeoutId = setTimeout(onTimeout, time, false);
            console.log(`TIMEOUT_ID`, timeoutId);
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen]);

    return createPortal(
        <>
            <div
                id={`user_notify_${id}`}
                className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-md shadow-lg"
            >
                {children}
            </div>
        </>
        , document.querySelector("#root"));
}

UserNotification.BoxProduct = function ({ productDetail }) {
    if (!productDetail?.product?.name)
        return null;

    return (
        <>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div className="mb-4">
                    <p className="font-bold text-gray-700 text-sm">Thêm sản phẩm vào giỏ hàng thành công!</p>
                </div>

                <hr />
                <div className="flex">
                    <div className="w-1/4">
                        <img src={productDetail?.product_detail_images[0].image} className="w-full h-auto" />
                    </div>

                    <div className="w-3/4 pl-4">
                        <p className="font-bold">{productDetail.product.name}</p>
                        <p>{productDetail.color.name} / {productDetail.size.name}</p>

                        <Link className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" to="/../cart">Xem Giỏ Hàng</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

UserNotification.Message = function ({ text }) {
    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col" style={{ border: '1px solid #ccc' }}>
            <div className="mb-4">
                <p className="font-bold text-gray-700 text-sm">Thông Báo!</p>
            </div>

            <hr />
            <div className="p-3">
                {text}
            </div>
        </div>
    )
}
