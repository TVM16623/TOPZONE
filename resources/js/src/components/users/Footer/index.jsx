import React from 'react';

export default function Footer() {
    return (
        <footer>
            <div className="foot">
                <div className="logo-foot">
                    <a href="#">
                        <i className="topzone-logo"></i>
                    </a>
                    <a href="#">
                        <i className="topzone-autho"></i>
                    </a>
                </div>
                <ul className="list-foot">
                    <li>
                        <span>Tổng đài</span>
                        <a href="#">
                            <span>Mua hàng:</span>
                            <b>0123456789</b>
                            (7:30 - 22:00)
                        </a>
                        <a href="#">
                            <span>Khiếu nại:</span>
                            <b>0123456789</b>
                            (8:00 - 21:30)
                        </a>
                        <div className="footer-social">
                            <p className="txt">Kết nối với chúng tôi</p>
                            <a href="#" target="_blank" className="link-social">
                                <i className="iconsocial-facebook"></i>
                            </a>
                            <a href="#" target="_blank" className="link-social">
                                <i className="iconsocial-youtube"></i>
                            </a>
                            <a href="#" target="_blank" className="link-social">
                                <i className="iconsocial-zalo"></i>
                            </a>
                        </div>
                    </li>
                    <li>
                        <span>Hệ thống cửa hàng</span>
                        <a href="#">Xem 97 cửa hàng</a>
                        <a href="#">Nội quy cửa hàng</a>
                        <a href="#">Chất lượng phục vụ</a>
                        <a href="#">Chính sách bảo hành &amp; đổi trả</a>
                    </li>
                    <li>
                        <span>Hỗ trợ khách hàng</span>
                        <a href="#">Điều kiện giao dịch chung</a>
                        <a href="#">Hướng dẫn mua hàng online</a>
                        <a href="#">Chính sách giao hàng</a>
                        <a href="#">Hướng dẫn thanh toán</a>
                    </li>
                    <li>
                        <span>Về thương hiệu TopZone</span>
                        <a href="#" className="color-link">Tích điểm Quà tặng VIP</a>
                        <a href="#">Giới thiệu TopZone</a>
                        <a href="#">Bán hàng doanh nghiệp</a>
                        <a href="#">Chính sách xử lý dữ liệu cá nhân</a>
                        <a rel="nofollow" href="#" title="Xem bản mobile">Xem bản mobile</a>
                    </li>
                    <li>
                        <span>Trung tâm bảo hành TopCare</span>
                        <a href="#">Giới thiệu TopCare</a>
                    </li>
                </ul>
                <div className="text-cpr">
                    <p>
                        © 2018. Công ty cổ phần Thế Giới Di Động. GPDKKD: 0303217354 do sở KH &amp; ĐKKD cấp ngày 13/03/2008. Địa chỉ: 128 Trần Quang Khải, P. Tân Định, Q.1, TP.Hồ Chí Minh. Điện thoại: 0123456789. Email: cskh@thegioididong.com. Chịu trách nhiệm nội dung: Hồ Đức Lam. xem thêm.
                        <a target="_blank" href="#" title="Bảo mật thông tin">
                            Bảo mật thông tin
                        </a>
                        <a target="_blank" href="#" title="Quy định sử dụng">
                            Quy định sử dụng
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};
