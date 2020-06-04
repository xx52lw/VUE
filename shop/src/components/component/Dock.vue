<template>
  <div class="main-area">
    <div class="main-area-header">
      <div class="main-area-header-left">
        <h3 class="main-area-header-left-title">{{titlename}}</h3>
        <p class="main-area-header-left-description" v-if="description"><i class="el-icon-info"></i>&nbsp;{{description}}</p>
      </div>
      <div class="main-area-header-right">
        <slot name="main-area-header-right-operation"></slot>
      </div>
    </div>
    <div class="main-area-content">
      <slot></slot>
    </div>
  </div>

<!--

<DockLayout :titlename="$route.meta.menuName">
    <template slot="main-area-header-right-operation">
      <el-button icon="el-icon-back" @click="$router.push({name: 'UserEnterprise'})">返回</el-button>
    </template>
    其它代码
</DockLayout>
-->


</template>

<script>
  export default {
    name: "Dock",
    props: {
      titlename: {
        type: String
      },
      description: {
        type: String
      }
    }
  }
</script>

<style lang="less" scoped>
  .main-area {
    box-sizing: border-box;
    padding: 20px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 144px);
    box-shadow:0 2px 4px rgba(0,0,0,.12);
  .main-area-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #f4f4f4;
    padding-bottom: 20px;
  .main-area-header-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  .main-area-header-left-title {
    color: #000;
    font-size: 18px;
    font-weight: 700;
  }
  .main-area-header-left-description {
    margin-left: 10px;
    color: #E6A23C;
  }
  }
  }
  .main-area-content {
    flex: 1;
    background-color: #fff;
  }
  }
</style>
