import React from "react";

const StarRatingDisplay = ({ starCount }) => {
    const totalStars = 5;

    return (
        <div className="flex">
            {[...Array(totalStars)].map((_, index) => {
                const starColor =
                    index < starCount ? "text-yellow-500" : "text-gray-300";

                return (
                    <svg
                        className={`w-6 h-6 cursor-pointer transition fill-current ${starColor}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        key={index}
                    >
                        <polygon points="9.9, 1.1, 7.5, 6.9, 1.6, 7.8, 6, 11.8, 4.9, 17.7, 9.9, 14.6, 15, 17.7, 13.9, 11.8, 18.3, 7.8, 12.4, 6.9" />
                    </svg>
                );
            })}
        </div>
    );
};

export default StarRatingDisplay;
