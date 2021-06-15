<template>
<div>
  <CommonHeader :bizInfo="bizInfo" />
  <div></div>
</div>
</template>

<script lang="ts">
import {useRoute} from "vue-router";
import CommonHeader from "@/components/CommonHeader.vue";
import {appState} from "@/utils/store";
import {onMounted, toRefs} from "vue";
import deployerRepository from "@/api/deployerRepository";

export default {
  name: "DeployList",
  components: {
    CommonHeader,
  },
  setup() {
    const route = useRoute()
    console.log(route.query.appId, '[[[[')
    const { bizInfo } = toRefs(appState)
    const getDeploymentList = async () => {
      const appId = parseInt((route.query.appId as string), 10)
      const data = await deployerRepository.deploymentList(appId)
    }

    onMounted(() => {
      getDeploymentList()
    })

    return {
      bizInfo,
    }
  }
}
</script>

<style scoped>

</style>
