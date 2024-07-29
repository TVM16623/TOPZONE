import React, { useState } from "react";
import Http from "../../../utils/http";
import token from "../../../utils/token";
import toastify from "../../../utils/toastify";

export default function Reply({ isShow, setShow, reviewId, onCloseModal }) {
    const [message, setMessage] = useState("");

    const handleReply = () => {
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const payload = {
            review_id: reviewId,
            reply: message,
        };

        Http.post(`/admin/review`, payload, {
            headers,
        })
            .then((res) => {
                setMessage("");
                setShow(false);
                onCloseModal();
                toastify.success("Trả lời thành công");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            <div
                className={
                    isShow
                        ? "overflow-y-auto overflow-x-hidden bg-opacity-50 backdrop-blur-sm fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                        : "hidden"
                }
                id="popup-modal"
            >
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                        <button
                            type="button"
                            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            onClick={() => setShow(false)}
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Hủy</span>
                        </button>
                        <div className="p-4 md:p-5">
                            <svg
                                className="mx-auto mb-4 text-gray-400 w-12 h-12"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>

                            <div className="mb-5">
                                <label
                                    for="message"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Trả lời
                                </label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    name="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập nội dung trả lời bình luận..."
                                ></textarea>
                            </div>

                            <button
                                onClick={handleReply}
                                type="button"
                                className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={() => setShow(false)}
                                type="button"
                                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
