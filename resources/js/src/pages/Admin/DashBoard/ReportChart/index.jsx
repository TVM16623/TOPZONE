import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import React, { useState } from "react";
import Http from "../../../../utils/http";
import token from "../../../../utils/token";

export default function ReportChart() {
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                data: [], // Sử dụng 'data' thay vì 'value.earnings'
                fill: false,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgba(255, 99, 132, 0.2)",
            },
        ],
    });

    const option = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Tháng",
                },
            },
            y: {
                beginAtZero: true,
                min: 0,
                max: 100000000,
                title: {
                    display: true,
                    text: "VNĐ",
                },
            },
        },
    };

    React.useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get("/admin/reports", { headers: headers })
            .then((res) => {
                console.log(res);
                // Xử lý dữ liệu nhận được từ API
                const processedData = processData(res.earnings); // Giả sử hàm này xử lý dữ liệu
                setData(processedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Giả sử hàm này xử lý dữ liệu nhận được từ API
    const processData = (rawData) => {
        // Thực hiện việc phân tích dữ liệu và chuyển đổi nó thành formate phù hợp
        // Đây chỉ là một ví dụ giả định, bạn cần tùy chỉnh nó dựa trên cấu trúc dữ liệu thực tế
        const labels = rawData.map((item) => item.month); // Giả sử mỗi item có trường 'month'
        const earnings = rawData.map((item) => item.revenue); // Giả sử mỗi item có trường 'earnings'
        console.log(earnings); //
        return {
            labels,
            datasets: [
                {
                    label: "Dữ liệu doanh thu",
                    data: earnings,
                    fill: false,
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgba(255, 99, 132, 0.2)",
                },
            ],
        };
    };

    return (
        <>
            <div className="max-h-fit">
                <Line
                    data={data}
                    options={option}
                    className="py-4 px-4 lg:w-[400px] h-[800px] static "
                />
            </div>
        </>
    );
}
