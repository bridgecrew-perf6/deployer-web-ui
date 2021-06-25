import request from "@/utils/request";
import {
    AppRsResponse, BarItem, BizAppResponse, BizResponse,
    DeploymentResponse, LoginResponse, Page, DeploymentBatch
} from "@/utils/response";


const API = '/api/v1'
const ApiLogin = '/api/v1/sso/login';

const ApiBiz = `${API}/my/biz`;
const ApiApp = `${API}/my/app`;
const ApiDeploy = `${API}/my/deployment`;

let ApiBar = '/api/my/bar';

if (window.location.hostname.endsWith('dev.ops.sumscope.com')) {
    ApiBar = 'http://menu.dev.ops.sumscope.com:3000' + ApiBar;
} else if (window.location.hostname.endsWith('ops.sumscope.com')) {
    ApiBar = 'http://menu.ops.sumscope.com' + ApiBar;
}

export default {
    queryBar: () => request.get<BarItem[]>(`${ApiBar}`),
    login: () => request.get<LoginResponse>(`${ApiLogin}`),

    getBiz: () => request.get<BizResponse[]>(`${ApiBiz}`),
    getBizAllApp: (bizId: number) => request.get<BizAppResponse[]>(`${ApiBiz}/${bizId}/app`),
    getAppByAppId: (appId: number) => request.get<BizAppResponse>(`${ApiApp}/${appId}`),
    getAllRsByAppId: (appId: number) => request.get<AppRsResponse[]>(`${ApiApp}/${appId}/rs`),

    addDeploymentByAppId: (appId: number, params: any) => request.post<DeploymentResponse>(`${ApiApp}/${appId}/deployment`, params),
    deploymentList: (appId: number, params?: any) => request.get<Page>(`${ApiApp}/${appId}/deployment`, params),

    queryDeployByDid: (deploymentId: number) => request.get<DeploymentResponse>(`${ApiDeploy}/${deploymentId}`),

    getDeploymentBatchById: (deploymentId: number) => request.get<DeploymentBatch[]>(`${ApiDeploy}/${deploymentId}/batch`),

    confirmDeploymentReplicaSetStep: (deploymentId: number, rsId: number, stepName: string, value: string) =>
        request.put<void>(`${ApiDeploy}/${deploymentId}/batch/replicaset/${rsId}/step/${stepName}/confirm`, {value}),

    redoDeploymentReplicaSetStep: (deploymentId: number, rsId: number, stepName: string) =>
        request.post<void>(`${ApiDeploy}/${deploymentId}/batch/replicaset/${rsId}/step/${stepName}/redo`, {})
}
