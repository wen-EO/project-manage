<template>
  <div class="navbar">
    <el-header height="60px">
      <div class="logo">
        <el-button type="link" @click="goHome">项目管理系统</el-button>
      </div>
      <div class="right">
        <el-button v-if="!user" type="link" @click="goToLogin">登录</el-button>
        <el-dropdown v-else>
          <span class="el-dropdown-link">
            {{ user.name || user.username }} <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['user']),
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
      this.$router.push({ name: 'Login' });
    }
  }
}
</script>

<style scoped>
.logo {
  float: left;
  line-height: 60px;
  padding-left: 20px;
}

.right {
  float: right;
  line-height: 60px;
  padding-right: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>