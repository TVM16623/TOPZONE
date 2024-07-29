import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Http from "../../../utils/http";
import Title from "../../../components/all/Title";
import ListProduct from "../../../components/users/groupProduct";
import Slick from "../../../components/users/Slick";

export default function Category() {
    const params = useParams();
    const [banner, setBanner] = useState(null);
    const [listProduct, setListProduct] = useState(null);
    const [logo, setLogo] = useState(null);
    const [active, setActive] = useState(params.slugSubCategory ?? null);
    const [subCategory, setSubCategory] = useState(null);
    const [back, setBack] = useState(false);

    useEffect(() => {
        Http.get(`/category/${params.slugCategory}`)
            .then((response) => {
                setLogo(response.data.logo_category);
                setBanner(response.data.banner);
                setListProduct(response.data.product);
                setSubCategory(response.data.sub_category);
                // console.log(response.data);
            })
            .catch((res) => {
                console.log(res);
            });
    }, [params.slugCategory, back]);

    useEffect(() => {
        if (params.slugSubCategory) {
            Http.get(`/category/subcategory/${params.slugSubCategory}`)
                .then((response) => {
                    setListProduct(response.data.product);
                })
                .catch((err) => console.error(err));
        }
    }, [params.slugSubCategory, active]);

    const handleActive = (s) => {
        setActive(s.slug);
    };

    const handleClick = () => {
        setActive(null);
        setBack(true);
    };

    return (
        <>
            <Title>TopZone - Danh mục</Title>
            <div className="min-h-96 w-full px-28 mt-4">
                <div className="sub-category">
                    <div className="w-full items-center justify-items-center block my-6">
                        <img
                            src={logo}
                            alt={params.slugCategory}
                            className="h-[35px] w-auto m-auto"
                        />
                    </div>

                    {<Slick images={banner} />}

                    <div className="grid grid-cols-auto mt-10">
                        <Link
                            className={`text-lg cursor-pointer col-start-1 block ${
                                !active
                                    ? "text-white underline"
                                    : "hover:text-white text-[#afb7bd]"
                            }`}
                            to={`/category/${params.slugCategory}`}
                            onClick={() => handleClick()}
                        >
                            Tất cả
                        </Link>
                        {subCategory?.map((s, index) => (
                            <Link
                                to={`/category/${params.slugCategory}/${s.slug}`}
                                className={`text-lg cursor-pointer hover:text-white col-start-${
                                    index + 2
                                } ${
                                    active === s.slug
                                        ? "underline text-white"
                                        : "text-[#afb7bd]"
                                }`}
                                key={s.name}
                                onClick={() => {
                                    handleActive(s);
                                }}
                            >
                                <p>{s.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="my-6">
                    <ListProduct listProduct={listProduct} />
                </div>
            </div>
        </>
    );
}
