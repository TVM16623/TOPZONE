import React, { useContext, useState } from "react";
import Title from "../../../components/all/Title";
import ListCategory from "../../../components/users/ListCategory";
import Policy from "../../../components/users/Policy";
import Carousel from "../../../components/users/Carousel";
import CategoryProduct from "./CategoryProduct";
import { CategoryContext } from "../../../Context/CategoryContext";
export default function Home() {
    const [data, setData] = useState();
    const category = useContext(CategoryContext);

    return (
        <>
            <Title>TopZone - Cửa hàng Apple chính hãng</Title>

            <div className="min-h-96">
                <Carousel />

                <ListCategory />

                <CategoryProduct ListCategory={category} />
            </div>

            <Policy />
        </>
    );
}
