<template>
<div></div>
</template>

<script lang="ts">
import deployerRepository from "@/api/deployerRepository";
import router from "@/router";

export default {
  name: "Middle",
  setup() {
    const token = localStorage.getItem('token')

    const login = async () => {
      const data = await deployerRepository.login()
      await localStorage.setItem('token', data.token)
      await router.push('/cd/home').then()
    }

    if (token) {
      router.push('/cd/home')
    } else {
      login()
    }

    return {

    }
  }
}
</script>

<style scoped lang="less">

</style>
