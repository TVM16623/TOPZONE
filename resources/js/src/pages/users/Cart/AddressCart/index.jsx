import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "../cart.module.scss";
import AddressModal from "../AddressModal";
import { UserContext } from "../../../..";
import Http from "../../../../utils/http";

export default function AddressCart({ setDataSubmit, getAddress }) {
    const selectRefs = useRef({
        selectCity: null,
        selectDistrict: null,
        selectSubDistrict: null,
    });

    const [address, setAddress] = useState({});
    const [listCity, setListCity] = useState([]); // Cho thành phố, tỉnh
    const [listDistrict, setListDistrict] = useState([]); // Cho thành huyện
    const [listSubDistrict, setListSubDistrict] = useState([]); // Cho xã, phường
    const { user } = useContext(UserContext);
    const handleClickAddress = (a) => {
        console.log("a", a);
        setAddress({
            ...address,
            city: a.city.id,
            district: a.district.id,
            sub_district: a.sub_district.id,
            address: a.address,
            phone: a.phone,
            name: a.name,
        });
        setListDistrict([{ id: a.district.id, name: a.district.name }]);
        setListSubDistrict([
            { id: a.sub_district.id, name: a.sub_district.name },
        ]);
    };

    const handleOnChangeCity = (id_city) => {
        setAddress({});
        setListSubDistrict([]);
        Http.get(`/directory/districts/${id_city}`).then((res) => {
            console.log(res);
            // Sắp xếp name theo A - Z
            res.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else {
                    return 0;
                }
            });
            console.log(res);
            // setListSubDistrict();

            setListDistrict(res);
        });
    };

    const handleOnChangeDistrict = (id_district) => {
        Http.get(`/directory/wards/${id_district}`).then((res) => {
            setListSubDistrict(res);
            // if()
            console.log("aaaa", res);
            console.log(selectRefs.current.selectSubDistrict.value);
        });
    };

    const handleLickCityDuplicate = (e) => {
        if (
            e.target.value === selectRefs.current.selectCity.value &&
            e.target.value !== ""
        ) {
            Http.get(`/directory/districts/${e.target.value}`).then((res) => {
                console.log(res);
                // Sắp xếp name theo A - Z
                res.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    } else if (a.name > b.name) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                setListDistrict(res);
            });
        }
    };

    useEffect(() => {
        setAddress({ ...address, name: user.name, phone: user.phone });
        Http.get("/directory/cities").then((res) => {
            console.log(res);
            // Sắp xếp name theo A - Z
            res.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else {
                    return 0;
                }
            });
            // console.log("city", res);
            setListCity(res);
        });
    }, []);

    useEffect(() => {
        let addressInput = document.getElementsByName("address")[0].value;
        let phoneInput = document.getElementsByName("phone")[0].value;
        let _save = document.getElementsByName("save-address")[0].checked;
        let nameInput = document.getElementsByName("name")[0].value;
        let _note = document.getElementsByName("note")[0].value;
        if (getAddress === true) {
            setDataSubmit((vl) => ({
                ...vl,
                address: {
                    ...vl.address,
                    address: addressInput,
                    city: +selectRefs.current.selectCity.value, // dấu + ép string sang int
                    district: selectRefs.current.selectDistrict.value,
                    sub_district: selectRefs.current.selectSubDistrict.value,
                    phone: phoneInput,
                    isSave: _save,
                    name: nameInput,
                    note: _note,
                },
            }));
        }
    }, [getAddress]);
    return (
        <div className={`${styles.body} w-full pb-2`}>
            <form className="w-[50%] m-auto bg-[#fff] shadow px-8 pt-3">
                <div className="flex gap-2 justify-between pt-2 pb-2">
                    <h4 className="font-bold text-xl">Thông tin mua hàng</h4>
                    <div>
                        <AddressModal onClick={(a) => handleClickAddress(a)} />
                    </div>
                </div>

                {/* Họ và tên khách hàng / number phone */}
                <div className="flex mb-2 gap-2">
                    <div className="flex-col w-1/2">
                        <input
                            className="bg-[#fff]
                            block w-full text-gray-700 border
                            rounded py-3 px-4 mb-3 leading-tight
                            text-base focus:border-gray-500"
                            id="grid-first-name"
                            type="text"
                            placeholder="Họ và tên"
                            defaultValue={user?.name}
                            name="name"
                        />
                    </div>
                    <div className="flex-col w-1/2">
                        <input
                            className="bg-[#fff] block w-full
                            text-gray-700 border border-gray-200
                            rounded py-3 px-4 leading-tight
                            focus:border-gray-500 text-base"
                            id="grid-last-name"
                            type="text"
                            placeholder="Số điện thoại"
                            defaultValue={user?.phone}
                            name="phone"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mb-6 w-full">
                    <input
                        className="bg-[#fff]
                            block w-full text-gray-700 border
                            rounded py-3 px-4 mb-3 leading-tight
                            text-base"
                        id="grid-first-name"
                        type="text"
                        placeholder="abc@gmail.com"
                        value={user?.email}
                        readOnly={true}
                    />
                </div>

                {/* Địa chỉ */}
                <div className="flex gap-1">
                    <div className="flex-col w-1/2 mb-2">
                        <div className="relative">
                            {/* city */}
                            <select
                                onClick={(e) => {
                                    handleLickCityDuplicate(e);
                                }}
                                className="cursor-pointer block w-full text-base
                                border border-gray-200 text-gray-700 py-3 placeholder:text-black
                                px-4 pr-8 rounded leading-tight focus:border-gray-500"
                                id="grid-state"
                                onChange={(e) => {
                                    handleOnChangeCity(e.target.value);
                                }}
                                ref={(el) =>
                                    (selectRefs.current.selectCity = el)
                                } //el: element
                                name="city"
                            >
                                {address.city ? (
                                    <option value={address.city}>
                                        {address.city}
                                    </option>
                                ) : (
                                    <option value="">
                                        Chọn Thành Phố/Tỉnh
                                    </option>
                                )}

                                {listCity?.map((a) => (
                                    <option
                                        value={a.id}
                                        key={a.id}
                                        {...(address?.city === a.id
                                            ? { selected: true }
                                            : "")}
                                    >
                                        {a.name}
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
                            {/* district */}
                            <select
                                className="cursor-pointer text-base block w-full border
                                border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded
                                leading-tight focus:border-gray-500 placeholder:text-black"
                                id="grid-state"
                                name="district"
                                onChange={(e) => {
                                    handleOnChangeDistrict(e.target.value);
                                }}
                                ref={(el) =>
                                    (selectRefs.current.selectDistrict = el)
                                }
                            >
                                {/* {address.district ? (
                                    <option value={address.district}>
                                        {address.district}
                                    </option>
                                ) : (
                                    <option value="">Chọn Quận/Huyện</option>
                                )} */}
                                <option value="">Chọn Quận/Huyện</option>
                                {listDistrict?.map((a) => (
                                    <option
                                        value={a.id}
                                        key={a.id}
                                        {...(address?.district === a.id
                                            ? { selected: true }
                                            : "")}
                                    >
                                        {a.name}
                                    </option>
                                ))}
                                {/* {address.district ? ( // (Huyện) Địa chỉ chọn từ sổ địa chỉ
                                    <>
                                        <option value={address.id} selected>
                                            {address.district}
                                        </option>
                                        {listDistrict.map((dt) => (
                                            <option value={dt.id} key={dt.id}>
                                                {dt.name}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <option value="">
                                            Chọn Quận/Huyện
                                        </option>
                                        {listDistrict.map((dt) => (
                                            <option
                                                value={dt.id}
                                                key={dt.id}
                                                {...(address?.district === dt.id
                                                    ? { selected: true }
                                                    : "")}
                                            >
                                                {dt.name}
                                            </option>
                                        ))}
                                    </>
                                )} */}
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

                <div className="flex mb-4 gap-1">
                    <div className="flex-col w-1/2">
                        <div className="relative">
                            {/* sub_district */}
                            <select
                                ref={(el) =>
                                    (selectRefs.current.selectSubDistrict = el)
                                }
                                className="cursor-pointer text-base block w-full border border-gray-200
                                text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:border-gray-500"
                                id="grid-state"
                                name="sub_district"
                            >
                                {address.sub_district &&
                                listSubDistrict.length === 0 ? (
                                    <option
                                        value={address.sub_district}
                                        selected
                                    >
                                        {address.sub_district}
                                    </option>
                                ) : null}
                                {listSubDistrict.length > 0 ? (
                                    listSubDistrict.map((sub_district) => (
                                        <option
                                            key={sub_district.id}
                                            value={sub_district.id}
                                            {...(address?.sub_district ===
                                            sub_district.id
                                                ? { selected: true }
                                                : "")}
                                        >
                                            {sub_district.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Chọn Phường/Xã</option>
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
                        <div className="text">
                            <input
                                className="bg-[#fff] focus:border-gray-500
                                block w-full text-gray-700 border
                                rounded py-3 px-4 mb-3 leading-tight
                                text-base"
                                id="grid-first-name"
                                type="text"
                                name="address"
                                placeholder="Số nhà/Tên đường ..."
                                {...(address?.address
                                    ? { value: address.address }
                                    : "")}
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-1">
                    <textarea
                        className="w-full h-20 p-2 border border-gray-200 leading-tight
                        rounded-sm focus:border-gray-500 text-base"
                        placeholder="Ghi chú cho đơn hàng ..."
                        name="note"
                    ></textarea>
                </div>

                <div className="flex items-center pb-4">
                    <input
                        type="checkbox"
                        name="save-address"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        id="checkboxId"
                        defaultChecked={true}
                    />
                    <label
                        htmlFor="checkboxId"
                        className="ml-2 text-base font-medium"
                    >
                        Lưu vào sổ địa chỉ để dùng cho lần mua hàng tiếp theo.
                    </label>
                </div>
            </form>
        </div>
    );
}
