import React, { useEffect, useState } from "react";
import styles from "../cart.module.scss";
import Http from "../../../../utils/http";
import { formatVND, isEmptyOrWhitespace } from "../../../../utils/Hepers";

export default function InvoiceDetailCart({ totalPrice, setDataSubmit, products }) {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState({ value: null, status: null, discount: null, quantity: null });
    const [isLoading, setIsLoading] = useState(false);
    const [priceSale, setPriceSale] = useState();
    const [priceStart, setPriceStart] = useState();
    useEffect(() => {
        setDataSubmit((vl) => ({
            ...vl,
            address: {
                ...vl.address,
                code: code
            }
        }));
    }, [code]);

    useEffect(() => {
        let price = 0;
        let pr = 0;
        products?.map((p) => {
            if (p.price_discount !== 0) setPriceSale(price + p.price - p.price_discount);
        });

        products?.map((p) => {
            pr = pr + p.price
            setPriceStart(pr);
        });
    }, [products]);

    useEffect(() => {
        console.log(priceSale, products);
    }, [priceSale]);

    const handleSubmit = (event) => {
        event.preventDefault();
        let _code = document.getElementsByName('code')[0].value;
        if (isEmptyOrWhitespace(_code)) {
            setMessage({ ...message, value: "Bạn chưa nhập mã!", status: "error", discount: null });
            return;
        }

        try {
            setIsLoading(true);
            Http.post('/promotion/check', { code: _code, price: totalPrice })
                .then(res => {
                    if (res.status === 'error') {
                        setMessage({ value: res.message, status: "error", discount: null, quantity: null });
                    } else {
                        setMessage({ ...message, value: res.message, status: "success", discount: res.data.discount, quantity: res.data.quantity });
                    }
                    console.log(message);
                })
                .finally(() => setIsLoading(false));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className={`${styles.body} pb-2 `}>
                <form onSubmit={handleSubmit} className={`w-[50%] m-auto bg-[#fff] shadow px-8 pt-3 pb-4`}>
                    <div className="flex gap-4 text-justify">
                        <h4 className="font-bold text-xl mb-2 mt-2" >Hóa đơn tạm tính</h4>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="bg-[#fff] focus:border-black uppercase rounded-md
                                block w-1/2 text-gray-700 text-base border py-1 px-4"
                            placeholder="#CODE"
                            name="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                            className={`bg-sky-600 text-white
                                block border
                                rounded py-1 px-4
                                text-base focus:border-black hover:bg-sky-800
                                `}
                            type="submit" {...isLoading ? { disabled: true } : { disabled: false }}>
                            Kiểm tra
                        </button>
                    </div>
                    <span
                        className={`text-base font-medium
                        ${message.status === 'error' ? "text-red-500" : "text-green-700"}`}
                    >
                        {(message.discount !== null && message.discount !== undefined) ?
                            (<>{`Giảm: - ${formatVND(message.discount)}đ - Còn lại: ${message.quantity} mã.
                            `} <span className="border rounded bg-green-800 text-white px-2 py-1">Đã áp dụng</span></>) :
                            `${message.value !== null ? message.value : ''}`}
                    </span>
                    <div className="flex gap-4">
                        <div className="w-1/2 text-base">Tạm tính:</div>
                        <p className="w-1/2 text-base">{formatVND(priceStart)}đ</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2 text-base">Giảm giá sản phẩm:</div>
                        <p className="w-1/2 text-base">- {priceSale !== 0 ? formatVND(priceSale) : '0'}đ</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2 text-base">Áp mã giảm:</div>
                        <p className="w-1/2 text-base">- {message.discount !== null ? formatVND(message.discount) : '0'}đ</p>
                    </div>
                    <div className="border w-full my-2"></div>
                    <div className="flex gap-4">
                        <div className="w-1/2 text-xl font-bold">Tổng tiền</div>
                        <p className="w-1/2 text-xl font-bold">{formatVND(totalPrice - (message.discount ? message.discount : 0))}đ</p>
                    </div>
                </form>
            </div>
        </>
    );
}

