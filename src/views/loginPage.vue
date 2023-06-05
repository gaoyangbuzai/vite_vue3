<template>
  <div class="login-page">
    <div class="login-header">
      <img class="login-logo" src="../assets/logo.png" alt="" />
      <span>仓储管理系统</span>
    </div>
    <el-card class="login-box" header="登录系统">
      <div class="box-container">
        <el-form :model="form" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username" label="账号">
            <el-input type="text" v-model="form.username" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="submitForm(loginFormRef)">登 录</el-button>
          <el-button type="primary" @click="resetForm(loginFormRef)">重 置</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { login } from '@/api/login.ts';

export default defineComponent({
  setup() {
    const data = reactive({
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, trigger: ['change', 'blur'], message: '用户名不能为空' },
          { min: 3, max: 10, trigger: ['change', 'blur'], message: '用户名长度3-10个字符' }
        ],
        password: [
          { required: true, trigger: ['change', 'blur'], message: '密码不能为空' },
          { min: 3, max: 10, trigger: ['change', 'blur'], message: '密码长度3-10个字符' }
        ]
      }
    })

    const loginFormRef = ref<FormInstance>()

    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) {
        return;
      }
      formEl.validate(async (valid) => {
        if(valid){
          const res =await await login(data.form);
          localStorage.setItem('Authorization',res.data.Authorization);
          console.log('submit success')
        }else{
          console.log('submit error')
        }
      })
    }
    const resetForm = (formEl: FormInstance | undefined) => {
      if(!formEl){
        return;
      }
      formEl.resetFields();
      console.log(data.form)
    }
    return {
      ...toRefs(data),
      loginFormRef,
      submitForm,
      resetForm
    }
  }
})
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('../assets/login_bg.png') no-repeat;
  background-size: cover;
  overflow: hidden;

  .login-header {
    display: flex;
    align-items: center;
    margin-top: 50px;
    margin-left: 100px;
    font-size: 32px;

    .login-logo {
      width: 70px;
      margin-right: 20px;
    }
  }

  .login-box {
    position: absolute;
    top: 50%;
    right: 12%;
    width: 440px;
    height: 335px;
    transform: translateY(-50%);
    border-radius: 10px;
  }
}
</style>
