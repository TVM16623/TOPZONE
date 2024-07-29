import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserHome from "./pages/users/Home";
import UserLayout from "./layouts/users/Default";
import Auth from "./pages/users/Auth";
import Http from "../src/utils/http";
import NotFound from "./pages/users/NotFound";
import token from "./utils/token";
import AuthMiddleware from "./middlewares/Auth";
import Category from "./pages/users/Category";
import UserProfile from "./pages/users/Profile";
import Information from "./pages/users/Profile/Information";
import Review from "./pages/users/Profile/Review";
import Address from "./pages/users/Profile/Address";
import Order from "./pages/users/Profile/Order";
import ProductDetail from "./pages/users/ProductDetail";
import { CartPage } from "./pages/users/Cart";
import ForgotPassword from "./pages/users/ForgotPassword";
import ResetPassword from "./pages/users/ResetPassword";
import { Payment } from "./pages/users/Payment";
import DefaultAdminLayout from "./layouts/admin/Default";
import Search from "./components/all/Search";
import DashBoard from "./pages/Admin/DashBoard";
import Banner from "./pages/Admin/Banner";
import BannerForm from "./pages/Admin/Banner/form";
import Categories from "./pages/Admin/Categories";
import CategoryForm from "./pages/Admin/Categories/form";
import Users from "./pages/Admin/User";
import Promotions from "./pages/Admin/Promotion";
import PromotionForm from "./pages/Admin/Promotion/form";
import Color from "./pages/Admin/Color";
import ColorForm from "./pages/Admin/Color/form";
import Products from "./pages/Admin/Product";
import ProductForm from "./pages/Admin/Product/form";
import Invoices from "./pages/Admin/Invoice";
import InvoiceDetail from "./pages/Admin/Invoice/detail";
import Reviews from "./pages/Admin/Review";
export const UserContext = React.createContext({});

// window.pusher = require('pusher-js');

// window.Echo.channel("my-public-channel").listen("PublicChannelEvent", (event) => {
//     console.log(event);
//     return 1;
// });

// window.Echo.channel("my-public-channel").listen("PublicChannelEvent", (event) => {
//     console.log(event);
//     return 1;
// });
export default function App() {
    const [isLoading, setIsLoading] = useState();

    const [user, setUser] = useState({
        id: "",
        name: "",
        phone: "",
        email: "",
        isAdmin: 0,
        isLoggedIn: false, // User đã đăng nhập đúng không? chưa thì = false, login rồi thì = true
        isWaitingVerification: false, // Đang đợi xác thực, status đang đợi nhập mã gửi về email
    });

    React.useEffect(() => {
        // Có access token thì lấy info user
        if (token.has("access_token") || token.has("user")) {
            let accessToken = token.get("access_token");
            let headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            Http.getAuth("/auth/account/get-info-user", { headers })
                .then((data) => {
                    if (data?.data?.id) {
                        // Có thông tin user, chỉnh isLogin = true
                        token.setUser(JSON.stringify(data.data));
                        setUser({
                            id: data.data.id,
                            name: data.data.name,
                            phone: data.data.phone,
                            email: data.data.email,
                            isAdmin: data.data.is_admin,
                            isLoggedIn: true,
                        });
                        setIsLoading(false);
                        return;
                    }
                    setUser({});
                    setIsLoading(false);
                })
                .catch(() => {
                    setUser({ ...user, isLoggedIn: false });
                    console.log("lỗi lấy info user");
                    setIsLoading(false);
                });
        }
    }, []);

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Router>
                <Routes>
                    <Route element={<UserLayout />}>
                        <Route path="/" element={<UserHome />} />

                        <Route
                            path="auth"
                            element={<AuthMiddleware.notLoggedIn />}
                        >
                            <Route path="login" element={<Auth.Login />} />
                            <Route
                                path="register"
                                element={<Auth.Register />}
                            />
                            <Route
                                path="forgot-password"
                                element={<ForgotPassword />}
                            />
                        </Route>

                        <Route
                            path="/product/:slug"
                            element={<ProductDetail />}
                        />

                        <Route
                            path="/category/:slugCategory/:slugSubCategory?"
                            element={<Category />}
                        />

                        <Route element={<AuthMiddleware.isLogin />}>
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/payment/:id" element={<Payment />} />
                            <Route path="/" element={<UserProfile />}>
                                <Route path="/user" element={<Information />} />
                                <Route
                                    path="/user/order-history"
                                    element={<Order />}
                                />
                                <Route
                                    path="/user/list-address"
                                    element={<Address />}
                                />
                                <Route
                                    path="/user/review-and-reply"
                                    element={<Review />}
                                />
                            </Route>
                        </Route>

                        <Route element={<AuthMiddleware.isLogin />}>
                            <Route path="*" element={<NotFound />} />
                        </Route>

                        <Route element={<AuthMiddleware.notLoggedIn />}>
                            <Route
                                path="/reset-password"
                                element={<ResetPassword />}
                            />
                        </Route>
                    </Route>

                    <Route element={<AuthMiddleware.isAdmin />}>
                        <Route path="/admin" element={<DefaultAdminLayout />}>
                            <Route path="dashboard" element={<DashBoard />} />
                            <Route path="banner" element={<Banner />} />
                            <Route
                                path="banner/create"
                                element={<BannerForm />}
                            />
                            <Route
                                path="banner/edit/:slug"
                                element={<BannerForm />}
                            />
                            <Route path="categories" element={<Categories />} />
                            <Route
                                path="categories/create"
                                element={<CategoryForm />}
                            />
                            <Route
                                path="categories/edit/:slug"
                                element={<CategoryForm />}
                            />
                            <Route path="product" element={<Products />} />
                            <Route
                                path="product/create"
                                element={<ProductForm />}
                            />
                            <Route
                                path="product/edit/:slug"
                                element={<ProductForm />}
                            />
                            <Route path="order" element={<Invoices />} />
                            <Route
                                path="order/detail/:id"
                                element={<InvoiceDetail />}
                            />
                            <Route path="customer" element={<Users />} />
                            <Route path="promotion" element={<Promotions />} />
                            <Route
                                path="promotion/create"
                                element={<PromotionForm />}
                            />
                            <Route
                                path="promotion/edit/:id"
                                element={<PromotionForm />}
                            />
                            <Route path="color" element={<Color />} />
                            <Route
                                path="color/create"
                                element={<ColorForm />}
                            />
                            <Route
                                path="color/edit/:id"
                                element={<ColorForm />}
                            />
                            <Route path="review" element={<Reviews />} />
                            <Route path="report" element={<DashBoard />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </UserContext.Provider>
    );
}
