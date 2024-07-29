import { useEffect, useState } from "react";
import Http from "../../../utils/http";
import { formatVND } from "../../../utils/Hepers";

export default function Search(props) {
    const [search, setSearch] = useState([]);
    const [product, setProduct] = useState([]);
    const [showDialog, setShowDialog] = useState(false);

    const onChangInput = (e) => {
        e.preventDefault();

        Http.post("/product/find", { name: search }).then((res) => {
            setProduct(res);
            console.log(res);
            DialogShow();
        });
    };

    const DialogShow = () => {
        setShowDialog(!showDialog);
    };

    return (
        <>
            <form
                className="pt-2 relative mx-auto text-gray-600 container "
                onSubmit={onChangInput}
            >
                <input
                    className="border-2 border-gray-300 bg-white h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none"
                    type="text"
                    // name="search"
                    // placeholder="Search"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
                <button
                    type="submit"
                    className="absolute right-0 top-0 mt-5 mr-4"
                >
                    <svg
                        className="text-gray-600 h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 56.966 56.966"
                        style={{
                            enableBackground: "new 0 0 56.966 56.966",
                        }}
                        width="512px"
                        height="512px"
                    >
                        <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23 s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92 c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17 s-17-7.626-17-17S14.61,6,23.984,6z" />
                    </svg>
                </button>
                {showDialog && (
                    <div className="search">
                        <div
                            className="search-detail fixed top-0 right-0 left-0 bottom-0 bg-black z-10 opacity-30"
                            onClick={DialogShow}
                        ></div>
                        <div className="absolute z-20 w-[400px] overflow-y-auto h-[400px]">
                            {product.map((item) => {
                                return (
                                    <div className="col-span-1">
                                        <a href={"/product/" + item.slug}>
                                            <div
                                                className="bg-[#323232] p-6 rounded-xl overflow-hidden
                     shadow-lg hover:shadow-xl
                     items-center hover:bg-zinc-800 flex flex-row"
                                            >
                                                <div className="mb-[15px] flex item-img item-img_42 h-full w-full justify-center items-center">
                                                    <img
                                                        className="flex items-center justify-items-center w-[150px] h-[150px]"
                                                        src={
                                                            item.images[0]
                                                                ?.image
                                                        }
                                                        alt="iPhone 15 Pro Max"
                                                    ></img>
                                                </div>
                                                <div className="w-full">
                                                    <div className="font-bold text-xs text-white text-center">
                                                        {item.name}
                                                    </div>
                                                    <div className="p-2 w-full">
                                                        <p className="justify-items-center text-white text-bold text-sm text-center">
                                                            {formatVND(
                                                                item
                                                                    .product_details[0]
                                                                    .price
                                                            ) + "đ"}
                                                        </p>
                                                    </div>
                                                    <div className="my-4 flex flex-wrap justify-center items-center gap-2">
                                                        {item.product_details
                                                            .filter(
                                                                (
                                                                    product,
                                                                    index,
                                                                    self
                                                                ) =>
                                                                    index ===
                                                                    self.findIndex(
                                                                        (p) =>
                                                                            p
                                                                                .type
                                                                                .name ===
                                                                            product
                                                                                .type
                                                                                .name
                                                                    )
                                                            )
                                                            .map((item) => {
                                                                return (
                                                                    <div className="card-type card-type-not-active">
                                                                        <p className="text-center truncate text-xs text-[#dbdbdb]">
                                                                            {
                                                                                item
                                                                                    .type
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </form>
        </>
    );
}
