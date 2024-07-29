import React, { useEffect, useState } from 'react';
import Http from '../../../../utils/http';
import { formatVND } from '../../../../utils/Hepers';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function CategoryProduct({ ListCategory }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            if (ListCategory && ListCategory.length !== 0) {
                try {
                    // Sử dụng map để tạo mảng các promise từ các yêu cầu GET
                    const requests = ListCategory.map(c =>
                        Http.get(`/category/${c.slug}`)
                    );

                    // Sử dụng Promise.all để chờ tất cả các yêu cầu hoàn thành
                    const responses = await Promise.all(requests);

                    // Tách dữ liệu từ các phản hồi và cập nhật trạng thái
                    const newData = responses.map(response => response.data);
                    setData(newData);
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu:', error);
                }
            }
        };

        fetchData();
    }, [ListCategory]);

    return (
        <>
            {data?.map((d, i) => (<Category data={d.product} logo_category={d.logo_category} key={i} />))}
        </>
    );
}

function Category({ data, logo_category }) {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4, // Điều chỉnh số slide hiển thị trên mỗi hàng
        slidesToScroll: 4,
        nextArrow: false, // Ẩn nút next
        prevArrow: false
    };

    return (<>
        <div className="mb-6 lg:px-24 md:px-4">
            <div className="w-full items-center justify-items-center block my-6">
                <img alt={1} className="h-[35px] w-auto m-auto" src={logo_category} />
            </div>
            <div className='justify-between m-auto'>
                <Slider {...settings}>
                    {data.map((p) => (
                        <Product key={p.name} product={p} />
                    ))}
                </Slider>
            </div>

        </div>
    </>);
}

function Product({ product }) {
    return (
        <div className="max-w-[280px] m-auto">
            <div className="item bg-[#323232] py-6 rounded-[24px] text-white" key={product.id}>
                <a href={`/product/${product.slug}`} className="main-contain">
                    <div className="img-slide">
                        <img data-src={product.imgSrc} className="lazyloaded m-auto h-auto" alt={product.name} width="240"
                            src={product.avatar[0]} />
                    </div>
                    <h3 className='text-center my-4 text-white text-base'>{product.name}</h3>
                </a>
            </div>
        </div>
    );
}
