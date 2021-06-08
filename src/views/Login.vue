<template>
  <div class="login">
    <div class="login-admin">
      <h2>通过 SSO 登录 TOOLBOX</h2>
      <a-button size="large" type="primary" @click="login">登录</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import deployerRepository from "@/api/deployerRepository";

export default {
  name: "Login",
  setup() {
    const login = async () => {
      const data = await deployerRepository.login()
      console.log(data, ';;;')
    }

    return {
      login,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index";
</style>
