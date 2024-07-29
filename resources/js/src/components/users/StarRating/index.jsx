import React, { useState } from "react";

const StarRating = ({ totalStars = 5, rating, setRating }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex">
            {[...Array(totalStars)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            className="hidden"
                            onClick={() => setRating(ratingValue)}
                        />
                        <svg
                            className={`w-6 h-6 cursor-pointer transition fill-current ${
                                ratingValue <= (hover || rating)
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                            }`}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <polygon points="9.9, 1.1, 7.5, 6.9, 1.6, 7.8, 6, 11.8, 4.9, 17.7, 9.9, 14.6, 15, 17.7, 13.9, 11.8, 18.3, 7.8, 12.4, 6.9" />
                        </svg>
                    </label>
                );
            })}
        </div>
    );
};

export default StarRating;
