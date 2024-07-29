import { useEffect, useState } from "react";

export default function useStickyNavbar() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const sticky = window.scrollY > 100; // Thay đổi 100 thành độ nhất định của bạn
            setIsSticky(sticky);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return isSticky;
}
