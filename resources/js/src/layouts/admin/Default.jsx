import { Link, Outlet } from "react-router-dom";
import FooterAdmin from "../../components/admin/Footer";
import Header from "../../components/admin/Navbar";
import Title from "../../components/all/Title";
import Sidebar from "../../components/admin/Sidebar";

export default function DefaultAdminLayout() {
    return (
        <>
            <Title>TopZone - Trang quản trị</Title>
            <div className="bg-gray-100 font-family-karla flex">
                <Sidebar />
                <div className="w-full flex flex-col min-h-screen">
                    <Header />

                    <div className="w-full border-t flex flex-col">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}
