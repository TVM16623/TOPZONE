import { useEffect, useState } from "react";
import token from "../../../../utils/token";
import Http from "../../../../utils/http";
import Title from "../../../../components/all/Title";
import { Link, json, useLocation, useParams } from "react-router-dom";
import time from "../../../../utils/time";
import UpdateInvoice from "./../UpdateInvoice/index";
import { formatVND } from "../../../../utils/Hepers";
import ReviewProduct from "../../ReviewProduct";
import { STATUS } from "../../../../constants";
import { STATUS_TEXT } from "../../../../constants";

export default function Order() {
    const [order, setOrder] = useState({
        name: token?.getUser().name || "", // Fetch user name from token
        phone: token?.getUser().phone || "",
        address: "",
        paymentMethod: "",
        city: "",
        district: "",
        sub_district: "",
    });
    const [invoice, setInvoice] = useState([]);
    const [selectInvoice, setSelectInvoice] = useState([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [promotion, setPromotion] = useState([]);
    const [reload, setReload] = useState(0);
    const [dialogUpdateInvoice, setDialogUpdateInvoice] = useState(false);
    const [dialogReviewProduct, setDialogReviewProduct] = useState(false);
    const [id_invoice, setIdInvoice] = useState(null);

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get("/user/address", { headers })
            .then((res) => {
                console.log(res);
                setOrder(res.data);
            })
            .catch((err) => {
                setOrder(null);
            });
    }, []);

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get("/invoice/invoice-load", { headers }).then((res) => {
            setInvoice(res);
        });
    }, [reload]);
    // lấy dữ liệu thanh toán
    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        Http.get("/payment", { headers })
            .then((res) => {
                setPaymentMethods(res);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        Http.get("/promotion", { headers })
            .then((res) => {
                setPromotion(res);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleDialogOpen = (id) => {
        const invoiceFilter = invoice.find((i) => {
            return id == i.id;
        });
        setSelectInvoice(invoiceFilter);
        setDialogOpen(true);
    };
    const handleDeleteInvoice = (e) => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        Http.post(
            "/invoice/invoice-cancel",
            { invoice_id: e.target.attributes.invoice_id.value },
            { headers }
        )
            .then((res) => {
                setReload((prev) => {
                    return prev + 1;
                });
                setSelectInvoice([]);
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const handleDialogUpdateInvoice = (e) => {
        console.log(e.target.attributes.invoice_id.value);
        const id_invoice = e.target.attributes.invoice_id.value;
        setIdInvoice(id_invoice);
        setDialogUpdateInvoice(true);
    };
    const handleReviewProduct = (e) => {
        const review_id = e.target.attributes.review_id.value;
        console.log("review_id", review_id);
        setIdInvoice(review_id);
        setDialogReviewProduct(true);
    };

    const handleChangeStatusHasReceived = (id) => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const payload = {
            id: id,
            status: STATUS.DA_GIAO,
        };
        Http.post(`/admin/invoices/status`, payload, {
            headers,
        })
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    console.log("aa", isDialogOpen);

    return (
        <>
            <Title>TopZone - Lịch sử mua hàng</Title>
            <div className="min-h-full border border-solid border-gray-400 rounded-lg mb-5 bg-gray-50">
                <h1 className="text-gray-950 text-3xl font-normal mt-7 ml-9">
                    Lịch sử mua hàng
                </h1>
                <h2 className="text-gray-950 text-xl font-bold mt-4 ml-9 text-center">
                    Danh sách đơn hàng đã đặt
                </h2>
                {isDialogOpen && (
                    <div
                        onClick={() => {
                            setDialogOpen(false);
                        }}
                    >
                        {selectInvoice ? (
                            <div>
                                <div className="flex mt-3 text-xl ml-9">
                                    <h2 className="text-gray-950 font-bold text-xl">
                                        Thông tin đơn hàng#
                                    </h2>
                                    <span className="font-bold text-gray-950 text-base">
                                        {selectInvoice?.code}
                                    </span>
                                    <span className="font-bold text-blue-600 text-base ml-2 rounded-lg border-2 border-blue-600">
                                        {STATUS_TEXT(selectInvoice?.status)}
                                    </span>
                                </div>

                                <div className="flex mt-3 text-xl ml-9">
                                    <h2 className="text-gray-950 text-base">
                                        Ngày đặt hàng:
                                    </h2>
                                    <span className="font-bold text-gray-800 text-base ml-2">
                                        {time.format(selectInvoice?.created_at)}
                                    </span>
                                </div>
                                <div className="flex mt-3 text-xl ml-9">
                                    <h2 className="text-gray-950 text-base">
                                        Tên người nhận:
                                    </h2>
                                    <span className="font-bold text-gray-800 text-base ml-2">
                                        {selectInvoice?.name}
                                    </span>
                                </div>
                                <div className="flex mt-3 text-xl ml-9">
                                    <h2 className="text-gray-950 text-base">
                                        Số điện thoại:
                                    </h2>
                                    <span className="font-bold text-gray-800 text-base ml-2">
                                        {selectInvoice?.phone}
                                    </span>
                                </div>
                                <div className="flex mt-3 text-xl ml-9">
                                    <h2 className="text-gray-950 text-base">
                                        Phương thức thanh toán:
                                    </h2>
                                    <span className="font-bold text-gray-800 text-base ml-2">
                                        {paymentMethods.map((a) =>
                                            a.id === selectInvoice.payment_id
                                                ? a.name
                                                : null
                                        )}
                                    </span>
                                </div>
                                <div className="flex mt-3 text-xl ml-9">
                                    <h2 className="text-gray-950 text-base">
                                        Địa chỉ giao hàng:
                                    </h2>
                                    <span className="font-bold text-gray-800 text-base ml-2">
                                        {selectInvoice?.address +
                                            ", " +
                                            (selectInvoice?.sub_district
                                                ?.name || " ") +
                                            "," +
                                            (selectInvoice?.district?.name ||
                                                "") +
                                            ", " +
                                            selectInvoice?.city?.name}
                                    </span>
                                </div>
                                <div className="flex mt-3 text-xl ml-9">
                                    <h2 className="text-gray-950 text-base">
                                        Mã giảm giá:
                                    </h2>
                                    <span className="font-bold text-gray-800 text-base ml-2">
                                        {selectInvoice?.promotion?.key ||
                                            "Không có mã giảm giá"}
                                    </span>
                                </div>
                                <div className="flex mt-3 text-xl ml-9">
                                    <h2 className="text-gray-950 text-base">
                                        Tổng tiền:
                                    </h2>
                                    <span className="font-bold text-gray-800 text-base ml-2">
                                        {formatVND(selectInvoice?.total)}
                                    </span>
                                </div>
                                <div className="flex mt-3 text-xl ml-9">
                                    <h2 className="text-gray-950 text-base">
                                        Tình trạng đơn hàng :
                                    </h2>
                                    <span className="font-bold text-gray-800 text-base ml-2">
                                        {STATUS_TEXT(selectInvoice?.status)}
                                    </span>
                                </div>
                                <div className="flex mt-3 justify-start">
                                    {selectInvoice?.status ==
                                        STATUS.DA_GIAO && (
                                        <button className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 ml-8 ">
                                            <Link to={"/cart"}>Mua lại</Link>
                                        </button>
                                    )}
                                    {selectInvoice?.status == STATUS.DA_DAT && (
                                        <>
                                            <button
                                                className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 ml-5"
                                                invoice_id={selectInvoice?.id}
                                                onClick={handleDeleteInvoice}
                                            >
                                                Hủy đơn
                                            </button>
                                            <button
                                                className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 ml-5"
                                                invoice_id={selectInvoice?.id}
                                                onClick={
                                                    handleDialogUpdateInvoice
                                                }
                                            >
                                                Cập nhật thông tin mua hàng
                                            </button>
                                        </>
                                    )}
                                    {selectInvoice?.status ==
                                        STATUS.DANG_GIAO && (
                                        <>
                                            <button
                                                className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 ml-5"
                                                onClick={() =>
                                                    handleChangeStatusHasReceived(
                                                        selectInvoice?.id
                                                    )
                                                }
                                            >
                                                Đã nhận hàng
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="overflow-x-auto mt-5 ml-9 mr-9">
                                    <table className="min-w-full bg-white border border-gray-300 text-left">
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
                                            {selectInvoice?.invoice_details?.map(
                                                (invoiceitem, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="py-2 px-4 border-b">
                                                                <img
                                                                    src={
                                                                        invoiceitem
                                                                            ?.product_detail
                                                                            ?.product
                                                                            ?.images?.[0]
                                                                            ?.image
                                                                    }
                                                                    className="w-20 h-20 object-cover"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-4 border-b font-bold">
                                                                {
                                                                    invoiceitem
                                                                        ?.product_detail
                                                                        ?.product
                                                                        ?.name
                                                                }
                                                            </td>
                                                            <td className="py-2 px-4 border-b font-bold">
                                                                {
                                                                    invoiceitem?.quantity
                                                                }
                                                            </td>
                                                            <td className="py-2 px-4 border-b font-bold">
                                                                {formatVND(
                                                                    selectInvoice.total
                                                                )}
                                                            </td>
                                                            <td className="py-2 px-4 border-b">
                                                                {selectInvoice.status ==
                                                                    STATUS.DA_GIAO && (
                                                                    <button
                                                                        className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 ml-8"
                                                                        onClick={
                                                                            handleReviewProduct
                                                                        }
                                                                        review_id={
                                                                            invoiceitem.id
                                                                        }
                                                                    >
                                                                        Đánh giá
                                                                        đơn hàng
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p>No invoices found.</p>
                        )}
                    </div>
                )}
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
                                {invoice?.map((invoiceitem, index) => {
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
                                                            invoiceitem.id
                                                        )
                                                    }
                                                >
                                                    Chi tiết hóa đơn
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
            <UpdateInvoice
                invoice_id={id_invoice}
                show={dialogUpdateInvoice}
                setshow={setDialogUpdateInvoice}
            />
            <ReviewProduct
                review_id={id_invoice}
                show={dialogReviewProduct}
                setshow={setDialogReviewProduct}
            />
        </>
    );
}
