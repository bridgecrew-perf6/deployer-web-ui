<template>
  <div class="login">
    <div class="login-admin">
      <h2>通过 SSO 登录 DEPLOY</h2>
      <a-button size="large" type="primary" @click="login">登录</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import deployerRepository from "@/api/deployerRepository";
import {onErrorCaptured} from 'vue'
import tokenRepositories from "@/composable/tokenRepositories";

export default {
  name: "Login",
  setup() {
    const login = async () => {
      try {
        const data = await deployerRepository.login()
        if (data?.url) {
          window.location.href = data.url
        }
        if (data?.token) {
          tokenRepositories(data?.token)
        }
      } catch (e) {
        console.error(e)
      }
    }
    // onErrorCaptured((err) => {
    //   console.error(err, '[[[')
    //   return true
    // })

    return {
      login,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index";
</style>
