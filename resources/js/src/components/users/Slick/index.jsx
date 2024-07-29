import React from "react";
import Slider from "react-slick";

export default function Slick({ images }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: false, // Ẩn nút next
        prevArrow: false
    };

    return (<>
        <Slider {...settings} >
            {images?.map((item, index) => (
                <div key={index} >
                    <img className="w-full rounded-3xl h-full" src={item.image ? item.image : "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/" + item} />
                </div>
            ))}
        </Slider>
    </>);
}
