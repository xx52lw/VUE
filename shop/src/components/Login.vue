<template>
<div class="login_container">
 <div class="login_box">
   <div class="avatar_box" >
     <!--  头像区域   -->
     <img src="../assets/logo.png">
   </div>
   <div>
     <i slot="prefix" class="iconfont icon-dock-lvzhi"></i>
     <i slot="prefix" class="iconfont icon-dock-lvzhi" v-dock="'2'"></i>
<!--     <i slot="prefix" class="iconfont icon-dock-lvzhi" v-permission="'3'"></i>-->
   </div>
   <!--  表单区域   -->
   <el-form class="login_form"  ref="loginFormRef" :model = "loginForm" label-width="0px" :rules="loginFormRules">
     <el-form-item  prop="username">
       <el-input
         placeholder="请输入用户名" v-model="loginForm.username">
         <i slot="prefix" class="el-input__icon el-icon-user"></i>
       </el-input>
     </el-form-item>
     <el-form-item prop="password">
       <el-input
         placeholder="请输入密码" v-model = "loginForm.password" type="password">
         <i slot="prefix" class="iconfont icon-3702mima"></i>
       </el-input>
     </el-form-item>
     <el-form-item class="btns">
       <el-button class="login" type="primary" @click="login">登录</el-button>
       <el-button class="reset" type="info" @click="resetLoginForm">重置</el-button>
     </el-form-item>
   </el-form>
 </div>
</div>
</template>

<script>
export default {
  name: '',
  data () {
    // var validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入密码'));
    //   } else {
    //     if (value.toString().length < 3 || value.toString().length > 10) {
    //       callback(new Error('长度在 3 到 10 个字符'));
    //     }
    //     callback();
    //   }
    // };
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          // { validator: validatePass, trigger: 'blur' }
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        } else {
          this.$message.success('登录成功')
        }
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }

}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      position: absolute;
      left: 50%;
      border: 1px solid #eeeeee;
      box-shadow: 0 0 10px #ddd;
      padding: 10px;
      border-radius: 50%;
      transform: translate(-50%,-50%);
      img {
        width: 100%;
        height: 100%;
        background-color: #eeeeee;
        border-radius: 50%;
      }
    }
  }

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
