import React from "react";

export default function Pagination({ pagination, handleChangePage }) {
    const { current_page, total, last_page } = pagination;
    return (
        <>
            <nav
                className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
                aria-label="Table navigation"
            >
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li>
                        <button
                            onClick={() => handleChangePage(1)}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                        >
                            First
                        </button>
                    </li>
                    {[...Array(last_page)].map((_, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleChangePage(index + 1)}
                                className={`flex items-center justify-center px-3 h-8 leading-tight ${
                                    index + 1 === current_page
                                        ? "bg-gray-700 text-white"
                                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                                }`}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => handleChangePage(last_page)}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                        >
                            Last
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
}
