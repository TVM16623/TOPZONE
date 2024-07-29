import { useContext, useState } from "react";
import token from "../../../../../utils/token";
import Http from "../../../../../utils/http";
import { UserContext } from '../../../../..';
import toastify from "../../../../../utils/toastify";

export default function VerifyEmail({ data, onClickCancel }) {

    const { user, setUser } = useContext(UserContext);
    const [input, setInput] = useState({
        email: token.getEmailVerify().email,
        otp: '',
    });

    const [messageFaild, setMessageFaild] = useState();

    const handleOnchangeInput = (e) => {
        console.log(messageFaild);
        setInput({ ...input, otp: e.target.value });
        setMessageFaild('');
    }

    const validate = (data) => {
        if (data.email === "") return setMessageFaild("Định dạng email không hợp lệ.");
        if (data.otp.length !== 6) return setMessageFaild("Mã otp không hợp lệ!");
    }

    return (
        <>
            <p className="block mb-2 text-base text-slate-300">
                Nhập mã xác thực được gửi về email: {token.getEmailVerify().email}
            </p>
            <form method="POST" onSubmit={(e) => {
                e.preventDefault();
                validate(input);

                console.log(input, messageFaild);

                Http.post('/auth/register/verify', input)
                    .then(data => {
                        if (data?.status === "success") {
                            setUser({
                                ...user,
                                name: data.user.name,
                                email: data.user.email,
                                isLoggedIn: true
                            });
                            token.deleteEmailVerify();
                            token.set('access_token', data.access_token)
                            token.setUser(data.user);

                            toastify.success(data.message);
                            setUpdateCart(true);
                            return navigate('/');
                        }

                    });

            }}>
                <div className="grid grid-cols-3">
                    <input
                        type="text"
                        name="otp"
                        onChange={(e) => handleOnchangeInput(e)}
                        className=" col-span-3 focus:border-white
                            block w-full px-4 py-2 placeholder-gray-400 bg-[#323232]
                            border border-black-400 placeholder-gray-600 text-gray-300
                            border-gray-700
                        "
                    />
                </div>
                <div className="flex inline pt-2">
                    <div
                        className="rounded-md w-fit
                            px-4 py-2 text-black cursor-pointer
                            bg-white border-slate-500
                            hover:bg-zinc-100 focus:outline-none
                        "
                        onClick={() => onClickCancel()}
                    >
                        Cancel
                    </div>
                    <button
                        type="submit"
                        className="ml-1 rounded-md
                            px-4 py-2 tracking-wide text-white
                            transition-colors bg-blue-500 border-black-400
                            hover:bg-blue-400 focus:outline-none focus:bg-blue-400"

                    >
                        Verify
                    </button>
                </div>
                {messageFaild !== '' && <p className="text-red-500 pt-4">{messageFaild}</p>}
            </form>



        </>);
}
