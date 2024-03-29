<template>
<div>
  <CommonHeader :app-id="appId" :add-deploy="true"/>
  <div>
    <a-table :columns="columns" :data-source="deployData"
             @change="paginationChange"
             :scroll="{x: '1100px'}"
             :pagination="pagination" :rowKey="record => record.id">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #action="{ record }">
        <span>
          <router-link :to="{ path: `deploy-list/${appId}/details`, query: { deploymentId: record.id } }">发布详情</router-link>
        </span>
      </template>
    </a-table>
  </div>
</div>
</template>

<script lang="ts">
import {useRoute} from "vue-router";
import CommonHeader from "@/components/CommonHeader.vue";
import {onMounted, reactive, ref} from "vue";
import deployerRepository from "@/api/deployerRepository";
import {DeploymentResponse} from "@/utils/response";
import {TableState} from "ant-design-vue/es/table/interface";

export default {
  name: "DeployList",
  components: {
    CommonHeader,
  },
  setup() {
    const route = useRoute()
    const appId = ref(parseInt(route.query.appId as string, 10))
    // const { appInfo } = toRefs(appState)
    // console.log(route.query.appId, '[[[[', appInfo)
    const columns = [
      { dataIndex: 'target_version', key: 'target_version', title: '目标版本', fixed: 'left', width: 150 },
      { dataIndex: 'current_version', key: 'current_version', title: '原始版本' },
      { dataIndex: 'app_name', key: 'app_name', title: '应用名' },
      { dataIndex: 'app_display_name', key: 'app_display_name', title: '应用显示名' },
      { dataIndex: 'state', key: 'state', title: '状态' },
      { dataIndex: 'result', key: 'result', title: '结果' },
      { dataIndex: 'create_by_username', key: 'create_by_username', title: '创建人' },
      { dataIndex: 'comment', key: 'comment', title: '备注' },
      { title: '操作', key: 'action', slots: { customRender: 'action' }, align: 'center', fixed: 'right', width: 120},
    ]
    const pagination = reactive({
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
      total: 1,
    })
    const deployData = ref<DeploymentResponse[]>([])

    const getDeploymentList = async () => {
      const appId = parseInt((route.query.appId as string), 10)
      const value = {
        pageNumber: pagination.current - 1,
        pageSize: pagination.pageSize,
      }
      const data = await deployerRepository.deploymentList(appId, value)
      deployData.value = data.content
      pagination.total = data.totalElements
    }
    const paginationChange = (page: TableState['pagination']) => {
      pagination.current = page?.current as number
      pagination.pageSize = page?.pageSize as number
      getDeploymentList()
    }

    onMounted(() => {
      getDeploymentList()
    })

    return {
      appId,
      columns,
      deployData,
      pagination,
      paginationChange,
    }
  }
}
</script>

<style scoped>

</style>
