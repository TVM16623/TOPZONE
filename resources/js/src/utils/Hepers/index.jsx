const formatVND = (number) => {
    if (number === null || number === undefined) {
        return "";
    }

    let str = number.toString();

    str = str.split("").reverse().join("");

    let result = "";

    for (let i = 0; i < str.length; i++) {
        if (i > 0 && i % 3 === 0) {
            result += ".";
        }
        result += str[i];
    }

    return result.split("").reverse().join("");
};

const isEmptyOrWhitespace = (str) => {
    return str.trim().length === 0; // Xóa các khoảng trắng trong chuỗi và đếm các kí tự còn lại
};

const displaySTT = (page, size, indexNmb) => {
    return (page - 1) * size + indexNmb + 1;
};

export { formatVND, isEmptyOrWhitespace, displaySTT };
