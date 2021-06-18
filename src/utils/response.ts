export interface BarItem {
    icon?: string;
    path: string;
    name: string;
}
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
    BindInfos?: BindInfos[];
    DataDir?: string;
    EnvVars: {[key: string]: string}[]
    LogDir?: string;
    MetricEndpoint?: string;
    User?: string;
    WorkDir?: string;
    HostID?: number;
    HostInnerIP?: string;
    ID?: number;
    Name?: string;
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
    ID: number;
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

export interface Targets {
    ClusterName?: string;
    EnvName?: string;
    Instances?: InstanceTemplate[]
    LogicIDCEnvID?: number;
    LogicIDCName?: string;
    ReplicaSetID: number;
    SaltMasterHostID?: number;
    SaltMasterHostInnerIP?: string;
}
export interface DeploymentResponse {
    app_display_name?: string;
    app_id?: number;
    app_name?: string;
    comment?: string;
    create_by_username?: string;
    created_at?: string;
    created_by_user_id?: number;
    current_version?: string;
    id?: number;
    release_info?: {[key: string]: string};
    result?: string;
    state?: string;
    target_version?: string;
    targets?: Targets[];
    task_id?: string;
    template_id?: string;
    updated_at?: string;
    updated_by_username?: string;
}
export interface Page {
    content: DeploymentResponse[];
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
