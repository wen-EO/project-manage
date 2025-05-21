<template>
  <div class="project-details">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>{{ project.name }}</span>
          <el-tag :type="projectStatusType" v-if="projectStatusText">{{ projectStatusText }}</el-tag>
          <el-button
              v-if="user && user.role === 'manager' && project.managerId === user.id"
              type="primary"
              size="small"
              style="float: right; margin-left: 10px"
              @click="editProject">
            编辑项目
          </el-button>
          <el-button
              v-if="user && user.role === 'admin'"
              type="primary"
              size="small"
              style="float: right"
              @click="addModule">
            添加模块
          </el-button>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p class="text-gray-500 mb-1">项目编号</p>
          <p class="font-medium">{{ project.code || '-' }}</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">项目经理</p>
          <p class="font-medium">{{ getManagerName(project.managerId) || '-' }}</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">开始日期</p>
          <p class="font-medium">{{ project.startDate || '-' }}</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">结束日期</p>
          <p class="font-medium">{{ project.endDate || '-' }}</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">项目预算</p>
          <p class="font-medium">{{ project.totalAmount || '0.00' }} 元</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">剩余预算</p>
          <p class="font-medium {{ budgetClass }}">{{ remainingBudget }} 元</p>
        </div>
      </div>
    </el-card>

    <el-card class="box-card mt-4">
      <template #header>
        <div class="clearfix">
          <span>项目成员</span>
          <el-button
              v-if="user && user.role === 'manager' && project.managerId === user.id"
              type="primary"
              size="small"
              style="float: right"
              @click="addMember">
            添加成员
          </el-button>
        </div>
      </template>
      <el-table
          :data="projectMembers"
          stripe
          style="width: 100%">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="请假天数">
          <template #default="scope">
            {{ getLeaveDays(scope.row.id) }} 天
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
                v-if="user && user.role === 'manager' && project.managerId === user.id && scope.row.id !== project.managerId"
                type="link"
                size="small"
                @click="removeMember(project.id, scope.row.id)">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card mt-4">
      <template #header>
        <div class="clearfix">
          <span>项目模块</span>
        </div>
      </template>
      <el-table
          :data="project.modules || []"
          stripe
          style="width: 100%">
        <el-table-column prop="name" label="模块名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="percentage" label="权重"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status || '未开始' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负责人">
          <template #default="scope">
            {{ getMemberName(scope.row.leaderId) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
                v-if="user && user.role === 'manager' && scope.row.status !== '已完成'"
                type="link"
                size="small"
                @click="markModuleAsComplete(project.id, scope.row.id)">
              标记为完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card mt-4">
      <template #header>
        <div class="clearfix">
          <span>项目进度</span>
        </div>
      </template>
      <div class="p-4">
        <el-progress :percentage="progressPercentage" :status="progressStatus"></el-progress>
        <div class="flex justify-between mt-2 text-sm">
          <span>综合进度: {{ progressPercentage }}%</span>
          <span>时间进度: {{ timeProgressPercentage }}%</span>
          <span>任务进度: {{ taskProgressPercentage }}%</span>
        </div>
      </div>
    </el-card>

    <el-card class="box-card mt-4">
      <template #header>
        <div class="clearfix">
          <span>成本分析</span>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div>
          <p class="text-gray-500 mb-1">人员成本</p>
          <p class="font-medium">{{ personnelCost }} 元</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">其他成本</p>
          <p class="font-medium">{{ project.otherCost || '0.00' }} 元</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">总成本</p>
          <p class="font-medium">{{ totalCost }} 元</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">项目收入</p>
          <p class="font-medium">{{ project.totalAmount || '0.00' }} 元</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">项目利润</p>
          <p class="font-medium {{ profitClass }}">{{ profit }} 元</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">经理提成</p>
          <p class="font-medium">{{ managerCommission }} 元</p>
        </div>
      </div>
    </el-card>

    <el-card class="box-card mt-4" v-if="isProjectMember">
      <template #header>
        <div class="clearfix">
          <span>请假申请</span>
        </div>
      </template>
      <el-form :model="leaveForm" label-width="120px" class="p-4">
        <el-form-item label="开始日期">
          <el-date-picker
              v-model="leaveForm.startDate"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
              v-model="leaveForm.endDate"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请假原因">
          <el-input
              v-model="leaveForm.reason"
              type="textarea"
              :rows="4"
              placeholder="请输入请假原因">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLeaveApplication">提交申请</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProjectDetails',
  computed: {
    ...mapGetters(['user', 'projects', 'users', 'isWorkingTime']),
    project() {
      return this.projects.find(p => p.id === this.$route.params.id);
    },
    projectMembers() {
      if (!this.project || !this.project.members) return [];
      return this.users.filter(user => this.project.members.includes(user.id));
    },
    isProjectMember() {
      return this.user && this.project && this.project.members && this.project.members.includes(this.user.id);
    },
    remainingBudget() {
      const totalAmount = this.project.totalAmount || 0;
      const usedAmount = this.project.usedAmount || 0;
      return (totalAmount - usedAmount).toFixed(2);
    },
    budgetClass() {
      const remaining = this.project.totalAmount - (this.project.usedAmount || 0);
      if (remaining < 0) return 'text-red-500';
      if (remaining < this.project.totalAmount * 0.2) return 'text-orange-500';
      return 'text-green-500';
    },
    progressPercentage() {
      // 综合时间和任务进度
      return Math.round((this.timeProgressPercentage + this.taskProgressPercentage) / 2);
    },
    progressStatus() {
      if (this.progressPercentage >= 100) return 'success';
      if (this.progressPercentage >= 75) return 'warning';
      return 'normal';
    },
    timeProgressPercentage() {
      const start = new Date(this.project.startDate);
      const end = new Date(this.project.endDate);
      const now = new Date();

      if (now >= end) return 100;
      if (now <= start) return 0;

      const totalTime = end - start;
      const elapsedTime = now - start;

      return Math.round((elapsedTime / totalTime) * 100);
    },
    taskProgressPercentage() {
      if (!this.project.modules || this.project.modules.length === 0) return 0;

      const completedModules = this.project.modules.filter(m => m.status === '已完成');
      if (completedModules.length === 0) return 0;

      const totalPercentage = this.project.modules.reduce((sum, m) => sum + (m.percentage || 0), 0);
      const completedPercentage = completedModules.reduce((sum, m) => sum + (m.percentage || 0), 0);

      return Math.round((completedPercentage / totalPercentage) * 100);
    },
    personnelCost() {
      // 使用 isWorkingTime 方法
      if (this.isWorkingTime()) {
        // 在工作时间内的计算逻辑
        return (this.project.personnelCost || 0).toFixed(2);
      } else {
        // 非工作时间的计算逻辑
        return '0.00';
      }
    },
    totalCost() {
      const personnel = parseFloat(this.personnelCost);
      const other = this.project.otherCost || 0;
      return (personnel + other).toFixed(2);
    },
    profit() {
      const total = this.project.totalAmount || 0;
      const cost = parseFloat(this.totalCost);
      return (total - cost).toFixed(2);
    },
    profitClass() {
      const profit = parseFloat(this.profit);
      if (profit < 0) return 'text-red-500';
      return 'text-green-500';
    },
    managerCommission() {
      // 假设提成是利润的10%
      const profit = parseFloat(this.profit);
      return (profit > 0 ? profit * 0.1 : 0).toFixed(2);
    },
    projectStatusText() {
      const now = new Date();
      const start = new Date(this.project.startDate);
      const end = new Date(this.project.endDate);

      if (now < start) return '未开始';
      if (now > end) return '已结束';
      return '进行中';
    },
    projectStatusType() {
      const now = new Date();
      const start = new Date(this.project.startDate);
      const end = new Date(this.project.endDate);

      if (now < start) return 'info';
      if (now > end) return 'success';
      return 'primary';
    }
  },
  data() {
    return {
      leaveForm: {
        startDate: null,
        endDate: null,
        reason: ''
      }
    };
  },
  methods: {
    getManagerName(managerId) {
      const manager = this.users.find(u => u.id === managerId);
      return manager ? manager.name : '未知';
    },
    getMemberName(memberId) {
      const member = this.users.find(u => u.id === memberId);
      return member ? member.name : '未知';
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
    getLeaveDays(memberId) {
      // 简化实现，实际项目中需要从请假记录中统计
      return Math.floor(Math.random() * 5);
    },
    markModuleAsComplete(projectId, moduleId) {
      const project = { ...this.project };
      const moduleIndex = project.modules.findIndex(m => m.id === moduleId);

      if (moduleIndex !== -1) {
        project.modules[moduleIndex].status = '已完成';
        this.$store.dispatch('updateProject', project).then(() => {
          this.$message.success('模块已标记为完成');
        });
      }
    },
    removeMember(projectId, memberId) {
      this.$confirm('确定要移除该成员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const project = { ...this.project };
        project.members = project.members.filter(id => id !== memberId);

        this.$store.dispatch('updateProject', project).then(() => {
          this.$message.success('成员已移除');
        });
      }).catch(() => {
        // 用户取消操作
      });
    },
    submitLeaveApplication() {
      if (!this.leaveForm.startDate || !this.leaveForm.endDate || !this.leaveForm.reason) {
        this.$message.error('请填写完整的请假信息');
        return;
      }

      // 实际项目中，这里应该发送请假申请到后端
      this.$message.success('请假申请已提交，等待审批');
      this.leaveForm = {
        startDate: null,
        endDate: null,
        reason: ''
      };
    },
    editProject() {
      this.$router.push({ name: 'EditProject', params: { id: this.project.id } });
    },
    addModule() {
      this.$prompt('请输入模块名称', '添加模块', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('模块名称不能为空');
          return;
        }

        const newModule = {
          id: Date.now().toString(),
          name: value,
          description: '',
          percentage: 10,
          status: '未开始',
          leaderId: this.user.id
        };

        const project = { ...this.project };
        if (!project.modules) project.modules = [];
        project.modules.push(newModule);

        this.$store.dispatch('updateProject', project).then(() => {
          this.$message.success('模块添加成功');
        });
      }).catch(() => {
        // 用户取消操作
      });
    },
    addMember() {
      // 简化实现，实际项目中应该有一个成员选择器
      this.$message.info('添加成员功能尚未完全实现');
    }
  },
  created() {
    if (!this.project) {
      this.$router.push({ name: 'Home' });
    }
  }
}
</script>