import { Link } from "react-router-dom";
export default function Card({ item }) {
return (
    <>
        <Link to={`/../category/${item.slug}`}>
            <div className  ="img-catesp">
                <img
                    src={item.image}
                    alt={`anh-danh-muc-${item.name}`}
                    width="169"
                    height="110"
                />
            </div>
            <span>{item.name}</span>
        </Link>
    </>
);

}
