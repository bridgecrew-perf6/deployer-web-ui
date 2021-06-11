<template>
<div>
<!--  <div class="biz-title">-->
<!--    <p>{{ bizInfo.Name }}</p>-->
<!--    <p>{{ bizInfo.DisplayName }}</p>-->
<!--    <p>{{ bizInfo.Comment }}</p>-->
<!--  </div>-->
  <CommonHeader :bizInfo="bizInfo" />
  <div>
    <a-table :columns="columns" :data-source="appList" :rowKey="record => record.ID"
             :pagination="pagination" >
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #action="{ record }">
        <span>
          <router-link to="biz/deploy-template">新建发布</router-link>
          <a>{{record.ID}}</a>
        </span>
      </template>
    </a-table>
  </div>
</div>
</template>

<script lang="ts">
import {reactive, ref, toRefs} from "vue";
import { appState } from "@/utils/store";
import CommonHeader from "@/components/CommonHeader.vue";

export default {
  name: "Biz",
  components: {
    CommonHeader,
  },
  setup() {
    const { appList, bizInfo } = toRefs(appState)
    const columns = [
      { dataIndex: 'Name', key: 'Name', title: '名字',},
      { dataIndex: 'DisplayName', key: 'DisplayName', title: '显示名',},
      { dataIndex: 'Level', key: 'Level', title: '级别'},
      { title: '操作', key: 'action', slots: { customRender: 'action' },},
    ];
    const pagination = reactive({
      showSizeChanger: true
    })

    return {
      appList,
      bizInfo,
      columns,
      pagination,
    }
  }
}
</script>

<style scoped lang="less">

</style>
