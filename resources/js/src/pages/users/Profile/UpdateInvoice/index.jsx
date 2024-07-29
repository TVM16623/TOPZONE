import { useEffect, useState } from "react";
import Http from "../../../../utils/http";
import token from "../../../../utils/token";
import toastify from "../../../../utils/toastify";

export default function UpdateInvoice({ invoice_id, show = false, setshow }) {
    const [datainvoice, setDataInvoice] = useState(null);
    const [listCity, setListCity] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);
    const [listSubDistrict, setListSubDistrict] = useState([]);
    const [currentCity, setCurrentCity] = useState(null);
    const [currentDistrict, setCurrentDistrict] = useState(null);
    const [currentSubDistrict, setCurrentSubDistrict] = useState(null);
    const [currentPayment, setCurrentPayment] = useState(null);
    const [currentPromotion, setCurrentPromotion] = useState(null);
    const [listPromotion, setListPromotion] = useState([]);
    const [currentName, setCurrentName] = useState("");
    const [currentNote, setCurrentNote] = useState("");
    const [currentAddress, setCurrentAddress] = useState("");

    useEffect(() => {
        if (show) {
            let accessToken = token.get("access_token");
            let headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            Http.get(`/invoice/invoice-id?invoice_id=${invoice_id}`, {
                headers,
            }).then((res) => {
                setDataInvoice(res);
                setCurrentCity(res.city);
                setCurrentDistrict(res.district);
                setCurrentSubDistrict(res.sub_district);
                setCurrentPayment(res.payment_id);
                setCurrentPromotion(res.promotion_id);
                setCurrentName(res.name);
                setCurrentNote(res.note);
                setCurrentAddress(res.address);
                console.log(res);
            });
        }
    }, [invoice_id, show]);

    useEffect(() => {
        if (show) {
            Http.get("/directory/cities").then((res) => {
                setListCity(res);
            });
            Http.get("/promotion").then((res) => {
                setListPromotion(res);
            });
        }
    }, [show]);

    useEffect(() => {
        if (show && currentCity != null) {
            Http.get(`/directory/districts/${currentCity}`).then((res) => {
                setListDistrict(res);
                console.log(res);
            });
        }
    }, [show, currentCity]);

    useEffect(() => {
        if (show && currentDistrict != null) {
            Http.get(`/directory/wards/${currentDistrict}`).then((res) => {
                setListSubDistrict(res);
                console.log(res);
            });
        }
    }, [show, currentDistrict]);

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        let data = {
            city: currentCity,
            district: currentDistrict,
            sub_district: currentSubDistrict,
            payment_id: currentPayment,
            promotion_id: currentPromotion,
            note: currentNote,
            name: currentName,
            address: currentAddress,
            phone: datainvoice.phone,
            invoice_id: datainvoice?.id,
        };
        const updatedata = await Http.post("/invoice/update-invoice", data, {
            headers,
        }).finally(() => {
            window.location.reload();
        });
        toastify.success(updatedata);
        setshow(false);
    };

    return (
        <>
            {show && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 w-full min-h-full bg-black bg-opacity-50 "
                    onClick={() => {
                        setshow(false);
                    }}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto max-h-screen overflow-y-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <h2 className="text-2xl mb-4">Cập nhật thông tin</h2>
                        <form onSubmit={handleSubmitUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Họ và tên
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={currentName}
                                    onChange={(e) => {
                                        setCurrentName(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Cập nhật số điện thoại"
                                    disabled
                                    value={datainvoice?.phone}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Địa chỉ
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={currentAddress}
                                    onChange={(e) => {
                                        setCurrentAddress(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Thành phố
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={currentCity?.id}
                                    onChange={(e) => {
                                        setCurrentCity(e.target.value);
                                    }}
                                >
                                    {listCity.map((itemcity, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={itemcity?.id}
                                            >
                                                {itemcity.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Quận, huyện
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={currentDistrict?.id}
                                    onChange={(e) => {
                                        setCurrentDistrict(e.target.value);
                                    }}
                                >
                                    {listDistrict.map((itemdistrict, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={itemdistrict?.id}
                                            >
                                                {itemdistrict?.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Phường, xã
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={currentSubDistrict?.id}
                                    onChange={(e) => {
                                        setCurrentSubDistrict(e.target.value);
                                    }}
                                >
                                    {listSubDistrict.map(
                                        (itemsubDistrict, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={itemsubDistrict?.id}
                                                >
                                                    {itemsubDistrict?.name}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Phương thức thanh toán
                                </label>
                                <div className="flex flex-row items-center mt-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={1}
                                        onChange={() => {
                                            setCurrentPayment(1);
                                        }}
                                        checked={currentPayment === 1}
                                    />
                                    <label className="ml-2">COD</label>
                                </div>
                                <div className="flex flex-row items-center mt-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={2}
                                        onChange={() => {
                                            setCurrentPayment(2);
                                        }}
                                        checked={currentPayment === 2}
                                    />
                                    <label className="ml-2">QR CODE</label>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Mã giảm giá
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={currentPromotion?.id}
                                    onChange={(e) => {
                                        setCurrentPromotion(e.target.value);
                                    }}
                                >
                                    <option value={null}>
                                        Không áp mã giảm giá
                                    </option>
                                    {listPromotion.map(
                                        (itempromotion, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={itempromotion?.id}
                                                >
                                                    {itempromotion?.key}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Ghi chú
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Cập nhật số điện thoại"
                                    value={currentNote}
                                    onChange={(e) => {
                                        setCurrentNote(e.target.value);
                                    }}
                                />
                            </div>
                            <div>
                                <button
                                    className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 mt-4 mb-5"
                                    type="submit"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
