import { useEffect, useState } from "react";
import token from "../../../../utils/token";
import Http from "../../../../utils/http";

export default function AddressModal({ onClick }) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(); //address được chọn
    const [address, setAddress] = useState([]);

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        let accessToken = token.get("access_token");
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        Http.get("/user/address", { headers }).then((res) => {
            console.log(res);
            setAddress(res.data);
        });
    }, []);

    const handle = (a) => {
        setActive(a);
        setOpen(!true);
    };

    return (
        <>
            <div
                className="p-2 flex gap-2
            text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => handleClick()}
            >
                <img
                    className="w-[16px] mb-1"
                    src="/../assets/images/address_book_icon.svg"
                />
                Chọn từ sổ địa chỉ
            </div>

            {/* lớp phủ */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-70 z-10 ${
                    open ? "" : "hidden"
                }`}
            ></div>

            {/* modal */}
            <div
                className={`modal fixed top-1/2 min-w-[40rem]
            left-1/2 transform -translate-x-1/2
            -translate-y-1/2 p-10 rounded-lg
            z-[10] bg-[#fff] ${open ? "" : "hidden"}`}
            >
                <div className="container">
                    <div className="header mb-4">
                        <h2 className="text-2xl text-center font-black font-sans">
                            Sổ địa chỉ
                        </h2>
                    </div>

                    {/* address content */}
                    {address?.length === 0 ? <p>Trống</p> : ""}
                    {address?.map((a, i) => (
                        <div
                            key={i}
                            className={`
                        body mb-4 py-2 rounded-lg px-6 hover:border-black
                        hover:border-double cursor-pointer
                        ${
                            active?.id === a.id
                                ? "border border-black"
                                : "border"
                        }
                        `}
                            onClick={() => {
                                onClick(a), handle(a);
                            }}
                        >
                            <p className="text-base">
                                {`${a.city.name}, ${a.district.name}, ${a.sub_district.name}, ${a.name}`}
                            </p>
                            <p className="text-base">
                                {`${a.name}, ${a.phone}`}
                            </p>
                        </div>
                    ))}

                    <div className="">
                        <p
                            className="text-base font-medium text-black bg-gray-200 w-full text-center cursor-pointer hover:bg-black hover:text-white rounded py-2"
                            onClick={() => handleClick()}
                        >
                            Đóng
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
