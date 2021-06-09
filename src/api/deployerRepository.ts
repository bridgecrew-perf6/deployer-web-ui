import request from "@/utils/request";
import {BizResponse, LoginResponse} from "@/utils/response";


const API = '/api/v1'
const ApiLogin = '/api/v1/sso/login';

const ApiBiz = `${API}/my/biz`


export default {
    login: () => request.get<LoginResponse>(`${ApiLogin}`),

    getBiz: () => request.get<BizResponse[]>(`${ApiBiz}`),
    getBizAllApp: (bizId: number) => request.get(`${ApiBiz}/${bizId}/app`),
}

