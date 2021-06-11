<template>
<div>
  <CommonHeader :bizInfo="bizInfo"/>
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
    const { bizInfo } = toRefs(appState)

    return {
      bizInfo,
    }
  }
}
</script>

<style scoped lang="less">

</style>
