import Http from "../utils/http";
import React, { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [category, setCategory] = useState([]);
    useEffect(() => {
        Http.get("/category")
            .then((data) => {
                setCategory(data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []); // Dependency array rỗng để chỉ chạy 1 lần khi component mount

    return (
        <CategoryContext.Provider value={category}>
            {children}
        </CategoryContext.Provider>
    );
};
