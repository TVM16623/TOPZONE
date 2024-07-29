import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Http from "../../../utils/http";
import { Link } from "react-router-dom";
export default function Carousel() {
    const [banner, setBanner] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await Http.get('/banner');
                setBanner(response.data);
            } catch (error) {
                console.error('Error fetching data category: ', error);
            }

        })();
    }, []);

    var settings = {
        dots: true,
        slidesToShow: 1,
    };

    return (
        <>
            {banner && <Slider {...settings} >

                {banner?.map((item, index) => (
                    <div key={index}>
                        <img className="w-screen" src={item.image} />
                    </div>
                ))}

            </Slider>}


        </>
    );
}
