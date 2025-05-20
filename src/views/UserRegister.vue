<template>
  <div class="container mx-auto p-4 max-w-md">
    <el-card class="mb-6">
      <template #header>
        <h3 class="font-bold">用户注册</h3>
      </template>
      <el-form :model="userForm" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="userForm.confirmPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="注册类型" prop="role">
          <el-radio-group v-model="userForm.role">
            <el-radio :label="'member'">项目成员</el-radio>
            <el-radio :label="'manager'">申请成为项目经理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">注册</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserRegister',
  data() {
    return {
      userForm: {
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        role: 'member'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (value !== this.userForm.password) {
                callback(new Error('两次输入的密码不一致'));
              } else {
                callback();
              }
            }, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          // 提交注册信息
          this.$store.dispatch('registerUser', this.userForm).then(() => {
            this.$message.success('注册成功，请等待管理员审核');
            this.$router.push({ name: 'Login' });
          });
        } else {
          this.$message.error('请填写完整且正确的注册信息');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.formRef.resetFields();
    }
  }
}
</script>
  