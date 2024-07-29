import { useEffect, useState } from "react";
import Title from "../../../components/all/Title";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import { useCart } from "../../../Context/CartContext";
import ProductCart from "./ProductCart";
import AddressCart from "./AddressCart";
import { MethodPayment } from "./MethodPayment";
import styles from "./cart.module.scss";
import { isEmptyOrWhitespace } from "../../../utils/Hepers";
import toastify from "../../../utils/toastify";
import InvoiceDetailCart from "./InvoiceDetailCart";
import { useNavigate } from "react-router-dom";

export function CartPage() {
    const navigate = useNavigate();
    const [product, setProduct] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const { quantity, setUpdateCart } = useCart();
    const [isChecked, setIsChecked] = useState(false);
    const [getAddress, setGetAddress] = useState(false);
    const [dataSubmit, setDataSubmit] = useState({
        product: [],
        address: {
            phone: '',
            address: '',
            sub_district: '',
            district: '',
            city: 0,
            note: '',
            code: '',
            payment_id: 0,
            totalPrice: 0,
        }
    });

    const validateData = (data) => {
        let empty = "Hãy điền đầy đủ thông tin mua màng";

        if (
            isEmptyOrWhitespace(data.address.phone) || isEmptyOrWhitespace(data.address.address) ||
            isEmptyOrWhitespace(data.address.sub_district) || isEmptyOrWhitespace(data.address.district) ||
            isEmptyOrWhitespace(data.address.name) || data.address.city === 0
        ) {
            toastify.error(empty, 'top', 'center');
            console.log(dataSubmit);
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (isChecked) {
            // Vàp tới đây thì dataSubmit đã được gán đầy đủ
            // Nếu isChecked (sẽ kiểm tra dataSubmit)
            // return true nếu data hợp lệ phía client
            // Bắt đầu call api tạo hóa đơn
            if (validateData(dataSubmit)) {
                let accessToken = token.get('access_token');
                let headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
                Http.post("/invoice/create", dataSubmit, { headers })
                    .then(res => {
                        if (res.status !== "success") {
                            return toastify.error(res.message);
                        }
                        if (res.data.isPaymentOnline) {
                            return navigate(`/payment/${res.data.idInvoice}`);
                        }
                        setUpdateCart(true);
                        return navigate('/user/order-history');

                    })
                    .catch(() => { console.error("lỗi call api tạo hóa đơn"); })
            };
        }
        setIsChecked(false);
        setGetAddress(false);
    }, [isChecked]);

    const handleDataSubmit = () => {
        setDataSubmit((vl) => ({
            ...vl,
            product: product,
            address: {
                ...vl.address,
                totalPrice: totalPrice,
            }
        }));
        setGetAddress(true);

    }

    useEffect(() => {
        if (getAddress === true) setIsChecked(true);

    }, [getAddress]);

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        Http.get('/cart', { headers })
            .then((res) => {
                setProduct(res.data.data);
            })
            .catch((err) => { console.log(err); })
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        let totalPrice = 0;

        product?.map((item) => {
            totalPrice = totalPrice + item.price_discount * item.quantity_product_in_cart;
        });
        setTotalPrice(totalPrice);
    }, [product]);

    return (
        <>
            <Title>TopZone - Giỏ hàng</Title>
            {product.length !== 0 ? (<>
                <ProductCart
                    products={product}
                    totalPrice={totalPrice}
                    quantity={quantity}
                    setProducts={setProduct}
                />
                <AddressCart setDataSubmit={setDataSubmit} getAddress={getAddress} />
                <InvoiceDetailCart totalPrice={totalPrice} setDataSubmit={setDataSubmit} products={product} />
                <MethodPayment setDataSubmit={setDataSubmit} />
                <div className={`${styles.body} pb-2 `}>
                    <div
                        className={`w-[50%] m-auto bg-[#fff] shadow
                            px-8 pt-3 pb-4 ${styles.borderBottom} bg-black`}
                        onClick={() => { handleDataSubmit() }}
                    >
                        <h3 className="text-xl font-bold text-center cursor-pointer pt-2 text-white">Thanh Toán</h3>
                    </div>
                </div>
            </>) : <EmptyProduct />
            }
        </>
    );
}

function EmptyProduct() {
    return (<>
        <div className="bg-white min-h-96">
            <div className="flex items-center pt-4 px-8">
                <p className="text-xl text-gray-800">
                    Giỏ hàng trống, hãy lựa chọn 1 sản phẩm để thêm vào giỏ hàng nhé.
                </p>
            </div>
        </div>
    </>);
}


