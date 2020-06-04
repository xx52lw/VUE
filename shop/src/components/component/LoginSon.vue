<template>
    <div>
      <h1>{{son}}</h1>
      <el-button @click="btnClick">子按钮</el-button>
    </div>
</template>

<script>
export default {
  props: {
    son: {
      type: String
    }
  },
  data() {
    return {
      sonToFather: null
    }
  },
  methods: {
    btnClick() {
      console.info('btnClick')
      this.$emit('sonToFatherEvent','sonToFatherValue')
    }
  }
}
</script>

<style scoped>

</style>
