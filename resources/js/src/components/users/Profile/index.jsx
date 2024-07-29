import { Link, Outlet } from "react-router-dom";
import Title from "../../../components/all/Title";
import { useState } from "react";

export default function Profile() {
    const [selectItem, SetSelectItem] = useState(null);
    const items = [
        {
            name: "Thông tin tài khoản",
            icon: "thong-tin-tai-khoan.png",
            url: "user",
        },
        {
            name: "Lịch sử đơn hàng",
            icon: "lich-su-don-hang.png",
            url: "user/order-history",
        },
        {
            name: "Sổ địa chỉ",
            icon: "dia-chi.png",
            url: "user/list-address",
        },
        {
            name: "Đánh giá và phản hồi",
            icon: "review.png",
            url: "user/review-and-reply",
        },
    ];

    const handleClick = (item) => {
        SetSelectItem(item.url);
    };
    return (
        <>
            <div className="min-h-96 mt-10">
                <div className="grid grid-cols-12 w-full px-28 gap-4">
                    <div className="col-span-4 w-full">
                        {items?.map((item, i) => (
                            <Link
                                key={i}
                                to={item.url}
                                className={`
                                pl-3 h-[55px] flex items-center
                                border-sm rounded-lg w-full mb-2
                                bg-[#323232] text-white cursor-pointer
                                block hover:bg-[#000] ${
                                    selectItem == item.url ? "bg-[#000]" : ""
                                }`}
                                onClick={() => handleClick(item)}
                            >
                                <span className="pr-3">
                                    <img
                                        src={`/../assets/images/user-profile/${item.icon}`}
                                        alt={item.name}
                                        className="w-[29px] h-[29px]"
                                    />
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="col-span-7 w-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}