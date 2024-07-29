import { Outlet } from "react-router-dom";
import Navbar from "../../components/users/Navbar";
import "../../../../../public/assets/css/home.css";
import Footer from "../../components/users/Footer";
import { CategoryProvider } from "../../Context/CategoryContext";
import { CartProvider } from "../../Context/CartContext";

export default function DefaultUserLayout() {

    return (
        <CategoryProvider>
            <CartProvider>
                <Navbar />
                <Outlet />
                <Footer />
            </CartProvider>
        </CategoryProvider >
    )
}
