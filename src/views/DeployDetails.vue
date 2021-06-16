<template>
<div>
  <CommonHeader :info="appInfo" />
  <div class="deploy-title">
    <ul>
      <li><span>版本号：{{ deploymentInfo.target_version }}</span></li>
      <li><span>创建时间：{{ timeFormat(deploymentInfo.created_at) }}</span></li>
      <li><a-button>重新发布</a-button></li>
      <li><a-button>关闭发布</a-button></li>
      <li><a-button>操作历史</a-button></li>
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
          <span>
          <a >{{ record.ID }}</a>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, toRefs, UnwrapRef} from "vue";
import {appState} from "@/utils/store";
import CommonHeader from "@/components/CommonHeader.vue";
import deployerRepository from "@/api/deployerRepository";
import {useRoute} from "vue-router";
import {AppRsResponse, DeploymentResponse, Targets} from "@/utils/response";
import moment from "moment";

export interface Deploy {
  deploymentInfo: DeploymentResponse;
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
    console.log(route.query.deploymentId)
    const { appInfo } = toRefs(appState)
    const stateDeploy: UnwrapRef<Deploy> = reactive({
      deploymentInfo: {},
      deploymentId: parseInt((route.query.deploymentId as string), 10),
      rsData: [],
    })
    const columns = [
      { dataIndex: 'ID', key: 'ID', title: 'ID' },
      { dataIndex: 'Cluster', key: 'Cluster', slots: { customRender: 'Name' }, title: '集群名' },
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
      { title: '操作', key: 'action', slots: { customRender: 'action' }, align: 'center'},
    ]
    const pagination = reactive({
      showSizeChanger: true
    })

    const queryDeploy = async () => {
      try {
        stateDeploy.deploymentInfo = await deployerRepository.queryDeployByDid(stateDeploy.deploymentId)
        const data = await queryRsByRsId()
        const rsIds = stateDeploy.deploymentInfo?.targets?.map((t: Targets) => t.ReplicaSetID) || []
        stateDeploy.rsData = data.filter((d: AppRsResponse) => rsIds.includes(d.ID))

        console.log(data, ';;;;;', rsIds, stateDeploy.rsData)
      } catch (e) {
        console.error(e)
      }
    }
    const timeFormat = (value: string) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
    const queryRsByRsId = async () => {
      return await deployerRepository.getAllRsByAppId(appInfo.value.ID)
    }

    onMounted(() => {
      queryDeploy()
    })

    return {
      pagination,
      columns,
      appInfo,
      ...toRefs(stateDeploy),
      timeFormat,
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
