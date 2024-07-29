import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
            <div className="relative w-screen h-screen">
                <img className="h-[100%] object-cover mx-auto" src="/../assets/images/404.svg" alt="404" />
                <Link
                    to="/"
                    className="
                    px-4 py-2 rounded bg-blue-800 text-white
                    absolute top-1/2 left-1/2
                    transform -translate-x-1/2 -translate-y-1/2
                    shadow-lg hover:bg-blue-600
                    "
                >
                    Go Home
                </Link>
            </div>
        </>
    );
}
