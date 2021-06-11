<template>
  <div class="biz-title">
    <p>{{ bizInfo.Name }}</p>
    <p>{{ bizInfo.DisplayName }}</p>
    <p>{{ bizInfo.Comment }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: "CommonHeader",
  props: {
    bizInfo: Object,
  },
  setup() {
    return {}
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
