import { useState, useRef, useEffect } from "react";
import Title from "../../../../components/all/Title";
import Http from "../../../../utils/http"; // Assuming this is your HTTP utility
import token from "../../../../utils/token"; // Assuming this is your token utility
import toastify from "../../../../utils/toastify";
import { useNavigate } from "react-router-dom";

export default function Address() {
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showDialogUD, setShowDialogUD] = useState({ value: false, id: 0 });
    const [address, setAddress] = useState({
        city: "",
        district: "",
        sub_district: "",
        address: "",
        name: token?.getUser().name || "", // Fetch user name from token
        phone: token?.getUser().phone || "", // Fetch user phone from token
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [listCity, setListCity] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);
    const [listSubDistrict, setListSubDistrict] = useState([]);
    const [listAddress, setListAddress] = useState();
    const [callApiGetAddress, setCallApiGetAddress] = useState(0);
    const selectRefs = useRef({
        selectCity: null,
        selectDistrict: null,
        selectSubDistrict: null,
    });

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        if (callApiGetAddress >= 0)
            Http.get("/user/address", { headers }).then((res) => {
                console.log(res);
                setListAddress(res.data);
            });
    }, [callApiGetAddress]);
    console.log(callApiGetAddress);

    useEffect(() => {
        if (!token.getUser().name) return navigate("/auth/login");
        Http.get("/directory/cities").then((res) => {
            const cities = res.sort((a, b) => a.name.localeCompare(b.name));
            setListCity(cities);
            console.log(cities);
        });
    }, []);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const checkData = dataSubmitIsValid({
            cityId: selectRefs.current.selectCity.value,
            districtId: selectRefs.current.selectDistrict.value,
            subDistrictId: selectRefs.current.selectSubDistrict.value,
        });

        if (!checkData) return toastify.error("Hãy điền đầy đủ thông tin.");
        Http.post("/user/address/create", address, { headers })
            .then((res) => {
                if (res.status !== "success") {
                    return toastify.error(res.message);
                }
                setIsDialogOpen(false);
                setIsAdd(true);
            })
            .finally(() => {
                window.location.reload();
            });
    };

    const dataSubmitIsValid = ({ cityId, districtId, subDistrictId }) => {
        console.log(cityId, districtId, subDistrictId);
        if (cityId == 0 || districtId == 0 || subDistrictId == 0) return false;
        return true;
    };
    // Khi thêm địa chỉ mới THÀNH CÔNG thì setListAddress cảu user lại

    const handleOnChangeCity = async (id_city) => {
        // Update city in address and fetch districts based on selected city
        setAddress((prevState) => ({
            ...prevState,
            city: id_city,
            district: "",
            sub_district: "",
        }));

        try {
            const response = await Http.get(`/directory/districts/${id_city}`);
            const districts = response.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setListDistrict(districts);
            setListSubDistrict([]); // Clear sub-districts
        } catch (error) {
            console.error("Failed to fetch districts:", error);
        }
    };

    const handleOnChangeDistrict = async (id_district) => {
        // Update district in address and fetch sub-districts based on selected district
        setAddress((prevState) => ({
            ...prevState,
            district: id_district,
            sub_district: "",
        }));

        try {
            const response = await Http.get(`/directory/wards/${id_district}`);
            const subDistricts = response.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setListSubDistrict(subDistricts);
        } catch (error) {
            console.error("Failed to fetch sub-districts:", error);
        }
    };

    const handleDelete = () => {
        setShowConfirmation(true);
    };

    const confirmDelete = (addressId) => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.post("/user/address/delete", { addressId: addressId }, { headers })
            .then((res) => {
                if (res.status === "success") {
                    setCallApiGetAddress(true);
                    return toastify.success(res.message);
                }
                return toastify.error(res.message);
            })
            .finally(() => {
                window.location.reload;
            });

        setShowConfirmation(false);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };
    return (
        <>
            <Title>TopZone - Sổ địa chỉ</Title>
            <div className="min-h-full border border-solid border-gray-400 rounded-lg mb-5 bg-gray-50 px-8 shadow-xl">
                <div className="pt-7 justify-between flex content-center">
                    <div>
                        <h1 className="text-gray-950 text-2xl font-bold">
                            Địa chỉ của tôi
                        </h1>
                    </div>
                    <div>
                        <button
                            className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900"
                            onClick={handleDialogOpen}
                        >
                            THÊM ĐỊA CHỈ MỚI
                        </button>
                    </div>
                </div>
                <div className="border-b my-4 border-gray-200"></div>
                <h2 className="text-gray-950 text-xl">Sổ địa chỉ</h2>

                {listAddress?.map((a) => (
                    <div
                        className="flex justify-between pb-2 border-b border-gray-200 mt-2"
                        key={a.id}
                    >
                        <div className="left">
                            <p>{a.name}</p>
                            <p>{a.phone}</p>
                            <p>
                                {a.address +
                                    ", " +
                                    a.sub_district.name +
                                    ", " +
                                    a.district.name +
                                    ", " +
                                    a.city.name}
                            </p>
                        </div>
                        <div className="rigth flex justify-between">
                            <button
                                className="text-blue-500 hover:text-black"
                                onClick={() => {
                                    setShowDialogUD({ value: true, id: a.id });
                                }}
                            >
                                Cập nhật
                            </button>
                            <div className="mx-2 flex items-center justify-center">
                                <span className="border-gray-300 border-l text-white">
                                    -
                                </span>
                            </div>

                            {showConfirmation ? (
                                <div className="fixed inset-0 flex items-center justify-center z-50 w-full h-full bg-black bg-opacity-50">
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-base">
                                            Bạn có chắc muốn xóa địa chỉ này !
                                        </p>
                                        <div className="flex justify-between">
                                            <button
                                                className="bg-red-500 hover:bg-red-700 mr-2 text-base rounded-lg text-gray-200 px-2 py-1 "
                                                onClick={() =>
                                                    confirmDelete(a.id)
                                                }
                                            >
                                                Xác nhận xóa
                                            </button>
                                            <button
                                                className="hover:text-black text-base rounded-lg bg-gray-300 text-black px-2 py-1"
                                                onClick={() => cancelDelete()}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="text-blue-500 hover:text-black"
                                    onClick={() => handleDelete()}
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 w-full h-full bg-black bg-opacity-70">
                    <div className="bg-white px-12 py-10 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-bold">
                                Thêm địa chỉ mới
                            </h2>
                            <button
                                onClick={handleDialogClose}
                                className="hover:text-red-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <label className="w-[20%] block">
                                Thông tin hóa đơn
                            </label>
                            <div className="flex gap-4">
                                <div className="flex-col w-1/2 mb-3">
                                    <div className="relative">
                                        <select
                                            className="cursor-pointer block w-full text-base border border-gray-200 text-gray-700 py-3 placeholder:text-black px-4 pr-8 rounded-md leading-tight focus:border-gray-500"
                                            onChange={(e) =>
                                                handleOnChangeCity(
                                                    e.target.value
                                                )
                                            }
                                            ref={(el) =>
                                                (selectRefs.current.selectCity =
                                                    el)
                                            }
                                            name="city"
                                        >
                                            <option value="0">
                                                Chọn Thành Phố/Tỉnh
                                            </option>
                                            {listCity.map((city) => (
                                                <option
                                                    value={city.id}
                                                    key={city.id}
                                                >
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-[0.1rem] text-gray-700">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-col w-1/2 mb-2">
                                    <div className="relative">
                                        <select
                                            className="cursor-pointer text-base block w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-md leading-tight focus:border-gray-500 placeholder:text-black"
                                            onChange={(e) =>
                                                handleOnChangeDistrict(
                                                    e.target.value
                                                )
                                            }
                                            ref={(el) =>
                                                (selectRefs.current.selectDistrict =
                                                    el)
                                            }
                                            name="district"
                                        >
                                            <option value="0">
                                                Chọn Quận/Huyện
                                            </option>
                                            {listDistrict.map((district) => (
                                                <option
                                                    value={district.id}
                                                    key={district.id}
                                                >
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-[0.1rem] text-gray-700">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-col w-1/2">
                                    <div className="relative">
                                        <select
                                            className="cursor-pointer text-base block w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-md leading-tight focus:border-gray-500"
                                            onChange={handleInputChange}
                                            ref={(el) =>
                                                (selectRefs.current.selectSubDistrict =
                                                    el)
                                            }
                                            name="sub_district"
                                        >
                                            <option value="0">
                                                Chọn Phường/Xã
                                            </option>
                                            {listSubDistrict.map(
                                                (subDistrict) => (
                                                    <option
                                                        value={subDistrict.id}
                                                        key={subDistrict.id}
                                                    >
                                                        {subDistrict.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-[0.1rem] text-gray-700">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-col w-1/2">
                                    <input
                                        className="bg-[#fff] focus:border-gray-500 block w-full text-gray-700 border rounded-md py-3 px-4 mb-3 leading-tight text-base"
                                        type="text"
                                        name="address"
                                        placeholder="Số nhà/Tên đường ..."
                                        value={address.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-col w-1/2">
                                    <input
                                        className="bg-[#fff] focus:border-gray-500 block w-full text-gray-700 border rounded-md py-3 px-4 mb-3 leading-tight text-base"
                                        type="text"
                                        name="phone"
                                        placeholder="Số điện thoại ..."
                                        value={
                                            address.phone ? address.phone : ""
                                        }
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex-col w-1/2">
                                    <input
                                        className="bg-[#fff] focus:border-gray-500 block w-full text-gray-700 border rounded-md py-3 px-4 mb-3 leading-tight text-base"
                                        type="text"
                                        name="name"
                                        placeholder="Tên người nhận ..."
                                        value={address.name ? address.name : ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-black hover:bg-gray-800 w-full text-white text-base font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline "
                                >
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDialogUD.value && (
                <UpdateAddressDialog
                    setShowDialogUD={setShowDialogUD}
                    showDialogUD={showDialogUD}
                    setCallApiGetAddress={setCallApiGetAddress}
                />
            )}
        </>
    );
}

const UpdateAddressDialog = ({
    setShowDialogUD,
    showDialogUD,
    setCallApiGetAddress,
}) => {
    const [address, setAddress] = useState();
    const handleDataSubmit = (e) => {
        e.preventDefault();
        setShowDialogUD({ value: false, id: 0 });
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.post(
            "/user/address/update",
            {
                id: showDialogUD.id,
                address: address,
            },
            { headers }
        ).then((res) => {
            setCallApiGetAddress((prev) => {
                return prev + 1;
            });
            console.log(res);
        });
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress((prevState) => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get(`/user/address/view/${showDialogUD.id}`, { headers }).then(
            (res) => {
                if (res.status === "success") {
                    setAddress(res.data);
                } else {
                    toastify.error(res.message);
                }
            }
        );
    }, []);

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 w-full h-full bg-black bg-opacity-70">
                <div className="bg-white px-12 py-10 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-2xl font-bold">Cập nhật địa chỉ</h2>
                        {/* Đóng */}
                        <button
                            onClick={() =>
                                setShowDialogUD({ value: false, id: 0 })
                            }
                            className="hover:text-red-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </button>
                    </div>
                    <span>
                        Bạn chỉ có thể cập nhật địa chỉ nhà, số điện thoại và
                        tên người nhận.
                    </span>
                    <form
                        onSubmit={(e) => {
                            handleDataSubmit(e);
                        }}
                        className="mt-2"
                    >
                        <div className="flex gap-4">
                            <div className="flex-col w-1/2 mb-3">
                                <div className="relative">
                                    <select
                                        className="cursor-pointer block w-full text-base border border-gray-200 text-gray-700 py-3 placeholder:text-black px-4 pr-8 rounded-md leading-tight focus:border-gray-500"
                                        name="city"
                                    >
                                        <option value={address?.city.id}>
                                            {address?.city.name}
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-[0.1rem] text-gray-700">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-col w-1/2 mb-2">
                                <div className="relative">
                                    <select
                                        className="cursor-pointer text-base block w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-md leading-tight focus:border-gray-500 placeholder:text-black"
                                        name="district"
                                    >
                                        <option value={address?.district.id}>
                                            {address?.district.name}
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-[0.1rem] text-gray-700">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-col w-1/2">
                                <div className="relative">
                                    <select
                                        className="cursor-pointer text-base block w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-md leading-tight focus:border-gray-500"
                                        name="sub_district"
                                    >
                                        <option
                                            value={address?.sub_district.id}
                                        >
                                            {address?.sub_district.name}
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-[0.1rem] text-gray-700">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-col w-1/2">
                                <input
                                    className="bg-[#fff] focus:border-gray-500 block w-full text-gray-700 border rounded-md py-3 px-4 mb-3 leading-tight text-base"
                                    type="text"
                                    name="address"
                                    value={address?.address}
                                    onChange={(e) => handleAddressChange(e)}
                                    placeholder="Số nhà/Tên đường ..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-col w-1/2">
                                <input
                                    className="bg-[#fff] focus:border-gray-500 block w-full text-gray-700 border rounded-md py-3 px-4 mb-3 leading-tight text-base"
                                    type="text"
                                    name="phone"
                                    value={address?.phone}
                                    onChange={(e) => handleAddressChange(e)}
                                    placeholder="Số điện thoại ..."
                                />
                            </div>
                            <div className="flex-col w-1/2">
                                <input
                                    className="bg-[#fff] focus:border-gray-500 block w-full text-gray-700 border rounded-md py-3 px-4 mb-3 leading-tight text-base"
                                    type="text"
                                    name="name"
                                    value={address?.name}
                                    onChange={(e) => handleAddressChange(e)}
                                    placeholder="Tên người nhận ..."
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-black hover:bg-gray-800 w-full text-white text-base font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline "
                            >
                                Cập Nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
