<template>
<div>
  <CommonHeader :app-id="appId" />
  <div class="deploy-title">
    <ul>
      <li><span>版本号：{{ deploymentInfo.target_version }}</span></li>
      <li><span>创建时间：{{ timeFormat(deploymentInfo.created_at) }}</span></li>
      <li>
        <a-popconfirm
          title="确定重新发布?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="reissueConfirm"
          @cancel="reissueCancel"
        >
          <a-button >重新发布</a-button>
        </a-popconfirm>
      </li>
      <li>
        <a-popconfirm
          title="确定关闭发布?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="closePublishingConfirm"
          @cancel="closePublishingCancel"
        >
          <a-button >关闭发布</a-button>
        </a-popconfirm>
      </li>
      <li>
        <a-button @click="history">操作历史</a-button>
      </li>
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
            <a-popconfirm
              title="确定发布?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deployConfirm(record.ID)"
              @cancel="deployCancel(record.ID)"
            >
              <a-button type="link" >发布</a-button>
            </a-popconfirm>
          </span>
          <span v-if="showRollback(record.ID)">
            <a-popconfirm
              title="确定回滚?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="rollbackConfirm(record.ID)"
              @cancel="rollbackCancel(record.ID)"
            >
              <a-button type="link" >回滚</a-button>
            </a-popconfirm>
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
import {Modal} from "ant-design-vue";

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
      Modal.confirm({
        title: '确认回滚？',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      })
    }

    const showRollback = (id: number) => {
      const task = stateDeploy.taskMap[id]
      return task && task.resolution.steps['confirm_ok'].state === 'BLOCKED'
    }

    const deploy = async (record: AppRsResponse) => {
      console.log('deploy', record)
      Modal.confirm({
        title: '确认发布',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      })
    }

    const showDeploy = (id: number) => {
      const task = stateDeploy.taskMap[id]
      return task && task.resolution.steps['confirm_start'].state === 'BLOCKED'
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
    const reissueConfirm = () => {
      console.log('确定')
    }
    const reissueCancel = () => {
      console.log('取消')
    }
    const rollbackCancel = (id: number) => {
      console.log(id, '取消回滚')
    }
    const rollbackConfirm = (id: number) => {
      console.log('确认回滚', id)
    }
    const deployConfirm = (id: number) => {
      console.log('确认发布', id)
    }
    const deployCancel = (id: number) => {
      console.log('取消发布', id)
    }
    const closePublishingConfirm = () => {
      console.log('确认关闭')
    }
    const closePublishingCancel = () => {
      console.log('取消关闭')
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
      reissue,
      closePublishing,
      history,
      reissueConfirm,
      reissueCancel,
      rollbackCancel,
      rollbackConfirm,
      deployConfirm,
      deployCancel,
      closePublishingConfirm,
      closePublishingCancel,
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
