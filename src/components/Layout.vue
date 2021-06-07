<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo" >logo</div>
      <a-menu
          theme="dark"
          mode="horizontal"
          v-model:selectedKeys="selectedKey"
          :style="{ lineHeight: '58px' }"
      >
        <a-menu-item>
          <a href="http://127.0.0.1:4200">业务拓扑</a>
        </a-menu-item>
        <a-menu-item>
          <a href="http://127.0.0.1:4203">运维工具箱</a>
        </a-menu-item>
        <a-menu-item key="3">CI</a-menu-item>
        <a-menu-item key="/">
          <router-link to="/">CD</router-link>
        </a-menu-item>
        <a-menu-item key="5">监控中心</a-menu-item>
        <a-menu-item key="6">日志中心</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
            class="menu-side"
            mode="inline"
            v-model:selectedKeys="selectedKeysMenu"
            :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item v-for="item in bar" :key="item.path">
            <span>
              <icon-font :type="item.icon" />
              <router-link :to="'/cd/' + item.path">{{ item.name }}</router-link>
            </span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="common-content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {reactive, ref, toRefs, watch} from 'vue'
import {useRoute} from "vue-router";
import {createFromIconfontCN} from '@ant-design/icons-vue'

export interface BarItem {
  icon: string;
  path: string;
  name: string;
}

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2598067_jca7prjkbw.js'
})

export default {
  name: "Layout",
  components: {
    IconFont,
  },
  setup() {
    const route = useRoute()
    const url = route.path.split('/')

    const state = reactive({
      selectedKey: ['/'],
      selectedKeysMenu: [url[2]],
    })
    const bar = ref<BarItem[]>([
      {icon: 'icon-home', path: 'home', name: '首页'},
      {icon: 'icon-about', path: 'about', name: '关于' },
    ])

    watch(() => route.path, (value) => {
      const url = value.split('/')
      state.selectedKeysMenu = [url[2]]
    })

    return {
      ...toRefs(state),
      bar,
    }
  }
}
</script>

<style scoped lang="less">
.layout {
  width: 100vw;
  height: inherit;
}
// 侧边栏滚动
.ant-layout-sider {
  overflow: auto;
}

.logo {
  width: 120px;
  height: 58px;
  float: left;
  color: #fff;
  margin-right: 30px;
  text-align: left;
  font-weight: 500;
}
.common-content {
  background: #fff;
  border-left: 1px solid #DCDEE5;
}
.layout /deep/ .ant-layout-header {
  height: 58px;
  display: flex;
}
.menu-side {
  text-align: left;
  a::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
    content: '';
  }
  a {
    color: rgba(0, 0, 0, 0.85);
  }
  .ant-menu-item-selected a, a:hover {
    color: #1890ff;
  }
}
</style>
