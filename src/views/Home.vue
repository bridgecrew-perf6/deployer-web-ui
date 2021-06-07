<template>
<div>home {{ a }}
  <a-input type="text" v-model:value="b"></a-input>
</div>
</template>

<script lang="ts">
import {ref} from "vue";

export default {
  name: "Home",
  setup() {
    const a = ref(['/'])
    const b = ref('home')

    return {
      a,
      b,
    }
  }
}
</script>

<style scoped lang="less">

</style>
