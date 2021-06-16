import request from "@/utils/request";
import {
    AppRsResponse, BizAppResponse, BizResponse,
    DeploymentResponse, LoginResponse, Page
} from "@/utils/response";


const API = '/api/v1'
const ApiLogin = '/api/v1/sso/login';

const ApiBiz = `${API}/my/biz`;
const ApiApp = `${API}/my/app`;
const ApiDeploy = `${API}/my/deployment`;


export default {
    login: () => request.get<LoginResponse>(`${ApiLogin}`),

    getBiz: () => request.get<BizResponse[]>(`${ApiBiz}`),
    getBizAllApp: (bizId: number) => request.get<BizAppResponse[]>(`${ApiBiz}/${bizId}/app`),
    getAppByAppId: (appId: number) => request.get<BizAppResponse>(`${ApiApp}/${appId}`),
    getAllRsByAppId: (appId: number) => request.get<AppRsResponse[]>(`${ApiApp}/${appId}/rs`),

    addDeploymentByAppId: (appId: number, params: any) => request.post(`${ApiApp}/${appId}/deployment`, params),
    deploymentList: (appId: number) => request.get<Page>(`${ApiApp}/${appId}/deployment`),

    queryDeployByDid: (deploymentId: number) => request.get<DeploymentResponse>(`${ApiDeploy}/${deploymentId}`),
}

