import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CardProduct({ product }) {
    return (<>
        <Link to={`/product/${product.slug}`}>
            <div
                className="
                bg-[#323232] p-6 rounded-xl overflow-hidden
                shadow-lg hover:shadow-xl flex flex-col
                items-center hover:bg-zinc-800
                "
            >
                <div className="mb-[15px] flex item-img item-img_42 h-full w-full justify-center items-center">
                    <img
                        className="flex items-center justify-items-center w-[235px] h-[235px]"
                        src={product.avatar[0]}
                        alt={product.name}
                    />
                </div>

                <div className="w-full">
                    <InformationCard productDetails={Object.entries(product.product_details)} nameProduct={product.name} />
                </div>
            </div>
        </Link >
    </>);
}

function InformationCard({ productDetails, nameProduct }) {
    const [active, setActive] = useState(null); // Lưu component type của component đang active
    const [price, setPrice] = useState(null); // L
    const [hasActive, setHasActive] = useState(false);

    useEffect(() => {
        setPrice(productDetails[0][1].price);
        setActive(productDetails[0][1].name);
    }, []);

    const handleClick = (event, value) => {
        event.preventDefault();
        setActive(value[1].name);
        setPrice(value[1].price);
        setHasActive(true);
    }

    return (<>
        <div className="my-4 flex flex-wrap justify-center items-center gap-2">
            {/* console.log(productDetails)} */}
            {Object.entries(productDetails).map(([key, value], i) => (
                <div
                    className={`card-type ${active == value[1].name ? "card-type-active" : "card-type-not-active"}`}
                    key={i}
                    onClick={(event) => handleClick(event, value)}
                >
                    <p
                        className="text-center truncate text-base text-[#dbdbdb]"
                        key={i}
                    >
                        {value[1].name}
                    </p>
                </div>
            ))}
        </div >

        <div className="font-bold text-xl text-white text-center">
            {nameProduct}
        </div>

        <div className="p-2 w-full">
            <p className="justify-items-center text-white text-bold text-xl text-center">
                {formatVND(price)}đ
            </p>
        </div>
    </>)
}

function formatVND(number) {
    if (number === null) {
        return '';
    }

    let str = number.toString();

    str = str.split('').reverse().join('');

    let result = '';

    for (let i = 0; i < str.length; i++) {
        if (i > 0 && i % 3 === 0) {
            result += '.';
        }
        result += str[i];
    }

    return result.split('').reverse().join('');
}

