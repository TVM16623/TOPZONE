import { useContext, useEffect, useRef, useState } from "react";
import Http from "../../../utils/http";
import toastify from "../../../utils/toastify";
import ReactStars from "react-rating-stars-component";
import token from "../../../utils/token";
import { UserContext } from "./../../../index";

export default function ReviewProduct({
    review_id,
    show = false,
    setshow,
    review_product_id,
}) {
    const { user } = useContext(UserContext);
    const [content, setContent] = useState("");
    const [selectStart, setSelectStart] = useState(0); //lưu trữ số sao đã chọn
    const [image, setImage] = useState(null);
    const imageRef = useRef();
    useEffect(() => {
        if (show) {
            let accessToken = token.get("access_token");
            let headers = {
                Authorization: `Bearer ${accessToken}`,
            };
        }
    }, [review_id, show, review_product_id]);

    const ratingChanged = (newRating) => {
        setSelectStart(newRating);
    };

    const handleCommentChang = (e) => {
        setContent(e.target.value);
    };
    //xu ly khi chon cac anh trong file input
    const onFileUpLoadHandle = (e) => {
        setImage(e.target.files[0]);
    };
    // ham in anh ra

    const showImage = () => {
        return (
            <div className="flex justify-center">
                <img src={URL?.createObjectURL(image)} className="w-20 h-20" />
            </div>
        );
    };
    const handleSubmitStart = (e) => {
        e.preventDefault();
        let accessToken = token.get("access_token");
        let headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
        };
        if (!content || selectStart <= 0 || !image) {
            toastify.error("Bạn cần nhập đầy đủ thông tin đánh giá");
            return;
        }

        let data = {
            user_id: user.id,
            invoice_detail_id: review_id,
            content: content,
            star: selectStart,
            image: image,
        };
        try {
            console.log(data);
            Http.post("/review/create", data, {
                headers,
            }).then((res) => {
                setContent("");
                setSelectStart(0);
                setImage(null);
                setshow(false);
                toastify.success("Bạn đã gửi đánh giá thành công");
            });
        } catch (error) {
            toastify.error("Bạn cần nhập đầy đủ đánh giá");
        }

        setshow(false);
    };

    return (
        <>
            {show && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 w-full min-h-full bg-black bg-opacity-50 "
                    onClick={() => {
                        setshow(false);
                    }}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto max-h-screen overflow-y-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div className=" start text-center">
                            <div>
                                <p className="text-base text-xl font-bold mx-16 text-center">
                                    Đánh giá sản phẩm này
                                </p>
                                <p className="text-base text-sm  mx-16 text-center">
                                    Nếu đã mua sản phẩm này tại TopZone. Hãy
                                    đánh giá ngay để giúp hàng ngàn người chọn
                                    mua hàng tốt nhất bạn nhé !
                                </p>
                            </div>
                            <div className="flex justify-around h-[30px] mt-3">
                                <ReactStars
                                    count={5}
                                    onChange={ratingChanged}
                                    size={30}
                                    isHalf={true}
                                    emptyIcon={<i className="far fa-star"></i>}
                                    halfIcon={
                                        <i className="fa fa-star-half-alt"></i>
                                    }
                                    fullIcon={<i className="fa fa-star"></i>}
                                    activeColor="#ffd700"
                                />
                            </div>
                            <div className=" content justify-around flex mb-3 ">
                                <textarea
                                    className="shadow appearance-none border rounded w-[500px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-[150px]"
                                    typeof="text"
                                    placeholder="Mời bạn chia sẻ thêm cảm nhận..."
                                    onChange={handleCommentChang}
                                ></textarea>
                            </div>
                            <div className="image justify-around">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onFileUpLoadHandle}
                                    ref={imageRef}
                                    className="w-0 h-0"
                                />
                                <div className="block flex justify-center">
                                    <img
                                        src={`/../assets/images/ReviewProduct/anhreview.jpg`}
                                        className="w-10 h-30"
                                    />
                                    <button
                                        className="text-blue-600 text-base text-xl"
                                        onClick={() => {
                                            imageRef.current.click();
                                            console.log("Click");
                                        }}
                                    >
                                        Gửi ảnh thực tế
                                    </button>
                                </div>

                                {image && showImage()}
                            </div>
                            <div>
                                <button
                                    className="bg-[#000] text-sm py-3 px-5 rounded-full text-white hover:bg-slate-900 mt-2 mb-5"
                                    onClick={handleSubmitStart}
                                    // value={review_id}
                                >
                                    Gửi đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
