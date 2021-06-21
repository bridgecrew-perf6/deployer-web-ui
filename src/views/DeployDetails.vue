<template>
<div>
  <CommonHeader :app-id="appId" />
  <div class="deploy-title">
    <ul>
      <li><span>版本号：{{ deploymentInfo.target_version }}</span></li>
      <li><span>创建时间：{{ timeFormat(deploymentInfo.created_at) }}</span></li>
      <li><a-button @click="reissue">重新发布</a-button></li>
      <li><a-button @click="closePublishing">关闭发布</a-button></li>
      <li><a-button @click="history">操作历史</a-button></li>
    </ul>
  </div>
  <div>
    <a-table :columns="columns" bordered :data-source="rsData" :pagination="pagination" :rowKey="record => record.ID">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #Name="{ text }">
        <span>{{ text.Name }}</span>
      </template>
      <template #logic="{ record }">
        <span> {{ record.LogicIdcEnv.LogicIdc.Name }}</span>
      </template>
      <template #env="{ record }">
        <span> {{ record.LogicIdcEnv.Env.Name }}</span>
      </template>
      <template #action="{ record }">
        <div>
          <span v-if="showDeploy(record.ID)">
            <a-button type="link" @click="deploy(record)">发布</a-button>
          </span>
          <span v-if="showRollback(record.ID)">
            <a-button type="link" @click="rollback(record)">回滚</a-button>
          </span>
          <span v-if="showRedeploy(record.ID)">
            <a-button type="link" @click="redeploy(record)">重新发布</a-button>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, toRefs, UnwrapRef} from "vue";
import CommonHeader from "@/components/CommonHeader.vue";
import deployerRepository from "@/api/deployerRepository";
import {useRoute} from "vue-router";
import {AppRsResponse, DeploymentResponse, Targets, DeploymentBatch} from "@/utils/response";
import moment from "moment";

export interface Deploy {
  deploymentInfo: DeploymentResponse;
  taskMap: {[key:number]: DeploymentBatch}
  deploymentId: number;
  rsData: AppRsResponse[];
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
    })
    const columns = [
      {
        dataIndex: 'LogicIdcEnv', key: 'LogicIdcEnv', title: '机房环境',
        children: [
          {title: '机房', key: 'LogicIdc', dataIndex: 'LogicIdc',
            slots: { customRender: 'logic' }, align: 'center',
          },
          {title: '环境', key: 'Env', dataIndex: 'Env',
            slots: { customRender: 'env' }, align: 'center',
          }
        ],
      },
      { dataIndex: 'Cluster', key: 'Cluster', slots: { customRender: 'Name' }, title: '集群名' },
      { title: '操作', key: 'action', slots: { customRender: 'action' }, align: 'center'},
    ]
    const pagination = reactive({
      showSizeChanger: true
    })

    const queryDeploy = async () => {
      try {
        stateDeploy.deploymentInfo = await deployerRepository.queryDeployByDid(stateDeploy.deploymentId)
        const tasks = await deployerRepository.getDeploymentBatchById(stateDeploy.deploymentId)
        stateDeploy.taskMap = tasks.reduce((m, v) => {
          const rsId = v.task.input['replica_set_id'] as number
          m[rsId] = v
          return m
        }, {} as {[key: number]: DeploymentBatch})
        const data = await queryRsByRsId() || []
        const rsIds = stateDeploy.deploymentInfo?.targets?.map((t: Targets) => t.ReplicaSetID) || []
        stateDeploy.rsData = data.filter((d: AppRsResponse) => rsIds.includes(d.ID))

        // console.log(data, ';;;;;', rsIds, stateDeploy.rsData)
      } catch (e) {
        console.error(e)
      }
    }

    const timeFormat = (value: string) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
    const queryRsByRsId = async () => {
      return await deployerRepository.getAllRsByAppId(appId.value)
    }

    const rollback = async (record: AppRsResponse) => {
      console.log('rollback', record)
    }

    const showRollback = (id: number) => {
      const task = stateDeploy.taskMap[id]
      return task && task.resolution.steps['confirm_ok'].state === 'BLOCKED'
    }

    const deploy = async (record: AppRsResponse) => {
      console.log('deploy', record)
    }

    const showDeploy = (id: number) => {
      const task = stateDeploy.taskMap[id]
      return task && task.resolution.steps['confirm_start'].state === 'BLOCKED'
    }

    const redeploy = async (record: AppRsResponse) => {
      console.log('redoploy', record)
    }

    const showRedeploy = (id: number) => {
      const task = stateDeploy.taskMap[id]
      return task && task.resolution.steps['confirm_rollback'].state === 'BLOCKED'
    }

    const reissue = async () => {
      console.log('reissue 重新发布')
    }
    const closePublishing = async () => {
      console.log('关闭发布')
    }
    const history = async () => {
      console.log('history')
    }

    onMounted(() => {
      queryDeploy()
    })

    return {
      pagination,
      columns,
      appId,
      ...toRefs(stateDeploy),
      timeFormat,
      rollback,
      showRollback,
      deploy,
      showDeploy,
      redeploy,
      showRedeploy,
      reissue,
      closePublishing,
      history,
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
