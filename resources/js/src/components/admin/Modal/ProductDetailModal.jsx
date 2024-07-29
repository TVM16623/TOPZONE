import { useState } from "react";

const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;

    const initialType = Object.keys(product.product_details)[0];
    const initialColor = Object.keys(
        product.product_details[initialType].colors
    )[0];

    const [selectedType, setSelectedType] = useState(initialType);
    const [selectedColor, setSelectedColor] = useState(initialColor);

    const handleColorChange = (colorKey) => {
        setSelectedColor(colorKey);
    };

    const handleTypeChange = (typeKey) => {
        setSelectedType(typeKey);
        setSelectedColor(
            Object.keys(product.product_details[typeKey].colors)[0]
        );
    };

    const getStock = () => {
        return product.product_details[selectedType].colors[selectedColor]
            .stock;
    };

    const getImage = () => {
        const colorName =
            product.product_details[selectedType].colors[selectedColor].name;
        return product.image[colorName][0];
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        X
                    </button>
                </div>
                <div className="flex">
                    <div className="w-1/3">
                        <div className="flex mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
                            {Object.keys(
                                product.product_details[selectedType].colors
                            ).map((colorKey) => (
                                <img
                                    key={colorKey}
                                    src={
                                        product.image[
                                            product.product_details[
                                                selectedType
                                            ].colors[colorKey].name
                                        ][0]
                                    } // Display the first image of each color as thumbnail
                                    onClick={() => handleColorChange(colorKey)}
                                    className={`h-auto w-[80px] object-contain cursor-pointer ${
                                        colorKey === selectedColor
                                            ? "border-2 border-blue-500"
                                            : ""
                                    }`}
                                    alt={product.name}
                                />
                            ))}
                        </div>
                        <img
                            src={getImage()} // Display the first image of the selected color
                            className="h-auto w-full object-contain"
                            alt={product.name}
                        />
                    </div>
                    <div className="w-2/3 pl-6">
                        <p className="mb-4">
                            <strong>Slug:</strong> {product.slug}
                        </p>
                        <p className="mb-4">
                            <strong>Giảm giá:</strong> {product.discount}%
                        </p>
                        <p className="mb-4">
                            <strong>Số lượng: </strong> {getStock()}
                        </p>
                        <div>
                            <strong>Mô tả:</strong>
                            <div
                                className="h-[500px] overflow-y-auto"
                                dangerouslySetInnerHTML={{
                                    __html: product.description,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default ProductDetailModal;
