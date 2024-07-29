import CardProduct from './Card';
import React from 'react';

export default function ListProduct({ listProduct }) {
    return (<>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 md:gap-4 lg:gap-8 sm:grid-cols-1">
            {
                listProduct && listProduct.map((p, i) => (
                    <div className="col-span-1" key={i}>
                        <CardProduct product={p} />
                    </div>
                ))
            }
        </div>
    </>);
}
