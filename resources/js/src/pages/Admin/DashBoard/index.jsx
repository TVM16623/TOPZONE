// import DashBoard from "./pages/admin/DashBoard";

import React, { useState } from "react";
import { formatVND } from "../../../utils/Hepers";
import NewestOrder from "./NewestOrder";
import ReportChart from "./ReportChart";
import token from "../../../utils/token";
import Http from "../../../utils/http";

export default function DashBoard() {
    const [data, setData] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // const sortedData = [...data].sort((a, b) =>
    //     a.name.localeCompare(b.name) // Sắp xếp theo tên
    // );

    React.useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get("/admin/statistic", { headers: headers })
            .then((res) => {
                console.log("statistic", res);
                setData(res);
            })
            .catch((err) => console.error("call api errors.", err));
    }, []);
    return (
        <>
            <div>
                <div className="p-4">
                    <div className="flex justify-between gap-4 ">
                        <div className="p-4 px-6 bg-white rounded-lg shadow-md flex gap-2 lg:w-[400px] md:w-[300px]">
                            <div className="flex-1">
                                <h3 className="text-xl mb-0 text-gray-500 poppins-medium">
                                    DOANH THU HÔM NAY
                                </h3>
                                <span className="text-[#344767] poppins-black text-xl">
                                    {formatVND(data.totalAmountToday)} đ
                                </span>
                            </div>
                            <div className="flex-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-8 text-green-500 h-full"
                                >
                                    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="p-4 px-6 bg-white rounded-lg shadow-md flex gap-2 lg:w-[400px] md:w-[300px]">
                            <div className="flex-1">
                                <h3 className="text-xl mb-0 text-gray-500 poppins-medium">
                                    ĐƠN HÀNG HÔM NAY
                                </h3>
                                <span className="text-[#344767] poppins-black text-xl">
                                    {data.totalOrdersToday}
                                </span>
                            </div>
                            <div className="flex-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-8 text-green-500 h-full"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
                                        clipRule="evenodd"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="p-4 px-6 bg-white rounded-lg shadow-md flex gap-2 lg:w-[400px] md:w-[300px]">
                            <div className="flex-1">
                                <h3 className="text-xl mb-0 text-gray-500 poppins-medium">
                                    KHÁCH HÀNG
                                </h3>
                                <span className="text-[#344767] poppins-black text-xl">
                                    {data?.totalUsers}
                                </span>
                            </div>
                            <div className="flex-2 ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="font-bold size-8 text-green-500 h-full"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                                        clipRule="evenodd"
                                    />
                                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ thống kê */}
                    <div className="mt-4"></div>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white shadow-md rounded-lg">
                            <h3 className="ms-2 text-3xl font-medium text-gray-600 uppercase text-center">
                                Biểu đồ doanh thu trong năm
                            </h3>
                            <ReportChart />
                        </div>

                        <div className="flex-1 bg-white shadow-md rounded-lg">
                            <div className="p-4">
                                <h3 className="ms-2 text-2xl font-medium text-gray-600 uppercase text-center">
                                    Đơn hàng gần đây
                                </h3>
                                {/* <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search..."
                                    className="border p-2"
                                /> */}
                                {data.invoices && data?.invoices.length > 0 && (
                                    <NewestOrder data={data.invoices} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
