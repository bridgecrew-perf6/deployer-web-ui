export interface BarItem {
  id: number;
  icon?: string;
  path: string;
  name: string;
  route?: string;
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
  EnvVars?: {[key: string]: string}[]
  LogDir?: string;
  MetricEndpoint?: string;
  User?: string;
  WorkDir?: string;
  HostID?: number;
  HostInnerIP?: string;
  ID?: number;
  Name?: string;
}
export interface Packages {
  Release?: number;
  Version?: string;
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

export interface Comment {
  id: string;
  created: string;
  updated: string;
  content: string;
}

export interface Task {
  batch: string;
  comments: Comment[];
  created: string;
  errors: string;
  id: string;
  input: {
    [key: string]: any
  };
  last_activity: string;
  last_start: string;
  last_stop: string;
  resolution: string;
  result: {
    [key: string]: any
  };
  state: string;
  steps_done: number;
  steps_total: number;
  tags: {
    [key: string]: string
  };
  template_name: string;
  title: string;
}

export interface Step {
  name: string;
  description: string;
  output: {
    [key: string]: any
  };
  error: string;
  state: string;
  try_count: number;
  max_retries: number;
  last_run: string;
  dependencies: string[];
  foreach_strategy: string;
  tags: {
    [key:string]: string
  };
  children?: any;
}

export interface Resolution {
  created: string;
  id: string;
  instance_id: number;
  last_start: string;
  last_stop: string;
  next_retry: string;
  run_count: number;
  run_max: number;
  state: string;
  steps: {
    [key: string]: Step;
  },
  task_id: string;
  task_title: string;
}

export interface DeploymentBatch {
  task: Task;
  resolution: Resolution;
}
