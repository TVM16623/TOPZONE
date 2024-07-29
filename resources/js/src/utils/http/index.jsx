import axios from 'axios';
import token from '../token';

const urlGlobal = window.location.origin;

const apiClient = axios.create({
    baseURL: urlGlobal,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axios.interceptors.response.use(
    response => {
        //console.log("thanh cong" + JSON.stringify(response.data.message));
        if (response.data?.access_token) {
            //console.log(`DA SET TOKEN`, response.data.access_token);
            token.set("access_token", response.data.access_token);
        }
        return response;
    },
    async error => {
        console.log("status: " + error.response.status);
        // Lỗi xác thực và có access token trong local storage
        if (error.response.status === 401 && token.has("access_token")) {
            try {
                /**
                 * Khi 1 request sever trả lổi 401 (Lỗi token) và localStorage có access token
                 * Thì do các lí do -> cách giải quyết sau
                 * Access token hết hạn -> gửi refresh token(trong cookie) để lấy access token mới rồi tiếp tục request truoc
                 */
                //console.log("Lấy access token bằng refresh token");
                const response = await apiClient.post(`${urlGlobal}/api/refresh-token`);
                //console.log("response: " + JSON.stringify(response));
                // Xóa access token, nếu thành công access token bằng refresh token thì tạo lại sau
                // Nếu không có thì xóa info user trong localStorage luôn
                token.delete("access_token");

                if (response.status === 200) { // Lấy access token thành công
                    //console.log("Lấy access token bằng refresh token thành công: " + response.data.data);
                    const access_token = response.data.data;
                    token.set("access_token", access_token);
                    //console.log("Access token : " + access_token);
                    // Bỏ access token vô header và tiếp tục request trước đó
                    error.config.headers.Authorization = `Bearer ${access_token}`;

                    return apiClient(error.config);
                } else if (response.status == 'error') {
                    console.log("error dòng 51: ");
                }

            } catch (refreshError) {
                token.delete("access_token");
                token.deleteUser();
                console.error('Lỗi ngoại lệ', refreshError);
            }
        } else if (error.response.status === 401) {
            token.deleteUser();
            token.delete("access_token");
        } else if (error.response.status === 400) {
            return error.response;
        }

        return Promise.reject(error + " => ném lỗi");
    }
);

export default class Http {
    static async #fetch(method, url, options, data, prefixAuto = true) {
        url = (prefixAuto === true) ? (urlGlobal + "/api" + url) : url;
        let response = (method === "get") ? axios.get(url, options) : axios[method](url, data, options);

        return response
            .then(data => {
                return data.data;
            })
            .catch(err => {
                console.log(`Error`, err);
                return err.response?.data;
            });
    }

    static async get(url, options = {}, prefixAuto = true) {
        return this.#fetch("get", url, options, undefined, prefixAuto);
    }

    static post(url, data, options = {}) {
        return this.#fetch("post", url, options, data)
    }

    static getAuth(url, options = {}) {
        return this.#fetch('post', url, options);
    }
}
