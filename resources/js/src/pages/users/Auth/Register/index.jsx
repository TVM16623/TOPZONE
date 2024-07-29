import { Link } from "react-router-dom";
import Title from "../../../../components/all/Title";
import toastify from "../../../../utils/toastify";
import { useState, useContext } from "react";
import Http from "../../../../utils/http";
import { UserContext } from "../../../..";
import VerifyEmail from "./VerifyEmail";
import FormRegister from "./FormRegister";
import token from "../../../../utils/token";

export default function Register() {
    const { user, setUser } = useContext(UserContext);
    const [data, setData] = useState({
        email: "",
        name: "",
        password: "",
        password_confirmation: "",
    });

    const handleCancel = () => {
        setUser({ ...user, isWaitingVerification: false });
        token.setEmailVerify({ email: "", isWaiting: false });
    };

    return (
        <>
            <Title>TopZone - Đăng kí</Title>
            <div className="py-2 px-32 h-full">
                <div className="flex justify-center h-full bg-[#323232] rounded-lg shadow-lg">
                    <div
                        className="hidden bg-cover lg:block lg:w-2/3 rounded-l-lg bg-[#323232]"
                        style={{
                            backgroundImage:
                                "url(https://phongvu.vn/cong-nghe/wp-content/uploads/2021/05/hanh-trinh-phat-trien-apple-phong-vu-4.jpg)",
                        }}
                    ></div>

                    <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-1/3">
                        <div className="flex-1 p-4">
                            <div className="text-center top-0">
                                <div className="flex justify-center mx-auto">
                                    <img
                                        className="w-auto h-7 sm:h-8"
                                        src="/../assets/images/logo.png"
                                        alt=""
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="min-h-[383px]">
                                    {/* {token.has('waitingVerificationEmail') ? (token.getEmailVerify().isWaiting ? <VerifyEmail data={data} onClickCancel={() => { handleCancel() }} /> :
                                        <FormRegister data={data} setData={setData} setUser={setUser} user={user} />) : <FormRegister data={data} setData={setData} setUser={setUser} user={user} />} */}
                                    <FormRegister
                                        data={data}
                                        setData={setData}
                                        setUser={setUser}
                                        user={user}
                                    />
                                    )
                                </div>

                                <p className="mt-6 text-sm text-gray-400">
                                    Bạn đã có tài khoản?
                                    <Link
                                        to="/../auth/login"
                                        className="text-blue-500 focus:underline hover:underline"
                                    >
                                        Đăng nhập
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
