export interface LoginResponse {
    url?: string;
    token?: string;
}
export interface BindInfos {
    Ip?: string;
    Name?: string;
    Port?: number;
    Protocol?: string;
}
export interface InstanceTemplate {
    BindInfos: BindInfos[];
    DataDir?: string;
    EnvVars: {[key: string]: string}[]
    LogDir?: string;
    MetricEndpoint?: string;
    User?: string;
    WorkDir?: string;
}

export interface BizResponse {
    Comment?: string;
    CreatedAt?: string;
    DisplayName?: string;
    ID?: number;
    Name?: string;
    UpdatedAt?: string;
}

export interface BizAppResponse {
    Comment?: string;
    CreatedAt?: string;
    DisplayName?: string;
    ID?: number;
    InstanceTemplate?: InstanceTemplate;
    Level?: string;
    Name?: string;
    ReleaseInfo?: {[key: string]: string};
    UpdatedAt?: string;
}

export interface Cluster {
    Comment?: string;
    CreatedAt?: string;
    ID: number;
    InstanceTemplate?: InstanceTemplate;
    Name?: string;
    UpdatedAt?: string;
}
export interface EnvLogicIdc {
    Comment?: string;
    CreatedAt?: string;
    DisplayName?: string;
    EnvVars?: {[key: string]: string}[];
    ID: number;
    Name?: string;
    UpdatedAt?: string;
}
export interface LogicIdcEnvResponse {
    Comment?: string;
    CreatedAt?: string;
    Env?: EnvLogicIdc;
    EnvVars?: {[key: string]: string}[];
    ID: number;
    LogicIdc?: EnvLogicIdc;
    UpdatedAt?: string;
}
export interface AppRsResponse {
    Cluster?: Cluster;
    CreatedAt?: string;
    ID: number;
    InstanceTemplate?: InstanceTemplate;
    LogicIdcEnv?: LogicIdcEnvResponse;
    UpdatedAt?: string;
}
