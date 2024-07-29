import React from "react";
import Title from "../../../components/all/Title";
import { useParams } from "react-router-dom";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import { formatVND } from "../../../utils/Hepers";


export function Payment() {
    const [paymentCode, setPaymentCode] = React.useState("pending");
    const params = useParams();
    const [payment, setPayment] = React.useState({
        invoice: {
            code: "",
            total: 0
        },
        payment: {
            name: "",
            bankName: "",
            accountNumber: ""
        },
        sentData: false
    });

    React.useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.post(`/invoice/invoice-bank-pending?code=${params.id}`, { headers: headers })
            .then(({ data }) => {
                setPayment(data);
            })
            .catch(() => {
                console.log(`err`)
            })
            .finally(() => {
                setPayment(payment => ({ ...payment, sentData: true }));
            });
        window.scrollTo(0, 0);
    }, []);

    React.useEffect(() => {
        if (payment.invoice?.code) {
            const roomId = `invoice.${payment.invoice.code}`;
            console.log(`invoice start`);
            window.Echo.private(roomId)
                .listen('PaymentEvent', (event) => {
                    // console.clear();
                    setPaymentCode(event.payment.status);
                    console.log(event);
                    // if(event.payment.status === "success") {
                    //     redirectId = setInterval(() => {
                    //         navigate("/../account/orders");
                    //     }, 3000);
                    // }
                })

            return () => {
                window.Echo.leaveChannel(roomId);
            }
        }
    }, [payment.invoice])

    if (!payment.sentData)
        return (<div className="container min-h-96">
            <p className="text-base text-white text-center">Đang tìm hóa đơn...</p>
        </div>);
    if (payment.sentData && payment.invoice.code === "")
        return (<div className="py-4 container min-h-96 text-center">
            <p className="text-base text-white">Không tìm thấy hóa đơn cần thanh toán...</p>
        </div>);

    return (<>
        <Title>TopZone - Thanh toán</Title>
        <div className="min-h-96 w-full">
            <div className="grid justify-items-center bg-white">
                <span className="text-emerald-500 text-xl font-bold py-2">Sử dụng momo, zalopay, ngân hàng để quét mã thanh toán.</span>

                <img
                    className="m-0 p-0 w-[400px]"
                    src={`https://img.vietqr.io/image/MB-${payment.payment.accountNumber}-compact.jpg?amount=${payment.invoice.total}&addInfo=TOPZONE%20${payment.invoice.code}%20l&accountName=Pham%20Gia%20Kien`}
                    alt="Quét mã QR để thanh toán"
                />
                <table className="w-100 mt-2">
                    <tbody>
                        <tr>
                            <td className="py-4">
                                <p className="mr-2 text-base font-bold text-red-500">Chủ TK:</p>
                                <p className="mr-2 text-base font-bold text-red-500">Nội Dung: </p>
                                <p className="mr-2 text-base font-bold text-red-500">Tổng Tiền:</p>
                            </td>
                            <td className="py-4">
                                <p className=" text-base font-bold text-sky-900">{payment.payment.name}</p>
                                <p className=" text-base font-bold text-sky-900">TOPZONE {payment.invoice.code}</p>
                                <p className=" text-base font-bold text-sky-900">{formatVND(payment.invoice.total)} đ</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}
