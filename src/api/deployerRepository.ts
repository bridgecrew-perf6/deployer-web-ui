import request from "@/utils/request";
import {LoginResponse} from "@/utils/response";


// const API = '/api/v1'
const ApiLogin = '/api/v1/sso/login';

export default {
    login: () => request.get<LoginResponse>(`${ApiLogin}`).catch(err => console.error(err)),
}

