<template>
<div>
  <CommonHeader :app-id="appId" />
  <div class="deploy-title">
    <ul>
      <li><span>版本号：{{ deploymentInfo.target_version }}</span></li>
      <li><span>创建时间：{{ timeFormat(deploymentInfo.created_at) }}</span></li>
      <li><span>创建人：{{deploymentInfo.create_by_username}}</span></li>
      <li>
        <a-popconfirm
          title="确定发布成功?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="confirmSuccess"
          :disabled="!enableConfirmSuccess(taskMap)"
        >
          <a-button :disabled="!enableConfirmSuccess(taskMap)">确认发布成功</a-button>
        </a-popconfirm>
      </li>
      <li>
        <a-popconfirm
          title="确定关闭发布?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="closeDeployment"
          :disabled="!enableCloseDeployment(taskMap)"
        >
          <a-button :disabled="!enableCloseDeployment(taskMap)">关闭发布</a-button>
        </a-popconfirm>
      </li>
      <li>
        <a-button @click="history">操作历史</a-button>
      </li>
      <li>
        <span>自动刷新 (5s)</span>
      </li>
      <li>
        <a-switch v-model:checked="autoRefresh" />
      </li>
      <li>
        <a-button @click="refresh">刷新</a-button>
      </li>
    </ul>
  </div>
  <div>
    <a-table :columns="columns" bordered :data-source="rsData" :pagination="false" :rowKey="record => record.ID">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #Name="{ text }">
        <span>{{ text.Name }}</span>
      </template>
      <template #logic="{ record }">
        <span> {{ record.LogicIdcEnv.LogicIdc.Name }} </span>
      </template>
      <template #env="{ record }">
        <span> {{ record.LogicIdcEnv.Env.Name }}</span>
      </template>
      <template #currentState="{ record }">
        {{ currentTaskState(record) }}
      </template>
      <template #subTaskState="{ record }">
        {{ subTaskStateSummary(record) }}
      </template>
      <template #action="{ record }">
        <div>
          <span v-if="showDeploy(record.ID)">
            <a-popconfirm
              title="确定发布?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deploy(record)"
            >
              <a-button type="link" >发布</a-button>
            </a-popconfirm>
          </span>
          <span v-if="showRollback(record.ID)">
            <a-popconfirm
              title="确定回滚?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="rollback(record)"
            >
              <a-button type="link" >回滚</a-button>
            </a-popconfirm>
          </span>
          <span v-if="showRedeploy(record.ID)">
            <a-popconfirm
              title="确定重新发布?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="redeploy(record)"
            >
              <a-button type="link" >重新发布</a-button>
            </a-popconfirm>
          </span>
        </div>
      </template>
      <template #expandedRowRender="{ index, record }">
        <a-table style="margin-left: 343px;width: auto;" :columns="innerColumns" :data-source="InstancesData[index]" :pagination="false" :row-key="record => record.ID">
          <template #name="{ text }">
            <a>{{ text }}</a>
          </template>
          <template #status="{ index }">
          <span>
            <a-badge :status="subTaskState(record)?.[index]?.state === 'DONE' ? 'success' : 'processing'" />
            {{ subTaskState(record)?.[index]?.state }}
          </span>
          </template>
        </a-table>
      </template>
    </a-table>
  </div>
  <div style="text-align: left; margin-top: 30px;">
    <a-button type="primary">
      <router-link :to="{ path: '/cd/biz/deploy-list', query: { appId: appId }}" >返回发布列表</router-link>
    </a-button>
  </div>
  <div v-for="(stepsList, index) in stepsLists" :key="JSON.stringify(stepsList)">
    <TaskFlow :stepsList="stepsList" :advancedDisplay="advancedDisplay" :svg-id="'deploy' + index">
<!--      <template v-slot:taskOutputEditor="slotProps">-->
<!--        <span>abde</span>-->
<!--        <span class="green">{{ JSON.stringify(slotProps) }}</span>-->
<!--      </template>-->
    </TaskFlow>
  </div>
<!--  <TaskFlow :stepsList="stepsList" :advancedDisplay="advancedDisplay"/>-->
</div>
</template>

