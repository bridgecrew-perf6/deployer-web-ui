<template>
<div>
  <CommonHeader :bizInfo="bizInfo" />
  <div>
    <div class="steps-content">
      <div class="steps-content-title">{{ steps[current].title }}</div>
      <div v-if="current === 0">
        ppp
      </div>
      <div v-else-if="current === 1">
        xxx
      </div>
      <div v-else>
        lll
      </div>
    </div>
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-action">
      <a-button v-if="current < steps.length - 1" type="primary" @click="next">Next</a-button>
      <a-button
          v-if="current === steps.length - 1"
          type="primary"
          @click="message.success('Processing complete!')"
      >
        Done
      </a-button>
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">Previous</a-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {ref, toRefs} from "vue";
import {message} from 'ant-design-vue';
import CommonHeader from "@/components/CommonHeader.vue";
import {appState} from "@/utils/store";
import {useRoute} from "vue-router";

export default {
  name: "DeployTemplate",
  components: {
    CommonHeader,
  },
  setup() {
    const { bizInfo } = toRefs(appState)
    const current = ref<number>(0);
    const steps = [
      {
        title: '选择集群',
      },
      {
        title: '选择版本',
      },
      {
        title: 'summary',
      },
    ];
    const route = useRoute()
    console.log(route.query, '[[[[');
    const next = () => {
      current.value++;
    };
    const prev = () => {
      current.value--;
    };
    return {
      bizInfo,
      current,
      steps,
      next,
      prev,
      message,
    };
  }
}
</script>

<style scoped lang="less">
.ant-steps {
  text-align: left;
}
.steps-content {
  margin-bottom: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding: 20px;

  .steps-content-title {
    font-size: 16px;
    font-weight: 500;
  }
}

.steps-action {
  margin-top: 24px;
}
</style>
