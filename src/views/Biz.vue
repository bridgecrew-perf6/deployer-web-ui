<template>
<div>
  <div class="biz-title">
    <p>{{ bizInfo.Name }}</p>
    <p>{{ bizInfo.DisplayName }}</p>
    <p>{{ bizInfo.Comment }}</p>
  </div>
</div>
</template>

<script lang="ts">
import {ref, toRefs} from "vue";
import { appState } from "@/utils/store";

export default {
  name: "Biz",
  setup() {
    const { appList, bizInfo } = toRefs(appState)
    console.log(appList, bizInfo)

    return {
      appList,
      bizInfo,
    }
  }
}
</script>

<style scoped lang="less">
.biz-title {
  width: fit-content;
  padding: 10px 20px;
  box-shadow: #dcdee5 1px 1px 9px 1px inset;
  p {
    margin: 0;
  }
}
</style>
