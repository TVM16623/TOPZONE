import { useEffect, useState } from "react";
import styles from "../cart.module.scss";
import { formatVND } from "../../../../utils/Hepers";
import { Link } from "react-router-dom";
import token from "../../../../utils/token";
import toastify from "../../../../utils/toastify";
import Http from "../../../../utils/http";
import { useCart } from "../../../../Context/CartContext";

export default function ProductCart({ products, totalPrice, quantity, setProducts }) {
    const [product, setProduct] = useState(null);
    const { setUpdateCart } = useCart();
    useEffect(() => {
        setProduct(products);
    }, []);

    const handleClickPlus = (_sku) => {
        const updatedProductPlus = [...product];
        let index = updatedProductPlus?.findIndex((p) => p.sku === _sku);
        updatedProductPlus[index].quantity_product_in_cart += 1;
        setProducts(updatedProductPlus);
    };

    const handleClickMinus = (_sku) => {
        const updatedProductMinus = [...product];
        let index = updatedProductMinus?.findIndex((p) => p.sku === _sku);
        if (updatedProductMinus[index].quantity_product_in_cart == 1) return;
        updatedProductMinus[index].quantity_product_in_cart -= 1;
        setProducts(updatedProductMinus);
    };

    const handleOnChange = (value, _sku) => {
        if (value === '') return;
        const updatedProduct = [...product];
        let index = updatedProduct?.findIndex((p) => p.sku === _sku);
        updatedProduct[index].quantity_product_in_cart = parseInt(value);
        setProducts(updatedProduct);
    }

    const handleDelete = (_sku) => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        Http.post("/cart/delete", { sku: _sku }, { headers })
            .then((res) => {
                toastify.success(res.message);
                const newProducts = products.filter(product => product.sku !== _sku);
                setProducts(newProducts);
                setProduct(newProducts);
            })
            .catch((err) => { toastify.error("Đã xảy ra lỗi, hãy thử lại") })
        setUpdateCart(true);
    }

    return (<>
        <div className={styles.body}>
            <div className="min-h-[10rem] pb-2">
                <div className="w-[50%] m-auto">
                    <h1 className="text-2xl text-center p-2">Giỏ hàng của bạn</h1>
                    <div className={`shadow ${styles.contentCart} px-8`}>
                        <div className="p-3"></div>
                        <div className="listingCart">
                            {product?.map((item) => {
                                return (
                                    <CartProduct
                                        product={item} key={item.sku}
                                        onClickMinus={(_sku) => handleClickMinus(_sku)}
                                        onClickPlus={(_sku) => handleClickPlus(_sku)}
                                        quantity={item?.quantity_product_in_cart}
                                        onChange={(value, _sku) => handleOnChange(value, _sku)}
                                        slugProduct={item.slug}
                                        handleDelete={(_sku) => handleDelete(_sku)}
                                    />
                                )
                            })
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div >
    </>)
}

function CartProduct({ product, onClickMinus, onClickPlus, quantity, onChange, slugProduct, handleDelete }) {
    const _sku = product?.sku;
    let stock = product?.stock;

    return (<>
        <div className="product">
            <div className="grid grid-cols-3 gap-2 border-b pb-4 mt-2">
                <div className="col-span-2 grid grid-cols-3">
                    <div className="col-span-1">
                        <img src={product?.avatar} alt="" width={100} />
                    </div>
                    <div className="col-span-2">
                        <Link className="text-base font-bold" to={`/product/${slugProduct}`}>{product?.name}</Link>
                        <div className="mt-4">
                            <div>
                                {product.type && <p>Phân loại: {product?.type}
                                </p>}
                                <p>
                                    Màu sắc: {product?.color}
                                </p>

                                <button
                                    className="mt-2 text-gray-400 cursor-pointer hover:text-red-500"
                                    onClick={() => { handleDelete(_sku) }}
                                >
                                    Xóa
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="">
                    <p className="text-base font-bold">
                        {product && formatVND(product.price_discount * quantity)}đ
                    </p>
                    <p className="text-base line-through">
                        {`${product.price !== product.price_discount ? formatVND(product.price * quantity) + 'đ' : ''}`}
                    </p>
                    <div className="h-[24px] w-[80px] overflow-hidden grid grid-cols-3 mt-4">
                        <div
                            className={`tru w-fit h-[24px]
                        border bg-[#fff] text-center
                        rounded
                        ${quantity > 1 ? 'text-slate-600 cursor-pointer' : 'text-gray-200'}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.5} stroke="currentColor"
                                onClick={() => onClickMinus(_sku)}
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                            </svg>
                        </div>
                        <input
                            type="text" maxLength="3" step={1}
                            className={`bg-[#f5f5f7] h-[24px] text-center text-black`}
                            // placeholder={quantity}
                            value={quantity}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    onChange(value, _sku);
                                }
                            }}
                        />
                        <div
                            className={`cong w-fit h-[24px]
                         border bg-[#fff] text-center
                         cursor-pointer rounded
                         ${quantity == 1 ? 'text-slate-600' : ''}`}
                        >
                            <svg
                                onClick={() => onClickPlus(_sku)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.5} stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className={`text-base ${(quantity > stock) ? 'text-red-500' : 'text-black'}`}>
                            Còn lại: {stock}
                        </p>
                    </div>

                </div>
            </div>
        </div >
    </>);
}


