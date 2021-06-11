<template>
  <div>
    <ul v-for="node in nodesData" :key="node.key">
      <li v-if="node.children">
        <CaretDownOutlined :style="{fontSize: '12px'}" v-if="node.expanded" @click="isExpandedChildren(node)" />
        <CaretRightOutlined :style="{fontSize: '12px'}" v-else @click="isExpandedChildren(node)"  />
        <a-checkbox v-if="node.checked" v-model:checked="node.selected"></a-checkbox>
        <span>{{node.title}}</span>
        <common-tree v-if="node.expanded" :nodes-data="node.children" ></common-tree>
      </li>
      <template v-else>
        <li >
          <a-checkbox @change="clusterBindLogicIdcEnv(node)" v-if="node.checked" v-model:checked="node.selected"></a-checkbox>
          <span>{{node.title}}</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import {CaretDownOutlined, CaretRightOutlined} from '@ant-design/icons-vue'

export default {
  name: "CommonTree",
  components: {
    CaretRightOutlined,
    CaretDownOutlined,
  },
  props: {
    nodesData: {
      type: Array,
      default: () => [],
    }
  },
  setup() {
    const isExpandedChildren = (value: any) => {
      console.log(value, 'expand')
    }
    const clusterBindLogicIdcEnv = (value: any) => {
      console.log(value, 'select')
    }

    return {
      isExpandedChildren,
      clusterBindLogicIdcEnv,
    }
  }
}
</script>

<style scoped lang="less">
ul {
  list-style: none;
  padding-left: 0;
  li {
    white-space: nowrap;
    width: 100%;
    span {
      margin-left: 10px;
    }
    i {
      font-size: 10px;
      cursor: pointer;
    }
    ul {
      padding-left: 30px;
    }
  }
}
</style>
