import Title from "../../../../components/all/Title";

export default function Review() {
    return (
        <>
            <Title>TopZone - Đánh giá và phản hồi</Title>

            <div className="min-h-full border border-solid border-gray-400 rounded-lg mb-5 bg-gray-50">
                <h1 className="text-gray-950 text-3xl font-style:nomal mt-7 ml-9">
                    Đánh giá và phản hồi
                </h1>
                <h2 className="text-gray-500 text-xl mt-5 ml-9">
                    Đơn hàng của bạn
                </h2>
                <h2 className="ml-40 mt-5">Bạn chưa có đánh giá nào</h2>
            </div>
        </>
    );
}
