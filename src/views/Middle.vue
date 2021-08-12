<template>
<div></div>
</template>

<script lang="ts">
import deployerRepository from "@/api/deployerRepository";
import router from "@/router";
import tokenRepositories from "@/composable/tokenRepositories";

export default {
  name: "Middle",
  setup() {
    const token = localStorage.getItem('token')

    const login = async () => {
      const data = await deployerRepository.login()
      if (data?.token) {
        tokenRepositories(data?.token)
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
