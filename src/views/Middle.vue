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
      if (data?.token) {
        await localStorage.setItem('token', data.token)
        await router.push('/cd/biz').then()
      }
    }

    if (!token) {
      login()
    } else {
      router.push('/cd/biz')
    }

    return {

    }
  }
}
</script>

<style scoped lang="less">

</style>
