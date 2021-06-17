<template>
  <div class="biz-title">
    <div v-if="info">
      <p>{{ info.Name }}</p>
      <p>{{ info.DisplayName }}</p>
      <p>{{ info.Comment }}</p>
    </div>
    <div v-else>
      <p>{{ appInfo?.Name }}</p>
      <p>{{ appInfo?.DisplayName }}</p>
      <p>{{ appInfo?.Comment }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import appInfoRepositories from "@/composable/appInfoRepositories";

export default {
  name: "CommonHeader",
  props: {
    info: Object,
    appId: {
      type: Number,
      default: 0,
    }
  },
  setup(props: any) {
    const { appInfo } = appInfoRepositories(props.appId)

    return {
      appInfo,
    }
  }
}
</script>

<style scoped lang="less">
.biz-title {
  width: fit-content;
  padding: 10px 20px;
  box-shadow: #dcdee5 1px 1px 9px 1px inset;
  margin-bottom: 20px;
  p {
    margin: 0;
  }
}
</style>
