import { useEffect, useState } from "react";
import Title from "../../../components/all/Title";
import Http from "../../../utils/http";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import toastify from "../../../utils/toastify";
import token from "../../../utils/token";
import { formatVND } from "../../../utils/Hepers";
import { useCart } from "../../../Context/CartContext";
import ReviewProduct from "../ReviewProduct";

export default function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [colorActive, setColorActive] = useState({});
    const [sku, setSku] = useState("");
    const params = useParams();
    const [typeName, setTypeName] = useState("");
    const [arrayColor, setArrayColor] = useState([]);
    const [image, setImage] = useState();
    const [nameColor, setNameColor] = useState("");
    const [price, setPrice] = useState({});
    const { setUpdateCart } = useCart();
    let navigate = useNavigate();
    const [invoice_id, setInvoiceId] = useState(null);
    const [dialogReviewProduct, setDialogReviewProduct] = useState(false);
    const [invoice, setInvoice] = useState();
    const handleReload = "handle_reload";

    useEffect(() => {
        Http.get(`/product/${params.slug}`)
            .then((res) => {
                setProduct(res.data.product);

                setTypeName(
                    Object.entries(res.data.product.product_details)[0][1].type
                );

                const data = Object.entries(
                    res.data.product.product_details
                )[0][1].colors;
                setNameColor(Object.entries(data)[0][1].name); // lấy name của color active lần đầu vào page

                setColorActive({
                    name: nameColor,
                    value: Object.entries(data)[0][1].value,
                });

                setImage(res.data.product.image[nameColor]);

                setPrice({ ...price, discount: res.data.product.discount });
            })
            .catch();
    }, [params.slug]);

    useEffect(() => {
        if (product) {
            const data_ = Object.entries(product.product_details);

            const updatedColors = Object.keys(data_)
                .filter((key) => data_[key][0] === typeName)
                .map((key) =>
                    Object.entries(data_[key][1].colors).map((c) => {
                        return { name: c[1].name, value: c[1].value };
                    })
                );

            setColorActive({
                name: updatedColors.flat()[0].name,
                value: updatedColors.flat()[0].value,
            });

            setArrayColor(updatedColors.flat());
            setImage(product.image[nameColor]);
            const __price = Object.entries(
                product.product_details[typeName].colors
            )
                .filter(
                    ([key, value]) =>
                        value.name === updatedColors.flat()[0].name
                )
                .reduce((acc, item) => {
                    // Tạo một đối tượng mới với các thuộc tính 'price' và 'price_discount'
                    return {
                        price: item[1].price,
                        price_discount: item[1].price_discount,
                    };
                }, {});
            setPrice({
                ...price,
                price: __price.price,
                price_discount: __price.price_discount,
            });

            let __sku = Object.entries(
                product?.product_details[typeName].colors
            )
                .filter(
                    ([key, value]) =>
                        value.name === updatedColors.flat()[0].name
                )
                .map((item) => {
                    return item[1].sku;
                });
            setSku(__sku[0]);
            window.scrollTo(0, 0);
        }
    }, [typeName]);

    const handleClickType = (_typeName) => {
        if (_typeName !== typeName) {
            // Kiểm tra type mới nhấn vs type trc đó có giong
            setTypeName(_typeName); // Nếu nhấn type khác thì setType
        }
    };

    const handleClickColor = (_color) => {
        if (_color.name !== colorActive.name) {
            setColorActive({ name: _color.name, value: _color.value }); // Nếu nhấn color khác thì setcolor mới
            setImage(product.image[_color.name]);
            console.log("color active: " + _color.name + ", type: " + typeName);
            let _price = Object.entries(
                product?.product_details[typeName].colors
            )
                .filter(([key, value]) => value.name === _color.name)
                .reduce((acc, item) => {
                    return {
                        price: item[1].price,
                        price_discount: item[1].price_discount,
                    };
                }, {});
            setPrice({
                ...price,
                price: _price.price,
                price_discount: _price.price_discount,
            });
            let _sku = Object.entries(product?.product_details[typeName].colors)
                .filter(([key, value]) => value.name === _color.name)
                .map((item) => {
                    return item[1].sku;
                });

            setSku(_sku[0]);
        }
    };

    const handleAddCart = (sku) => {
        if (!token.get("access_token")) {
            navigate("/auth/login");
            return;
        }
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        Http.post("/cart/create", { sku: sku }, { headers })
            .then((res) => {
                toastify.success(res.message);
            })
            .catch(() => {
                console.log("Xay ra loi roi");
            });
        setUpdateCart(true);
    };

    useEffect(() => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get("/invoice/invoice-load", { headers }).then((res) => {
            setInvoice(res);
        });
    }, []);

    const handleDialogReviewProduct = (e) => {
        const review_product_id = e.target.attributes.review_product_id.value;
        console.log("review_product_id", review_product_id);
        setInvoiceId(review_product_id);
        setDialogReviewProduct(true);
    };

    const handlePDF = () => {
        sessionStorage.setItem(handleReload, "true");
        window.location.reload(false);
    };
    useEffect(() => {
        if (sessionStorage.getItem(handleReload) === "true" && pdfRef.current) {
            sessionStorage.removeItem(handleReload);
            pdfRef.current.click();
        }
    });

    return (
        <>
            <Title>TopZone - Sản phẩm</Title>
            <div className="min-h-[800px] w-full">
                <div className="mx-16 grid grid-cols-5 mt-[20px] my-12 h-full">
                    <div className="image col-span-3">
                        <div className="text-white px-8">
                            {product && <ProductImage image={image} />}
                        </div>
                    </div>

                    <div className="information-product col-span-2">
                        <div className="text-white">
                            <h1 className="text-3xl font-bold text-white">
                                {product?.name}
                            </h1>
                            <div className="mt-4">
                                <p className="text-base">
                                    Phân loại: {typeName}
                                </p>
                                {product && (
                                    <ProductType
                                        product={product}
                                        typeName={typeName}
                                        onClick={(_typeName) => {
                                            handleClickType(_typeName);
                                        }} // _typeName là type trước khi click
                                    />
                                )}

                                {
                                    <ProductColor
                                        colorActive={colorActive}
                                        arrayColor={arrayColor}
                                        onClick={(_color) => {
                                            handleClickColor(_color);
                                        }}
                                    />
                                }
                            </div>
                            <div className="mt-4">
                                {price.discount === 0 ? (
                                    <h2 className="text-2xl font-bold text-white">
                                        Giá: {formatVND(price.price)}đ
                                    </h2>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-white">
                                            Giá khuyến mãi:{" "}
                                            {formatVND(price.price_discount)}đ
                                        </h2>
                                        <span className="text-base font-bold line-through text-white me-2">
                                            Giá gốc: {formatVND(price.price)}đ
                                        </span>
                                        <span>(-{price?.discount}%)</span>
                                    </>
                                )}
                            </div>
                            <div className="button-buy block mt-4">
                                <button
                                    className="bg-blue-600 hover:bg-blue-500
                                text-white font-bold py-4 px-6 rounded-lg
                                text-center cursor-pointer shadow-lg"
                                    onClick={() => handleAddCart(sku)}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white mt-18 mt-4">
                    <div>
                        <p className="text-base text-xl text-center font-bold">
                            Mô tả
                        </p>
                        {product && (
                            <ProductDescription
                                description={product.description}
                            />
                        )}
                    </div>
                    <div>
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-base text-xl font-bold mx-16 text-center">
                                Đánh giá sản phẩm này
                            </p>
                            <p className="text-base text-sm  mx-16 text-center">
                                Nếu đã mua sản phẩm này tại TopZone. Hãy đánh
                                giá ngay để giúp hàng ngàn người chọn mua hàng
                                tốt nhất bạn nhé !
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function ProductImage({ image }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const settings = {
        customPaging: function (i) {
            if (i < image.length) {
                // Sử dụng ảnh từ mảng image dựa trên index i
                return (
                    <a>
                        <img
                            src={
                                "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/" +
                                image[i]
                            }
                            className={
                                i === currentSlide
                                    ? "border-solid border border-sky-500"
                                    : ""
                            }
                            onClick={() => setCurrentSlide(i)}
                        />
                    </a>
                );
            }
            return <p>a</p>;
        },
        dots: true,
        nextArrow: false, // Ẩn nút next
        prevArrow: false,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    return (
        <>
            <Slider {...settings}>
                {image?.map((item, index) => (
                    <div key={index}>
                        <img
                            className="w-3/4 h-full m-auto"
                            src={
                                "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/" +
                                item
                            }
                        />
                    </div>
                ))}
            </Slider>
        </>
    );
}

function ProductType({ product, typeName, onClick }) {
    return (
        <>
            <div className="list-type my-2 flex flex-wrap justify-start items-center gap-2">
                {Object.keys(product.product_details).map((_typeName, i) => (
                    <div
                        key={i}
                        className={`card-type ${
                            _typeName.toString() == typeName
                                ? "card-type-active"
                                : "card-type-not-active"
                        }`}
                        onClick={() => onClick(_typeName)}
                    >
                        <span className="text-base text-[#dbdbdb]">
                            {_typeName}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}

function ProductColor({ colorActive, arrayColor, onClick }) {
    return (
        <>
            <p className="mt-4 text-base">Màu: {colorActive.name}</p>
            <ul className="flex gap-2 mt-2">
                {arrayColor.map((_color, index) => (
                    <li
                        key={index}
                        onClick={() => onClick(_color)}
                        className={` cursor-pointer
                            rounded-full h-12 w-12 flex items-center
                            justify-center bg-[${_color.value}]
                            ${
                                _color.name == colorActive.name
                                    ? "border-solid border-2 border-sky-500 shadow-md "
                                    : ""
                            }
                        `}
                    ></li>
                ))}
            </ul>
        </>
    );
}

function ProductDescription({ description }) {
    const [showAll, setShowAll] = useState(false);
    const handleClick = () => {
        setShowAll(true);
    };
    return (
        <>
            <div className="mx-16 flex justify-center w-100">
                <div className="max-w-[660px] mb-10">
                    <div
                        dangerouslySetInnerHTML={{ __html: description }}
                        className={`${showAll ? "" : "h-40 overflow-hidden"}`}
                    ></div>
                    {!showAll && (
                        <div className="">
                            <button
                                onClick={() => handleClick()}
                                id="showMoreButton"
                                className="text-sky-700 font-bold
                                w-full text-center flex items-center
                                cursor-pointer justify-center
                                "
                            >
                                Xem thêm
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
