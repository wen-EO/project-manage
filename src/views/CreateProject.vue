<template>
  <div class="create-project">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>创建项目</span>
        </div>
      </template>
      <el-form :model="project" label-width="120px" class="p-4">
        <el-form-item label="项目名称">
          <el-input v-model="project.name"></el-input>
        </el-form-item>
        <el-form-item label="项目编号">
          <el-input v-model="project.code"></el-input>
        </el-form-item>
        <el-form-item label="项目经理">
          <el-select v-model="project.managerId" placeholder="请选择项目经理">
            <el-option
                v-for="user in managers"
                :key="user.id"
                :label="user.name || user.username"
                :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
              v-model="project.startDate"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
              v-model="project.endDate"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目预算">
          <el-input v-model.number="project.totalAmount" type="number"></el-input>
        </el-form-item>
        <el-form-item label="人员成本">
          <el-input v-model.number="project.personnelCost" type="number"></el-input>
        </el-form-item>
        <el-form-item label="其他成本">
          <el-input v-model.number="project.otherCost" type="number"></el-input>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input
              v-model="project.description"
              type="textarea"
              :rows="4"
              placeholder="请输入项目描述">
          </el-input>
        </el-form-item>
        <el-form-item label="项目成员">
          <el-select
              v-model="project.members"
              multiple
              collapse-tags
              placeholder="请选择项目成员">
            <el-option
                v-for="user in availableMembers"
                :key="user.id"
                :label="user.name || user.username"
                :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目模块">
          <el-table
              :data="project.modules || []"
              stripe
              style="width: 100%">
            <el-table-column prop="name" label="模块名称">
              <template #default="scope">
                <el-input v-model="scope.row.name" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述">
              <template #default="scope">
                <el-input v-model="scope.row.description" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="percentage" label="权重">
              <template #default="scope">
                <el-input-number v-model.number="scope.row.percentage" size="small" :min="1" :max="100"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-select v-model="scope.row.status" size="small">
                  <el-option label="未开始" value="未开始"></el-option>
                  <el-option label="进行中" value="进行中"></el-option>
                  <el-option label="已完成" value="已完成"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="负责人">
              <template #default="scope">
                <el-select v-model="scope.row.leaderId" size="small">
                  <el-option
                      v-for="user in project.members ? users.filter(u => project.members.includes(u.id)) : []"
                      :key="user.id"
                      :label="user.name || user.username"
                      :value="user.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="link" size="small" @click="removeModule(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" style="margin-top: 10px" @click="addModule">添加模块</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createProject">创建</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CreateProject',
  data() {
    return {
      project: {
        name: '',
        code: '',
        managerId: '',
        startDate: '',
        endDate: '',
        totalAmount: 0,
        personnelCost: 0,
        otherCost: 0,
        description: '',
        members: [],
        modules: []
      }
    };
  },
  computed: {
    ...mapGetters(['user', 'users']),
    managers() {
      return this.users.filter(u => u.role === 'manager' || u.role === 'admin');
    },
    availableMembers() {
      return this.users.filter(u => u.role !== 'admin');
    }
  },
  methods: {
    createProject() {
      if (!this.project.name) {
        this.$message.error('项目名称不能为空');
        return;
      }

      if (!this.project.managerId) {
        this.$message.error('请选择项目经理');
        return;
      }

      if (!this.project.startDate || !this.project.endDate) {
        this.$message.error('请选择开始日期和结束日期');
        return;
      }

      this.$store.dispatch('createProject', this.project).then(() => {
        this.$message.success('项目创建成功');
        this.$router.push({ name: 'Home' });
      });
    },
    cancel() {
      this.$router.back();
    },
    addModule() {
      if (!this.project.modules) {
        this.project.modules = [];
      }

      const newModule = {
        id: Date.now().toString(),
        name: '新模块',
        description: '',
        percentage: 10,
        status: '未开始',
        leaderId: this.project.managerId
      };

      this.project.modules.push(newModule);
    },
    removeModule(index) {
      this.project.modules.splice(index, 1);
    }
  },
  created() {
    if (!this.user) {
      this.$message.error('请先登录');
      this.$router.push({ name: 'Login' });
    }

    // 默认设置当前用户为项目经理
    if (this.user && (this.user.role === 'admin' || this.user.role === 'manager')) {
      this.project.managerId = this.user.id;
    }
  }
}
</script>