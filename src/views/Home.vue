<template>
  <div class="home">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>项目列表</span>
          <el-button
              v-if="user && (user.role === 'admin' || user.role === 'manager')"
              type="primary"
              size="small"
              style="float: right"
              @click="createProject">
            创建项目
          </el-button>
        </div>
      </template>
      <el-table
          :data="userProjects"
          stripe
          style="width: 100%">
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="code" label="项目编号"></el-table-column>
        <el-table-column label="项目经理">
          <template #default="scope">
            {{ getManagerName(scope.row.managerId) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status || '未开始' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度">
          <template #default="scope">
            <el-progress :percentage="getProgressPercentage(scope.row)" :status="getProgressStatus(scope.row)" :stroke-width="18"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="link" size="small" @click="viewProject(scope.row.id)">查看</el-button>
            <el-button v-if="user && user.role === 'manager' && scope.row.managerId === user.id" type="link" size="small" @click="editProject(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['user', 'userProjects', 'users']),
  },
  methods: {
    getManagerName(managerId) {
      const manager = this.users.find(u => u.id === managerId);
      return manager ? manager.name : '未知';
    },
    getStatusType(status) {
      switch (status) {
        case '已完成':
          return 'success';
        case '进行中':
          return 'primary';
        case '未开始':
          return 'info';
        default:
          return 'info';
      }
    },
    getProgressPercentage(project) {
      if (!project.modules || project.modules.length === 0) return 0;

      const completedModules = project.modules.filter(m => m.status === '已完成');
      if (completedModules.length === 0) return 0;

      const totalPercentage = project.modules.reduce((sum, m) => sum + (m.percentage || 0), 0);
      const completedPercentage = completedModules.reduce((sum, m) => sum + (m.percentage || 0), 0);

      return Math.round((completedPercentage / totalPercentage) * 100);
    },
    getProgressStatus(project) {
      const percentage = this.getProgressPercentage(project);
      if (percentage >= 100) return 'success';
      if (percentage >= 75) return 'warning';
      return 'normal';
    },
    viewProject(id) {
      this.$router.push({ name: 'ProjectDetails', params: { id } });
    },
    editProject(id) {
      this.$router.push({ name: 'EditProject', params: { id } });
    },
    createProject() {
      this.$router.push({ name: 'CreateProject' });
    }
  },
  created() {
    this.$store.dispatch('fetchProjects');
  }
}
</script>