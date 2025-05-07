import axios from "axios";
import { encrypt, decrypt } from "./encdec";

export async function secureFetch(url, request_data = {}, method = 'POST', api_key, auth_token = null) {
    try {
        console.log("In secure fetch", request_data);
        const req = request_data ?? {};
        const encData = encrypt(JSON.stringify(req));

        const headers = {
            "api-key": api_key,
            "Content-Type": "text/plain",
        };

        if (auth_token) {
            headers["auth_token"] = `${auth_token}`;
        }

        const axiosConfig = {
            method,
            url,
            headers,
            data: encData
        };

        try {
            const resp = await axios(axiosConfig);
            console.log("resp: ", resp);
            const result = resp.data;
            console.log("result: ", result);
            const data_ = decrypt(result);
            console.log("Data: ", data_);
            return data_;
        } catch (error) {
            console.log("Error in secure Fetch: ", error);
        }


    } catch (error) {
        console.error(error);
        return error;
    }
}