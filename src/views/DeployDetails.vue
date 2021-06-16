<template>
<div>
  <CommonHeader :info="appInfo"/>
  <div class="deploy-title">
    <ul>
      <li><span>版本号：{{ deploymentInfo.target_version }}</span></li>
      <li><span>创建时间：{{ timeFormat(deploymentInfo.created_at) }}</span></li>
      <li><a-button>重新发布</a-button></li>
      <li><a-button>关闭发布</a-button></li>
      <li><a-button>操作历史</a-button></li>
    </ul>
  </div>
</div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, toRefs, UnwrapRef} from "vue";
import {appState} from "@/utils/store";
import CommonHeader from "@/components/CommonHeader.vue";
import deployerRepository from "@/api/deployerRepository";
import {useRoute} from "vue-router";
import {DeploymentResponse} from "@/utils/response";
import moment from "moment";

export interface Deploy {
  deploymentInfo: DeploymentResponse;
  deploymentId: number;
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
      deploymentId: parseInt((route.query.deploymentId as string), 10)
    })

    const queryDeploy = async () => {
      try {
        stateDeploy.deploymentInfo = await deployerRepository.queryDeployByDid(stateDeploy.deploymentId)
      } catch (e) {
        console.error(e)
      }
    }
    const timeFormat = (value: string) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }

    onMounted(() => {
      queryDeploy()
    })

    return {
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
