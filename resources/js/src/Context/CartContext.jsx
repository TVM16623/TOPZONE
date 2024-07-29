import React, { createContext, useContext, useEffect, useState } from "react";
import token from "../utils/token";
import Http from "../utils/http";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [updateCart, setUpdateCart] = useState(false);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        if (!token.has("access_token")) return;
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        Http.get("/cart", { headers })
            .then((res) => {
                setQuantity(res.data.quantity);
                setUpdateCart(false);
            })
            .catch((error) => console.error("lỗi lấy giỏ hàng: " + error));
    }, [updateCart]);

    return (
        <CartContext.Provider value={{ quantity, setUpdateCart }}>
            {children}
        </CartContext.Provider>
    );
};
