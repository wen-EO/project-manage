<template>
  <div class="container mx-auto p-4">
    <el-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="font-bold">项目列表</h3>
          <el-button v-if="user && (user.role === 'admin' || user.role === 'manager')" type="primary" @click="createProject">
            创建项目
          </el-button>
        </div>
      </template>
      <el-table :data="userProjects" stripe style="width: 100%">
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="startDate" label="开始时间"></el-table-column>
        <el-table-column prop="endDate" label="结束时间"></el-table-column>
        <el-table-column label="剩余时间">
          <template #default="scope">
            <span :class="getTimeRemainingClass(scope.row)">{{ getTimeRemaining(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在岗人员">
          <template #default="scope">
            <span>{{ getMembersCount(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余利润">
          <template #default="scope">
            <span :class="getProfitClass(scope.row)">{{ getRemainingProfit(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" size="small" @click="viewProject(scope.row.id)">查看</el-button>
            <el-button v-if="user && user.role === 'manager' && scope.row.managerId === user.id" type="text" size="small" @click="editProject(scope.row.id)">编辑</el-button>
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
    ...mapGetters(['user', 'userProjects']),
  },
  methods: {
    viewProject(projectId) {
      this.$router.push({ name: 'ProjectDetails', params: { id: projectId } });
    },
    createProject() {
      this.$router.push({ name: 'CreateProject' });
    },
    editProject(projectId) {
      this.$router.push({ name: 'EditProject', params: { id: projectId } });
    },
    getTimeRemaining(project) {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      const now = new Date();
      
      if (now > end) return '已结束';
      
      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const remainingDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      
      return `${remainingDays}天 (${Math.round((remainingDays / totalDays) * 100)}%)`;
    },
    getTimeRemainingClass(project) {
      const now = new Date();
      const end = new Date(project.endDate);
      const remainingDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      
      if (remainingDays < 0) return 'text-red-500';
      if (remainingDays < 7) return 'text-orange-500';
      return 'text-green-500';
    },
    getMembersCount(project) {
      return project.members ? project.members.length : 0;
    },
    getRemainingProfit(project) {
      // 这里简化计算，实际项目中需要根据具体业务逻辑计算
      const totalAmount = project.totalAmount || 0;
      const usedAmount = project.usedAmount || 0;
      return `¥${(totalAmount - usedAmount).toFixed(2)}`;
    },
    getProfitClass(project) {
      const totalAmount = project.totalAmount || 0;
      const usedAmount = project.usedAmount || 0;
      const remaining = totalAmount - usedAmount;
      
      if (remaining < 0) return 'text-red-500';
      if (remaining < totalAmount * 0.2) return 'text-orange-500';
      return 'text-green-500';
    }
  },
  created() {
    this.$store.dispatch('fetchProjects');
  }
}
</script>
  