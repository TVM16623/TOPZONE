import { useSearchParams } from 'react-router-dom';
import Title from '../../../components/all/Title';
import { useState } from 'react';
import toastify from '../../../utils/toastify';
import Http from '../../../utils/http';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [passwordText, setPasswordText] = useState(false);
    const [passwordCText, setPasswordCText] = useState(false);
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();

    return (<>
        <Title>TopZone - Khôi phục mật khẩu</Title>

        <div className="body min-h-80">
            <div className="flex justify-center lg:mt-8 sm:mt-4">
                <form
                    method="post"
                    className="border px-4 py-6 rounded-md bg-white md:w-1/3 sm:w-1/2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        Http.post(`/reset-password/${token}`, { password: password, password_confirmation: passwordConfirm })
                            .then(res => {
                                if (res.status !== 'success') {
                                    return toastify.error(res.message);
                                }
                                return toastify.success(res.message);
                            })
                    }}
                >
                    <h1 className='text-xl font-bold'>Cập nhật mật khẩu mới</h1>
                    <div className="mt-2">
                        <label htmlFor="password" className='block text-base'>
                            Nhập mật khẩu:
                        </label>
                        <div className="flex justify-between items-center">
                            <input
                                type={passwordText ? 'text' : 'password'}
                                className="py-2 px-4 border rounded-md w-full text-gray-600 focus:border-black focus:shadow-lg"
                                name="password"
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <div className="relative">
                                <svg
                                    onClick={() => { setPasswordText(!passwordText) }}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute right-4 top-1/2 transform -translate-y-1/2 size-6 text-zinc-500 pt-2">
                                    {passwordText ? (
                                        <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></>) :
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    }
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="password_confirm" className='block text-base'>Nhập lại mật khẩu mới của bạn:</label>
                        <div className="flex justify-between items-center">
                            <input type={passwordCText ? 'text' : 'password'}
                                className="py-2 px-4 border rounded-md w-full text-gray-600 focus:border-black focus:shadow-lg"
                                name="password_confirm"
                                onChange={(e) => { setPasswordConfirm(e.target.value) }}
                            />
                            <div className="relative">
                                <svg
                                    onClick={() => { setPasswordCText(!passwordCText) }}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute right-4 top-1/2 transform -translate-y-1/2 size-6 text-zinc-500 pt-2">
                                    {passwordCText ? (
                                        <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></>) :
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    }
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button type="submit" className='border border-sky-500 py-2 px-4 rounded-lg bg-blue-500 text-white w-full'>Gửi</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>);
}


