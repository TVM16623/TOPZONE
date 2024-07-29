import React, { useState } from "react";

const AddProductDetailForm = ({ details, setDetails, colors, types }) => {
    const handleAddDetail = () => {
        setDetails([
            ...details,
            {
                color_id: "",
                image: "",
                type_id: "",
                sku: "",
                price: null,
                stock: null,
                specifications: "",
            },
        ]);
    };

    const handleRemoveDetail = (index) => {
        const updatedDetail = [...details];
        updatedDetail.splice(index, 1);
        setDetails(updatedDetail);
    };

    const handleChangeDetail = (index, event) => {
        const { name, value } = event.target;
        const updatedDetail = [...details];
        updatedDetail[index][name] = value;
        setDetails(updatedDetail);
    };

    return (
        <>
            {details?.map((detail, index) => (
                <div key={index} className="flex mb-4">
                    <div className="mr-2">
                        <select
                            name="color_id"
                            value={detail.color_id}
                            onChange={(e) => handleChangeDetail(index, e)}
                            className="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">Chọn màu</option>
                            {colors?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mr-2">
                        <input
                            type="text"
                            name="image"
                            value={detail.image}
                            onChange={(e) => handleChangeDetail(index, e)}
                            placeholder="URL ảnh"
                            className="block  bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:ring"
                        />
                    </div>
                    <div className="mr-2">
                        <select
                            name="type_id"
                            value={detail.type_id}
                            onChange={(e) => handleChangeDetail(index, e)}
                            className="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">Chọn loại sản phẩm</option>
                            {types?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mr-2">
                        <input
                            type="text"
                            name="sku"
                            value={detail.sku}
                            onChange={(e) => handleChangeDetail(index, e)}
                            placeholder="SKU"
                            className="block  bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:ring"
                        />
                    </div>
                    <div className="mr-2">
                        <input
                            type="number"
                            name="price"
                            value={detail.price}
                            min="0"
                            onChange={(e) => handleChangeDetail(index, e)}
                            placeholder="Giá"
                            className="block w-32 bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:ring"
                        />
                    </div>
                    <div className="mr-2">
                        <input
                            type="number"
                            name="stock"
                            min="0"
                            value={detail.stock}
                            onChange={(e) => handleChangeDetail(index, e)}
                            placeholder="Số lượng"
                            className="block w-32  bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:ring"
                        />
                    </div>
                    <div className="mr-2">
                        <input
                            type="text"
                            name="specifications"
                            value={detail.specifications}
                            onChange={(e) => handleChangeDetail(index, e)}
                            placeholder="Chi tiết"
                            className="block  bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:ring"
                        />
                    </div>
                    <div className="mr-2">
                        {index === details.length - 1 && (
                            <button
                                type="button"
                                onClick={handleAddDetail}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Thêm
                            </button>
                        )}
                        {index !== details.length - 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveDetail(index)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Xóa
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default AddProductDetailForm;
