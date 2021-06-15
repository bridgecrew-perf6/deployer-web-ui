<template>
<div>
  <CommonHeader :bizInfo="bizInfo" />
  <div>
    <div class="steps-content">
      <div class="steps-content-title">{{ steps[current].title }}</div>
      <div v-if="current === 0" class="steps-content-content">
        <CommonTree :nodes-data="nodeTreeData"/>
      </div>
      <div v-else-if="current === 1" class="steps-content-content">
<!--        <a-form :model="state" layout="inline">-->
<!--          <a-form-item>-->
<!--            <span>目标 : </span>-->
<!--          </a-form-item>-->
<!--          <a-form-item label="版本" :colon="false">-->
<!--            <a-input v-model:value="state.TargetVersion" placeholder="输入版本" />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="release 号" :colon="false">-->
<!--            <a-input v-model:value="state.TargetRelease" placeholder="输入release号" />-->
<!--          </a-form-item>-->
<!--        </a-form>-->
<!--        <a-form :model="state" layout="inline">-->
<!--          <a-form-item>-->
<!--            <span>当前 : </span>-->
<!--          </a-form-item>-->
<!--          <a-form-item label="版本" :colon="false">-->
<!--            <a-input v-model:value="state.CurrentVersion" placeholder="输入版本" />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="release 号" :colon="false">-->
<!--            <a-input v-model:value="state.CurrentRelease" placeholder="输入release号"/>-->
<!--          </a-form-item>-->
<!--        </a-form>-->
        <CommonForm :form-state="state" />
      </div>
      <div v-else class="steps-content-content">
        <CommonTree :nodes-data="nodeTreeData" :disabled="true" />
        <div style="margin-top: 20px; margin-bottom: 20px;">
          <CommonForm :form-state="state" :disabled="true" />
        </div>
        <a-textarea v-model:value="state.Comment" auto-size placeholder="请输入备注" :rows="1" />
      </div>
    </div>
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-action">
      <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">Previous</a-button>
      <a-button
          v-if="current === steps.length - 1"
          type="primary"
          @click="addDeployment"
      >
        Done
      </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="next">Next</a-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, toRefs, UnwrapRef} from "vue";
import {message} from 'ant-design-vue';
import CommonHeader from "@/components/CommonHeader.vue";
import {appState} from "@/utils/store";
import {useRoute} from "vue-router";
import deployerRepository from "@/api/deployerRepository";
import CommonTree from "@/components/CommonTree.vue";
import CommonForm from '@/components/CommonForm.vue';

export interface NodeTree {
  id?: number;
  title?: string;
  key?: string;
  expanded?: boolean;
  checked?: boolean;
  selected?: boolean;
  children?: NodeTree[],
}
export interface FormState {
  Comment: string;
  CurrentRelease: number;
  CurrentVersion: string;
  TargetRelease: number;
  TargetVersion: string;
  Targets: {[key: string]: number}[],
}

export default {
  name: "DeployTemplate",
  components: {
    CommonHeader,
    CommonTree,
    CommonForm,
  },
  setup() {
    const route = useRoute()
    console.log(route.query.appId, '[[[[')
    const { bizInfo } = toRefs(appState)
    const current = ref<number>(0)
    const steps = [{ title: '选择集群', }, { title: '选择版本', }, { title: 'summary', },]
    const nodeTreeData = ref()
    const state: UnwrapRef<FormState> = reactive({
      Comment: '',
      CurrentRelease: 0,
      CurrentVersion: '',
      TargetRelease: 0,
      TargetVersion: '',
      Targets: [],
    })

    const next = () => {
      if (current.value === 0) {
        const selected = nodeTreeData.value.reduce((pre: any, cur: NodeTree) => {
          return pre.concat(cur?.children?.reduce((p: any, c: NodeTree) => p.concat(c.children), []))
        }, [])
        state.Targets = selected.filter((s: NodeTree) => s.selected).map((m: NodeTree) => ({ReplicaSetID: m.id}))
        // console.log(selected, '//////', state.Targets)
      }
      if (current.value === 1) {
        if (!state.TargetVersion) {
          message.warning('目标版本必填')
          return
        }
        if (state.TargetRelease && isNaN(state.TargetRelease)) {
          message.warning('release为整数')
          return
        }
        if (state.CurrentRelease && isNaN(state.CurrentRelease)) {
          message.warning('release为整数')
          return
        }
      }
      current.value++;
    };
    const prev = () => {
      current.value--;
    };
    const getRs = async () => {
      try {
        const appId = parseInt((route.query.appId as string), 10)
        const data = await deployerRepository.getAllRsByAppId(appId) || []
        console.log(data, '[[[[ LogicIdc Env Cluster 参数rsId"Targets": [{ReplicaSetID: 1},{ReplicaSetID: 2}')
        const logicIdc = data.map(d => JSON.stringify({
          title: d.LogicIdcEnv?.LogicIdc?.Name,
          key: d.LogicIdcEnv?.LogicIdc?.ID,
          expanded: true,
          children: [],
        }))
        const logicIdcFilter = [...(new Set(logicIdc))].map(j => JSON.parse(j))
        console.log(logicIdcFilter, ';;;;;')
        logicIdcFilter.map((l: NodeTree, index: number) => {
          data.map(d => {
            if (d.LogicIdcEnv?.LogicIdc?.ID === l.key) {
              logicIdcFilter[index].children.push({
                id: d.ID,
                title: d.LogicIdcEnv?.Env?.Name,
                key: d.LogicIdcEnv?.LogicIdc?.ID + '-' + d.LogicIdcEnv?.Env?.ID,
                expanded: true,
                children: [
                  {
                    id: d.ID,
                    title: d.Cluster?.Name,
                    key: d.LogicIdcEnv?.LogicIdc?.ID + '-' + d.LogicIdcEnv?.Env?.ID + '-' + d.Cluster?.ID,
                    checked: true,
                    selected: false,
                  }
                ],
              })
            }
          })
        })
        nodeTreeData.value = logicIdcFilter
      } catch (e) {
        console.error(e)
      }
    }

    const addDeployment = async () => {
      const value: any = {...state}
      value.CurrentRelease = Number(value.CurrentRelease) || 0
      value.TargetRelease = Number(value.TargetRelease) || 0
      const appId = parseInt((route.query.appId as string), 10)
      try {
        const data = await deployerRepository.addDeploymentByAppId(appId, value)
        console.log(data, '[[[')
        message.success('Processing complete!')
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(() => {
      getRs()
    })

    return {
      state,
      nodeTreeData,
      bizInfo,
      current,
      steps,
      next,
      prev,
      addDeployment,
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

  .steps-content-content {
    text-align: left;
    margin-top: 20px;
  }
}

.steps-action {
  margin-top: 24px;
}
</style>
