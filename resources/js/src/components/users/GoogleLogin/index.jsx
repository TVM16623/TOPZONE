import React from "react";
import Http from "../../../utils/http";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginComponent({ onGet }) {
    const handleSuccess = async (res) => {
        // Nếu không gg không trả về jwt thì dừng
        //console.log(res.accessToken);

        if (!res?.credential) return;

        // Có jwt thì gửi lên sever xử lí
        const response = await Http.post("/auth/login/gg-callback", {
            credential: res.credential,
        });

        onGet(response);
    };

    return (
        <GoogleLogin
            clientId="869011497190-45chn705s0tajnohe3hju69vivs4qc3a.apps.googleusercontent.com"
            onSuccess={handleSuccess}
            onError={(errors) => {
                console.log(errors);
            }}
        />
    );
}
