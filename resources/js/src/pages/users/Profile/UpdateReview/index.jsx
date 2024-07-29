import { useState } from "react";
import StarRating from "../../../../components/users/StarRating";
import Http from "../../../../utils/http";
import token from "../../../../utils/token";
import toastify from "../../../../utils/toastify";

export default function UpdateReview({ isShow, setShow, reviewId }) {
    const [rating, setRating] = useState(0);
    const [formData, setFormData] = useState({
        content: "",
        rating: 0,
        image: null,
    });

    const handleUpdate = () => {
        const payload = {
            id: reviewId,
            content: formData.content,
            star: rating,
            image: formData.image,
        };

        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
        };

        Http.post(`/review/update`, payload, { headers })
            .then((res) => {
                if (res.status == "success") {
                    toastify.success(res.message);
                    setShow(false);
                    window.location.reload();
                }
            })
            .catch((err) => {
                console.error(err);
                toastify.error("Đã xảy ra lỗi");
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
                            <div className="mb-10">
                                <div className="mb-3">
                                    <StarRating
                                        rating={rating}
                                        setRating={setRating}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="content"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Nội dung đánh giá
                                    </label>
                                    <input
                                        id="content"
                                        type="text"
                                        value={formData.content}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                content: e.target.value,
                                            });
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="image"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Hình ảnh
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                image: e.target.files[0],
                                            });
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleUpdate}
                                type="button"
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
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
