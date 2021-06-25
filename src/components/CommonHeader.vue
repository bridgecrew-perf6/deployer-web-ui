<template>
  <div class="common-content">
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
    <a-button v-if="addDeploy">
      <router-link :to="{ path: '/cd/biz/deploy-template', query: { appId: appId }}" >新建发布</router-link>
    </a-button>
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
    },
    addDeploy: {
      type: Boolean,
      default: false,
    },
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
.common-content {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.biz-title {
  width: fit-content;
  padding: 10px 20px;
  box-shadow: #dcdee5 1px 1px 9px 1px inset;
  margin-right: 30px;
  p {
    margin: 0;
  }
}
</style>