<script lang="ts">
import {onBeforeUnmount, onMounted, provide, reactive, ref, toRefs, UnwrapRef, watch} from "vue";
import CommonHeader from "@/components/CommonHeader.vue";
import deployerRepository from "@/api/deployerRepository";
import {useRoute} from "vue-router";
import {AppRsResponse, DeploymentResponse, Targets, DeploymentBatch, InstanceTemplate, Step} from "@/utils/response";
import moment from "moment";
import * as _ from "lodash";
import * as monaco from 'monaco-editor'

export interface Deploy {
  deploymentInfo: DeploymentResponse;
  taskMap: {[key:number]: DeploymentBatch}
  deploymentId: number;
  rsData: AppRsResponse[];
  InstancesData: InstanceTemplate[][];
  autoRefresh: boolean;
  stepsLists: StepsList[];
  advancedDisplay: boolean;
}
export interface StepsList {
  [key: string]: Step;
}

export default {
  name: "DeployDetails",
  components: {
    CommonHeader,
  },
  setup() {
    const route = useRoute()
    console.log(route.query.deploymentId, route.params.appId)
    // const { appInfo } = toRefs(appState)
    const appId = ref(parseInt(route.params.appId as string, 10))
    const stateDeploy: UnwrapRef<Deploy> = reactive({
      deploymentInfo: {},
      taskMap: {},
      deploymentId: parseInt((route.query.deploymentId as string), 10),
      rsData: [],
      InstancesData: [],
      autoRefresh: true,
      stepsLists: [],
      advancedDisplay: true,
    })
    const columns = [
      {
        dataIndex: 'LogicIdcEnv', key: 'LogicIdcEnv', title: '机房环境',
        children: [
          {title: '机房', key: 'LogicIdc', dataIndex: 'LogicIdc',
            slots: { customRender: 'logic' }, align: 'center', width: 180
          },
          {title: '环境', key: 'Env', dataIndex: 'Env', width: 180,
            slots: { customRender: 'env' }, align: 'center',
          }
        ],
      },
      { dataIndex: 'Cluster', key: 'Cluster', slots: { customRender: 'Name' }, title: '集群名' },
      { key: 'CurrentState', slots: { customRender: 'currentState' }, title: '当前状态' },
      { key: 'SubTaskState', slots: { customRender: 'subTaskState' }, title: '子任务状态' },
      { title: '操作', key: 'action', slots: { customRender: 'action' }, align: 'center' },
    ]
    const innerColumns = [
      { dataIndex: 'Name', key: 'Name', title: '实例名' },
      { dataIndex: 'HostInnerIP', key: 'HostInnerIP', title: '内网IP' },
      { title: '状态', key: 'status', slots: { customRender: 'status' }, align: 'center' },
      // { dataIndex: 'User', key: 'User', title: '启动用户'},
      // { dataIndex: 'MetricEndpoint', key: 'MetricEndpoint', title: '监控采集接口' },
      // { dataIndex: 'DataDir', key: 'DataDir', title: '数据目录' },
      // { dataIndex: 'LogDir', key: 'LogDir', title: '日志目录' },
      // { dataIndex: 'WorkDir', key: 'WorkDir', title: '工作目录' },
    ]
    const timer = ref()
    provide('advancedDisplay', stateDeploy.advancedDisplay)
    provide('projectId', 1)

    const workflowRedo = (stepName: string) => {
      console.log('work flow redo', stepName)
    }
    provide('monaco', monaco)
    provide('isRedo', false)
    provide('workflowRedo', workflowRedo)

    const queryDeploy = async () => {
      try {
        stateDeploy.deploymentInfo = await deployerRepository.queryDeployByDid(stateDeploy.deploymentId)
        const tasks = await deployerRepository.getDeploymentBatchById(stateDeploy.deploymentId)
        stateDeploy.stepsLists = tasks.map(t => stateDeploy.advancedDisplay ? t.resolution.steps : t.display_resolution.steps)
        stateDeploy.taskMap = tasks.reduce((m, v) => {
          const rsId = v.task.input['replica_set_id'] as number
          m[rsId] = v
          return m
        }, {} as {[key: number]: DeploymentBatch})
        const data = await queryRsByRsId() || []
        const rsIds = stateDeploy.deploymentInfo?.targets?.map((t: Targets) => t.ReplicaSetID) || []
        stateDeploy.InstancesData = []
        stateDeploy.rsData = data.filter((d: AppRsResponse) => {
          if (rsIds.includes(d.ID)) {
            const instances = stateDeploy.deploymentInfo?.targets?.filter((t: Targets) => t.ReplicaSetID === d.ID)?.[0].Instances || []
            stateDeploy.InstancesData.push(instances)
            return d
          }
        })

        // console.log(data, ';;;;;', rsIds, stateDeploy.rsData, stateDeploy.taskMap, stateDeploy)
      } catch (e) {
        console.error(e)
      }
    }

    const refresh = () => {
      queryDeploy()
    }

    const timeFormat = (value: string) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
    const queryRsByRsId = async () => {
      return await deployerRepository.getAllRsByAppId(appId.value)
    }

    const rollback = async (record: AppRsResponse) => {
      await deployerRepository.confirmDeploymentReplicaSetStep(stateDeploy.deploymentId, record.ID, 'confirm_ok', 'NO')
      refresh()
    }

    const showRollback = (id: number) => {
      const task = stateDeploy.taskMap?.[id]
      return task && task.resolution.steps['confirm_ok'].state === 'BLOCKED'
    }

    const deploy = async (record: AppRsResponse) => {
      await deployerRepository.confirmDeploymentReplicaSetStep(stateDeploy.deploymentId, record.ID, 'confirm_start', 'YES')
      refresh()
    }

    const showDeploy = (id: number) => {
      const task = stateDeploy.taskMap?.[id]
      return task && task.resolution.steps['confirm_start'].state === 'BLOCKED'
    }

    const redeploy = async (record: AppRsResponse) => {
      await deployerRepository.redoDeploymentReplicaSetStep(stateDeploy.deploymentId, record.ID, 'confirm_start')
      refresh()
    }

    const showRedeploy = (id: number) => {
      const task = stateDeploy.taskMap?.[id]
      return task && task.resolution.steps['confirm_rollback'].state === 'BLOCKED'
    }

    const history = async () => {
      console.log('history')
    }

    const confirmSuccess = async () => {
      for (let i = 0; i < stateDeploy.rsData.length; i++) {
        let id = stateDeploy.rsData[i].ID
        try {
          await deployerRepository.confirmDeploymentReplicaSetStep(stateDeploy.deploymentId, id, 'confirm_ok', 'YES')
        } catch (e) {
          console.error(e)
        }
      }
      refresh()
    }

    const enableConfirmSuccess = (taskMap: {[key:number]: DeploymentBatch}) => {
      for (let k in taskMap) {
        let task = taskMap[k]
        if (task.resolution.steps['confirm_ok'].state !== 'BLOCKED') {
          return false
        }
      }
      return true
    }

    const closeDeployment = async () => {
      for (let i = 0; i < stateDeploy.rsData.length; i++) {
        let id = stateDeploy.rsData[i].ID
        try {
          await deployerRepository.confirmDeploymentReplicaSetStep(stateDeploy.deploymentId, id, 'confirm_rollback', 'YES')
        } catch (e) {
          console.error(e)
        }
      }
      refresh()
    }

    const enableCloseDeployment = (taskMap: {[key:number]: DeploymentBatch}) => {
      for (let k in taskMap) {
        let task = taskMap[k]
        if (task.resolution.steps['confirm_rollback'].state !== 'BLOCKED') {
          return false
        }
      }
      return true
    }

    const currentTaskState = (r: AppRsResponse) => {
      try {
        let task = stateDeploy.taskMap?.[r.ID]
        if (task === null || task === undefined) {
          return '未知状态'
        }

        const confirmStart = task?.resolution?.steps['confirm_start']
        const confirmOK = task?.resolution?.steps['confirm_ok']
        const confirmRollback = task?.resolution?.steps['confirm_rollback']

        if (confirmRollback.state === 'DONE') {
          return '回滚成功'
        }
        if (confirmRollback.state === 'BLOCKED') {
          return '回滚完成'
        }
        if (confirmOK.state === 'DONE' && confirmOK.output['value'] !== 'YES') {
          return '回滚中'
        }
        if (confirmOK.state === 'DONE' && confirmOK.output['value'] === 'YES') {
          return '发布成功'
        }
        if (confirmOK.state === 'BLOCKED') {
          return '发布完成'
        }
        if (confirmStart.state === 'DONE') {
          return '发布中'
        }
        if (confirmStart.state === 'BLOCKED') {
          return '等待发布'
        }
      } catch (e) {
        console.error(e)
      }
    }

    const subTaskState = (r: AppRsResponse) => {
      try {
        let task = stateDeploy.taskMap?.[r.ID]
        if (task === null || task === undefined) {
          return null
        }

        const targets = task?.task?.input['targets'] as any[]
        const subTaskStates: any[] = _.map(targets, () => ({}))
        // console.log(_.map(targets, () => ({})))

        const confirmStart = task?.resolution?.steps['confirm_start']
        const confirmOK = task?.resolution?.steps['confirm_ok']
        const confirmRollback = task?.resolution?.steps['confirm_rollback']

        const deployForEachInstance = task?.resolution?.steps['deploy_for_each_instance']
        const rollbackForEachInstance = task?.resolution?.steps['rollback_for_each_instance']

        if (rollbackForEachInstance.children) {
          const children = rollbackForEachInstance.children
          _.each(subTaskStates, (s, i) => {
            s.stage = 'rollback'
            s.state = children[i]['state']
          })
          return subTaskStates
        }

        if (confirmOK.state === 'DONE' && confirmOK.output.value === 'NO') {
          _.each(subTaskStates, (s, i) => {
            s.stage = 'rollback'
            s.state = 'TODO'

            const subTask = task.resolution.steps[`rollback_for_each_instance-${i}`]
            if (subTask) {
              s.state = subTask.state
            }
          })
          return subTaskStates
        }

        if (deployForEachInstance.children) {
          const children = deployForEachInstance.children
          _.each(subTaskStates, (s, i) => {
            s.stage = 'deploy'
            s.state = children[i]['state']
          })
          return subTaskStates
        }

        if (confirmOK.state === 'TODO') {
          _.each(subTaskStates, (s, i) => {
            s.stage = 'deploy'
            s.state = 'TODO'

            const subTask = task.resolution.steps[`deploy_for_each_instance-${i}`]
            if (subTask) {
              s.state = subTask.state
            }
          })
          return subTaskStates
        }
      } catch (e) {
        console.error(e)
      }
    }

    const subTaskStateSummary = (r: AppRsResponse) => {
      const subs = subTaskState(r) || []
      const total = subs.length
      const done = _.filter(subs, (s) => s.state === 'DONE').length
      return `${done}/${total}`
    }

    const watchRefresh = () => {
      timer.value = setInterval(() => {
        if (stateDeploy.autoRefresh) {
          queryDeploy()
        } else {
          clearInterval(timer.value)
        }
      }, 5000)
    }

    watch(() => stateDeploy.autoRefresh, (value) => {
      if (value) {
        watchRefresh()
      }
    })

    onMounted(() => {
      queryDeploy()

      watchRefresh()
    })

    onBeforeUnmount(() => {
      clearInterval(timer.value)
    })

    return {
      columns,
      innerColumns,
      appId,
      ...toRefs(stateDeploy),
      timeFormat,
      rollback,
      showRollback,
      deploy,
      showDeploy,
      redeploy,
      showRedeploy,
      history,
      confirmSuccess,
      enableConfirmSuccess,
      closeDeployment,
      enableCloseDeployment,
      currentTaskState,
      subTaskState,
      subTaskStateSummary,
      refresh,
    }
  }
}
</script>

<style scoped lang="less">
.deploy-title {
  ul {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0;

    li {
      margin-right: 15px;
    }
  }
}

</style>
