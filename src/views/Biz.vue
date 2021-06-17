<template>
<div>
<!--  <div class="biz-title">-->
<!--    <p>{{ bizInfo.Name }}</p>-->
<!--    <p>{{ bizInfo.DisplayName }}</p>-->
<!--    <p>{{ bizInfo.Comment }}</p>-->
<!--  </div>-->
  <CommonHeader :info="bizInfo" />
  <div>
    <a-table :columns="columns" :data-source="appList" :rowKey="record => record.ID"
             :pagination="pagination" >
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #action="{ record }">
        <div style="display: flex; justify-content: space-around">
          <span>
            <a-button style="padding: 0" type="link" @click="goToDeployTemplate(record)">新建发布</a-button>
<!--            <router-link :to="{ path: 'biz/deploy-template', query: { appId: record.ID }}" >新建发布</router-link>-->
          </span>
          <span>
<!--            <router-link :to="{ path: 'biz/deploy-list', query: { appId: record.ID }}" >发布列表</router-link>-->
            <a-button style="padding: 0" type="link" @click="goToDeployList(record)">发布列表</a-button>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</div>
</template>

<script lang="ts">
import {reactive, ref, toRefs} from "vue";
import { appState } from "@/utils/store";
import CommonHeader from "@/components/CommonHeader.vue";
import { useRouter} from "vue-router";
import {BizAppResponse} from "@/utils/response";

export default {
  name: "Biz",
  components: {
    CommonHeader,
  },
  setup() {
    const router = useRouter()
    const { appList, bizInfo } = toRefs(appState)
    const columns = [
      { dataIndex: 'Name', key: 'Name', title: '名字',},
      { dataIndex: 'DisplayName', key: 'DisplayName', title: '显示名',},
      { dataIndex: 'Level', key: 'Level', title: '级别'},
      { title: '操作', key: 'action', slots: { customRender: 'action', }, align: 'center', width: '200px'},
    ];
    const pagination = reactive({
      showSizeChanger: true
    })

    const goToDeployTemplate = (record: BizAppResponse) => {
      router.push({
        path: 'biz/deploy-template',
        query: { appId: record.ID }
      })
      appState.appInfo = record
      localStorage.setItem('appInfo', JSON.stringify(record))
    }
    const goToDeployList = (record: BizAppResponse) => {
      router.push({
        path: 'biz/deploy-list',
        query: { appId: record.ID }
      })
      appState.appInfo = record
      localStorage.setItem('appInfo', JSON.stringify(record))
    }

    return {
      appList,
      bizInfo,
      columns,
      pagination,
      goToDeployTemplate,
      goToDeployList,
    }
  }
}
</script>

<style scoped lang="less">

</style>
