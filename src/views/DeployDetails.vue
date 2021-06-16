<template>
<div>
  <CommonHeader :info="appInfo"/>
</div>
</template>

<script lang="ts">
import {toRefs} from "vue";
import {appState} from "@/utils/store";
import CommonHeader from "@/components/CommonHeader.vue";

export default {
  name: "DeployDetails",
  components: {
    CommonHeader,
  },
  setup() {
    const { appInfo } = toRefs(appState)

    return {
      appInfo,
    }
  }
}
</script>

<style scoped lang="less">

</style>
