import { useEffect, useState } from "react";
import Title from "../../../../components/all/Title";
import Http from "../../../../utils/http";
import token from "../../../../utils/token";
import { formatVND } from "../../../../utils/Hepers";
import toastify from "../../../../utils/toastify";
import UpdateReview from "../UpdateReview";
import StarRatingDisplay from "../../../../components/users/Star";

export default function Review() {
    const [dataReview, setDataReview] = useState([]);
    const [review, setReview] = useState("");
    const [invoiceId, setInvoiceId] = useState([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [reviewId, setReviewId] = useState(null);
    const [isShowModal, setShowModal] = useState(false);

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get("/invoice/invoice-load", { headers }).then((res) => {
            setInvoiceId(res);
            console.log(res);
        });
    }, []);

    const handleDialogOpen = (id) => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get("/review/invoice/" + id, { headers }).then((res) => {
            setDataReview(res);
        });

        setDialogOpen(true);
    };

    const handleDeleteReview = (reviewId) => {
        console.log("id", reviewId);
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const shouldDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa đánh giá này?"
        );
        if (shouldDelete) {
            Http.post(`/review/delete`, { reviewId: reviewId }, { headers })
                .then((res) => {
                    setDataReview(
                        dataReview.filter((item) => item.id !== reviewId)
                    );
                    toastify.success(res.message);
                })
                .catch((err) => {
                    toastify.error("Đã xảy ra lỗi");
                });
        }
    };

    const handleUpdateReview = (id) => {
        const id_review = id;
        setReviewId(id_review);
        setShowModal(true);
    };

    const baseURL = import.meta.env.VITE_BASE_URL;
    return (
        <>
            <Title>TopZone - Đánh giá và phản hồi</Title>

            <div className="min-h-full border border-solid border-gray-400 rounded-lg mb-5 bg-gray-50">
                <h1 className="text-gray-950 text-3xl font-style:nomal mt-7 ml-9">
                    Đánh giá và phản hồi
                </h1>
                <h2 className="text-gray-950 text-xl font-bold mt-4 ml-9 text-center">
                    Danh sách sản phẩm và đánh giá của bạn
                </h2>
                <div>
                    {isDialogOpen && (
                        <div
                            onClick={() => {
                                setDialogOpen(false);
                            }}
                        >
                            <div className="overflow-x-auto mt-5 ml-9 mr-9">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b">
                                                Số sao
                                            </th>
                                            <th className="py-2 px-4 border-b">
                                                Nội dung đánh giá
                                            </th>
                                            <th className="py-2 px-4 border-b">
                                                Trạng thái
                                            </th>
                                            <th className="py-2 px-4 border-b">
                                                Ảnh đánh giá
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataReview?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4 border-b ">
                                                    <StarRatingDisplay
                                                        starCount={item?.star}
                                                    />
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {item?.content}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {item.reply === null ? (
                                                        <span className="text-red-500">
                                                            Chưa phản hồi
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-500">
                                                            Đã phản hồi
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    <img
                                                        src={`${baseURL}/storage/images/${item?.image}`}
                                                        className="h-20 w-20"
                                                        alt=""
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="text-blue-500 text-sm py-3 px-5 rounded-full hover:bg-slate-900 ml-4 mt-2"
                                                        onClick={() =>
                                                            handleDeleteReview(
                                                                item?.id
                                                            )
                                                        }
                                                    >
                                                        Xóa
                                                    </button>

                                                    <button
                                                        className="text-blue-500 text-sm py-3 px-5 rounded-full hover:bg-slate-900 mb-2"
                                                        onClick={() =>
                                                            handleUpdateReview(
                                                                item?.id
                                                            )
                                                        }
                                                    >
                                                        Cập nhật
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {!isDialogOpen && (
                    <div className="overflow-x-auto mt-5 ml-9 mr-9">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">
                                        Ảnh sản phẩm
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Tên sản phẩm
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Số lượng
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Tổng tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceId?.map((invoiceitem, index) => {
                                    const url =
                                        invoiceitem?.invoice_details?.[0]
                                            ?.product_detail?.product
                                            ?.images?.[0]?.image;
                                    const name =
                                        invoiceitem?.invoice_details?.[0]
                                            ?.product_detail?.product?.name;
                                    const quantity =
                                        invoiceitem?.invoice_details?.[0]
                                            ?.quantity;
                                    const total = invoiceitem?.total;
                                    return (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b">
                                                <img
                                                    src={url}
                                                    className="w-20 h-20 object-cover"
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b font-bold">
                                                {name}
                                            </td>
                                            <td className="py-2 px-4 border-b font-bold">
                                                {quantity}
                                            </td>
                                            <td className="py-2 px-4 border-b font-bold">
                                                {formatVND(total)}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <button
                                                    className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 ml-8"
                                                    onClick={() =>
                                                        handleDialogOpen(
                                                            invoiceitem
                                                                ?.invoice_details?.[0]
                                                                .id
                                                        )
                                                    }
                                                >
                                                    Chi tiết đánh giá
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <UpdateReview
                isShow={isShowModal}
                setShow={setShowModal}
                reviewId={reviewId}
            />
        </>
    );
}
