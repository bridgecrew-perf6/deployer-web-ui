import request from "@/utils/request";

// const API = '/api/v1'
const ApiLogin = '/api/v1/sso/login';

export default {
    login: () => request.get(`${ApiLogin}`).catch(err => console.error(err))
}
