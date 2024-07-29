export const STATUS = {
    DA_DAT: "DA_DAT",
    DA_THANH_TOAN: "DA_THANH_TOAN",
    DA_XAC_NHAN: "DA_XAC_NHAN",
    DANG_GIAO: "DANG_GIAO",
    DA_HUY: "DA_HUY",
    DA_GIAO: "DA_GIAO",
};

export const STATUS_TEXT = (status) => {
    switch (status) {
        case STATUS.DA_DAT:
            return "Đã đặt";
        case STATUS.DA_THANH_TOAN:
            return "Đã thanh toán";
        case STATUS.DA_XAC_NHAN:
            return "Đã xác nhận";
        case STATUS.DANG_GIAO:
            return "Đang giao";
        case STATUS.DA_HUY:
            return "Đã hủy";
        case STATUS.DA_GIAO:
            return "Đã giao thành công";
        default:
            return "";
    }
};
