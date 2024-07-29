import { useEffect, useState } from "react";
import styles from "../cart.module.scss";
import Http from "../../../../utils/http";


export function MethodPayment({ setDataSubmit }) {
    const [payment, setPayment] = useState([]);
    const [selected, setSelected] = useState({}); // Phướng thức thanh toán được chọn

    useEffect(() => {
        Http.get("/payment/")
            .then(res => {
                setPayment(res);
                setSelected(res[0]);
            })

    }, []);

    useEffect(() => {
        setDataSubmit((vl) => ({
            ...vl,
            address: {
                ...vl.address,
                payment_id: selected.id
            }
        }));
    }, [selected]);

    return (<>
        <div className={`${styles.body} pb-2 `}>
            <div className={`w-[50%] m-auto bg-[#fff] shadow px-8 pt-3 pb-4`}>
                <h4 className="font-bold text-xl mb-4 mt-2">Phương thức thanh toán</h4>
                {payment.map((p) => (
                    <div
                        key={p.name}
                        className={` flex mb-4
                    body py-4 rounded-lg px-6 hover:border-black
                    hover:border-double cursor-pointer border gap-4 ${selected?.name === p.name ? "border-black" : ""}`}
                        onClick={() => { setSelected(p) }}
                    >
                        <div className="flex-col">
                            <img src={p.icon} alt={p.name} height="40px" width="44px" />
                        </div>
                        <div className="flex-col">
                            <h3 className="text-base">{p.name}</h3>
                            <p className="text-base">{p.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>);
}
