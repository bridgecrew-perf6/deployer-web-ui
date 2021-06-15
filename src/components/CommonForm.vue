<template>
  <a-form :model="state" :rules="rules" layout="inline">
    <a-form-item>
      <span>目标 : </span>
    </a-form-item>
    <a-form-item label="版本" :colon="false">
      <a-input v-model:value="state.TargetVersion" placeholder="输入版本" :disabled="disabled" />
    </a-form-item>
    <a-form-item label="release 号" :colon="false" has-feedback name="release">
      <a-input v-model:value="state.TargetRelease" placeholder="输入release号" :disabled="disabled" />
    </a-form-item>
  </a-form>
  <a-form :model="state" layout="inline">
    <a-form-item>
      <span>当前 : </span>
    </a-form-item>
    <a-form-item label="版本" :colon="false">
      <a-input v-model:value="state.CurrentVersion" placeholder="输入版本" :disabled="disabled" />
    </a-form-item>
    <a-form-item label="release 号" :colon="false" >
      <a-input v-model:value="state.CurrentRelease" placeholder="输入release号" :disabled="disabled" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {reactive, toRefs} from "vue";
import {RuleObject} from "ant-design-vue/es/form/interface";

export default {
  name: "CommonForm",
  props: {
    formState: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  setup(props: any) {
    const state = reactive(toRefs(props.formState))
    let validateRelease = async (rule: RuleObject, value: number) => {
      console.log(value, '[[[[[')
      if (!Number.isInteger(value)) {
        return Promise.reject('请输入整数')
      } else {
        return Promise.resolve()
      }
    }
    const rules = {
      release: [{ validator: validateRelease, trigger: 'change '}]
    }
    // console.log(state)

    return {
      state,
      rules,
    }
  }
}
</script>

<style scoped>

</style>
