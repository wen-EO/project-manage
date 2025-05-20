<template>
  <el-header class="bg-white shadow-sm">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center">
        <el-button type="text" @click="goHome">项目管理系统</el-button>
      </div>
      <div class="flex items-center space-x-4">
        <el-button v-if="!user" type="text" @click="goToLogin">登录</el-button>
        <el-dropdown v-else trigger="click">
              <span class="el-dropdown-link cursor-pointer">
                {{ user.name }} <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' });
    },
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'Home' });
    }
  }
}
</script>
  