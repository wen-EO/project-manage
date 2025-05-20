<template>
  <div class="container mx-auto p-4 max-w-md">
    <el-card class="mb-6">
      <template #header>
        <h3 class="font-bold">用户登录</h3>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button @click="goToRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.$store.dispatch('login', this.loginForm).then(() => {
            this.$message.success('登录成功');
            this.$router.push({ name: 'Home' });
          }).catch(error => {
            this.$message.error(error.message);
          });
        } else {
          this.$message.error('请填写完整的登录信息');
          return false;
        }
      });
    },
    goToRegister() {
      this.$router.push({ name: 'UserRegister' });
    }
  }
}
</script>
  