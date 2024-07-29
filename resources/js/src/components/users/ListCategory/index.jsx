import { useContext } from "react";
import Card from "./Card";
import { CategoryContext } from "../../../Context/CategoryContext";

export default function ListCategory() {
    const categories = useContext(CategoryContext);
    return (
        <>
            <ul className="choose-cate">
                {categories?.map((item, index) => (
                    <li key={item.slug}>
                        <Card item={item} />
                    </li>
                ))}
            </ul>
        </>
    );
}
