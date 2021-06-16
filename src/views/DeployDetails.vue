<template>
<div>
  <CommonHeader :info="appInfo"/>
  <div>
    <span>版本号：{{ deploymentInfo.target_version }}</span>
    <span>创建时间：{{ deploymentInfo.created_at }}</span>
    <a-button>重新发布</a-button>
    <a-button>关闭发布</a-button>
    <a-button>操作历史</a-button>
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

    onMounted(() => {
      queryDeploy()
    })

    return {
      appInfo,
      ...toRefs(stateDeploy),
    }
  }
}
</script>

<style scoped lang="less">

</style>
