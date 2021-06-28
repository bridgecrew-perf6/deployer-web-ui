<template>
  <a-form :model="state" :rules="rules" layout="inline">
    <a-form-item>
      <span>目标 : </span>
    </a-form-item>
    <a-form-item label="版本" :colon="false">
      <a-select
        v-model:value="state.TargetVersion"
        show-search
        placeholder="选择版本"
        style="min-width: 400px"
        :disabled="disabled"
        @select="selectTarget"
      >
        <a-select-option v-for="option in packageList" :key="option.Version + option.Release" :value="option.Version">{{ option.Version }} - {{ option.Release}}</a-select-option>
      </a-select>
<!--      <a-input v-model:value="state.TargetVersion" placeholder="输入版本" :disabled="disabled" />-->
    </a-form-item>
<!--    <a-form-item label="release 号" :colon="false" has-feedback name="release">-->
<!--      <a-input v-model:value="state.TargetRelease" placeholder="输入release号" :disabled="disabled" />-->
<!--    </a-form-item>-->
  </a-form>
  <a-form :model="state" layout="inline">
    <a-form-item>
      <span>当前 : </span>
    </a-form-item>
    <a-form-item label="版本" :colon="false">
      <a-select
        v-model:value="state.CurrentVersion"
        show-search
        placeholder="选择版本"
        style="min-width: 400px"
        :disabled="disabled"
        @select="selectCurrent"
      >
        <a-select-option v-for="option in packageList" :key="option.Version + option.Release" :value="option.Version">{{ option.Version }} - {{ option.Release}}</a-select-option>
      </a-select>
<!--      <a-input v-model:value="state.CurrentVersion" placeholder="输入版本" :disabled="disabled" />-->
    </a-form-item>
<!--    <a-form-item label="release 号" :colon="false" >-->
<!--      <a-input v-model:value="state.CurrentRelease" placeholder="输入release号" :disabled="disabled" />-->
<!--    </a-form-item>-->
  </a-form>
</template>

<script lang="ts">
import {onMounted, reactive, ref, toRefs} from "vue";
import {RuleObject} from "ant-design-vue/es/form/interface";
import deployerRepository from "@/api/deployerRepository";
import {Packages} from "@/utils/response";
import {Option} from "ant-design-vue/es/vc-util/Children/toArray";
import * as _ from "lodash";

export default {
  name: "CommonForm",
  props: {
    formState: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    appId: {
      type: Number,
    }
  },
  setup(props: any) {
    const state = reactive(toRefs(props.formState))
    const packageList = ref<Packages[]>([])
    let validateRelease = async (rule: RuleObject, value: number) => {
      if (!Number.isInteger(value)) {
        return Promise.reject('请输入整数')
      } else {
        return Promise.resolve()
      }
    }
    const rules = {
      release: [{ validator: validateRelease, trigger: 'change '}]
    }
    const getPackages = async () => {
      try {
        const data = await deployerRepository.queryPackage(props.appId);
        packageList.value = _.orderBy(data, ['Version', 'Release'], 'desc')
      } catch (e) {
        console.error(e)
      }
    }
    const selectTarget = (value: string) => {
      state.TargetRelease = packageList.value?.filter(f => f.Version === value)?.[0].Release
    }
    const selectCurrent = (value: string) => {
      state.CurrentRelease = packageList.value?.filter(f => f.Version === value)?.[0].Release
    }
    // console.log(state)

    onMounted(() => {
      getPackages()
    })

    return {
      state,
      rules,
      packageList,
      selectTarget,
      selectCurrent,
    }
  }
}
</script>

<style scoped>

</style>
