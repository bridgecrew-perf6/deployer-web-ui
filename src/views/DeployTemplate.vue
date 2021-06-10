<template>
<div>
  <div>
    <div class="steps-content">
      {{ steps[current].content }}
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
import {ref} from "vue";
import {message} from 'ant-design-vue'

export default {
  name: "DeployTemplate",
  setup() {
    const current = ref<number>(0);
    const next = () => {
      current.value++;
    };
    const prev = () => {
      current.value--;
    };
    return {
      current,
      steps: [
        {
          title: '选择集群',
          content: 'First-content',
        },
        {
          title: '选择版本',
          content: 'Second-content',
        },
        {
          title: 'summary',
          content: 'Last-content',
        },
      ],
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
  padding-top: 80px;
}

.steps-action {
  margin-top: 24px;
}
</style>
