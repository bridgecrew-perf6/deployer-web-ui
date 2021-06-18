<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo" >logo</div>
      <div class="layout-header-menu">
        <a-menu
            theme="dark"
            mode="horizontal"
            v-model:selectedKeys="selectedKey"
            :style="{ lineHeight: '58px' }"
        >
          <a-menu-item v-for="bar in menuBar" :key="bar.path">
            <a :href="bar.path">{{ bar.name }}</a>
          </a-menu-item>
<!--          <a-menu-item>-->
<!--            <a href="http://127.0.0.1:4203">运维工具箱</a>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="3">CI</a-menu-item>-->
<!--          <a-menu-item key="/">-->
<!--            <router-link to="/">CD</router-link>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="5">监控中心</a-menu-item>-->
<!--          <a-menu-item key="6">日志中心</a-menu-item>-->
        </a-menu>
        <section>
          <a-avatar class="user-avatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              {{ username }}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="logout()">退出</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </section>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <div class="select-menu-contain">
          <a-select
              v-model:value="bizId"
              show-search
              placeholder="Select a biz"
              :filter-option="filterOptionBiz"
              style="width: 100%"
          >
            <a-select-option v-for="option in bizList" :key="option.ID" :value="option.ID" :title="option.Name">{{ option.Name }}</a-select-option>
          </a-select>
        </div>
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
import {reactive, ref, toRefs, watch, isReadonly, onMounted} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {createFromIconfontCN, UserOutlined, DownOutlined} from '@ant-design/icons-vue'
import bizRepositories from "@/composable/bizRepositories";
import jwtDecode from "jwt-decode";
import deployerRepository from "@/api/deployerRepository";
import {BarItem} from "@/utils/response";

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2598067_jca7prjkbw.js'
})

export default {
  name: "Layout",
  components: {
    IconFont,
    UserOutlined,
    DownOutlined,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const url = route.path.split('/')

    const { bizId, bizList } = bizRepositories()

    const state = reactive({
      selectedKey: ['/'],
      selectedKeysMenu: [url[2]],
      username: '用户名',
    })
    const bar = ref<BarItem[]>([
      {icon: 'icon-home', path: 'biz', name: '总览'},
      {icon: 'icon-about', path: 'about', name: '关于' },
    ])
    const menuBar = ref<BarItem[]>([])

    const logout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }
    const filterOptionBiz = (input: string, option: any) => {
      console.log(input, option)
      return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    const getBar = async () => {
      try {
        menuBar.value = await deployerRepository.queryBar()
      } catch (e) {
        console.error(e)
      }
    }

    // watch(() => route.path, (value) => {
    //   const url = value.split('/')
    //   state.selectedKeysMenu = [url[2]]
    // })

    onMounted(() => {
      getBar()

      const token = localStorage.getItem('token')
      if (token) {
        const userInfo = jwtDecode<{[key: string]: string}>(token)
        state.username = userInfo?.name || userInfo?.username
      }
    })

    return {
      bizId,
      bizList,
      ...toRefs(state),
      bar,
      menuBar,
      logout,
      filterOptionBiz,
    }
  }
}
</script>

<style scoped lang="less">
@baseBorder: #DCDEE5;
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
.layout-header-menu {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  ul, section {
    white-space: nowrap;
  }
  .user-avatar {
    margin-right: 4px;
  }
}
.common-content {
  background: #fff;
  border-left: 1px solid #DCDEE5;
  padding: 20px;
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
.select-menu-contain {
  display: flex;
  justify-content: center;
  height: 53px;
  align-items: center;
  border-bottom: 1px solid @baseBorder;
  padding: 0 10px;
}
</style>
