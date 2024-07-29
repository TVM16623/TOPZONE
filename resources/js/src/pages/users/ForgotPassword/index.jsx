import { useState } from "react";
import Title from "../../../components/all/Title";
import Http from "../../../utils/http";
import toastify from "../../../utils/toastify";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSendEmail, setIsSendEmail] = useState(false);
    return (
        <>
            <Title>TopZone - Khôi phục mật khẩu</Title>

            <div className="body min-h-80">
                <div className="flex justify-center lg:mt-8 sm:mt-4">
                    {isSendEmail ? <IsSendEmail email={email} /> : <form
                        method="post"
                        className="border px-4 py-6 rounded-md bg-white md:w-1/3 sm:w-1/2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (email.length < 5 || !email.includes('@')) return toastify.error("Email không hợp lệ!");

                            Http.post('/reset-password', { email })
                                .then(res => {
                                    if (res.status !== 'success')
                                        return toastify.error(res.message);
                                    setIsSendEmail(true);
                                    console.log(res);
                                })

                        }}
                    >
                        <h1 className="text-xl text-dark font-bold">Khôi phục mật khẩu</h1>
                        <p className="text-gray-800 text-sm">Điền tài khoản email cần khôi phục mật khẩu, chúng tôi sẽ gửi thư đính kèm liên kết để thay đổi mật khẩu cho bạn.</p>
                        <label className="mt-2 font-bold text-base" htmlFor="email">Nhập email của bạn</label>
                        <div className="relative mt-1">
                            <input
                                id="email"
                                type="text" onChange={(e) => { setEmail(e.target.value) }}
                                className="py-2 px-4 border rounded-md w-full text-gray-600 focus:border-black focus:shadow-lg pl-10"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <button
                            type="submit"
                            className="mt-2 border rounded-md border-gray-800 bg-black
                            font-medium py-2 px-1 text-white text-center w-full
                            hover:bg-gray-800 hover:shadow-lg"
                        >
                            Send Email Reset
                        </button>
                    </form>}
                </div>

            </div>
        </>
    );
}

function IsSendEmail({ email }) {
    return (<>
        <div className="mt-4">
            <span className="text-base text-white">Chúng tôi đã gửi liên kết để đổi mật khẩu đến email: </span>
            <span className="text-xl font-bold text-white">{email}</span>
            <img
                src="https://cdn-icons-png.freepik.com/512/10678/10678052.png"
                alt="send-mail-success"
                className="w-40 m-auto mt-2" />
        </div>
    </>);
}
