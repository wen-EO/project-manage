<template>
  <div class="container mx-auto p-4">
    <el-card class="mb-6">
      <template #header>
        <h3 class="font-bold">编辑项目</h3>
      </template>
      <el-form :model="projectForm" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input v-model="projectForm.description" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="projectForm.startDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="projectForm.endDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目预算" prop="totalAmount">
          <el-input v-model.number="projectForm.totalAmount" type="number"></el-input>
        </el-form-item>
        <el-form-item label="项目经理" prop="managerId">
          <el-select v-model="projectForm.managerId" placeholder="请选择">
            <el-option
              v-for="user in managers"
              :key="user.id"
              :label="user.name"
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目模块">
          <el-button type="primary" size="small" @click="addModule">添加模块</el-button>
          <el-table v-if="projectForm.modules && projectForm.modules.length > 0" :data="projectForm.modules" stripe style="width: 100%; margin-top: 20px">
            <el-table-column prop="name" label="模块名称">
              <template #default="scope">
                <el-input v-model="scope.row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="percentage" label="占比(%)">
              <template #default="scope">
                <el-input v-model.number="scope.row.percentage" type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="负责人">
              <template #default="scope">
                <el-select v-model="scope.row.assignee" placeholder="请选择">
                  <el-option
                    v-for="user in projectMembers"
                    :key="user.id"
                    :label="user.name"
                    :value="user.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="scope">
                <el-select v-model="scope.row.status" placeholder="请选择">
                  <el-option label="未开始" value="未开始"></el-option>
                  <el-option label="进行中" value="进行中"></el-option>
                  <el-option label="已完成" value="已完成"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" size="small" @click="removeModule(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="项目成员">
          <el-select v-model="selectedMembers" multiple placeholder="请选择" @change="updateProjectMembers">
            <el-option
              v-for="user in availableMembers"
              :key="user.id"
              :label="user.name"
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'EditProject',
  computed: {
    ...mapGetters(['user', 'users', 'projects']),
    managers() {
      return this.users.filter(u => u.role === 'manager');
    },
    availableMembers() {
      return this.users.filter(u => u.role === 'member');
    },
    projectMembers() {
      return this.users.filter(u => this.selectedMembers.includes(u.id));
    },
    originalProject() {
      return this.projects.find(p => p.id === this.$route.params.id);
    }
  },
  data() {
    return {
      projectForm: {
        id: '',
        name: '',
        description: '',
        startDate: null,
        endDate: null,
        totalAmount: 0,
        managerId: '',
        members: [],
        modules: []
      },
      selectedMembers: [],
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        totalAmount: [
          { required: true, message: '请输入项目预算', trigger: 'blur' },
          { type: 'number', message: '预算必须为数字值', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (value <= 0) {
                callback(new Error('项目预算必须大于0'));
              } else {
                callback();
              }
            }, trigger: 'blur' }
        ],
        managerId: [
          { required: true, message: '请选择项目经理', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    addModule() {
      this.projectForm.modules.push({
        id: Date.now().toString(),
        name: `模块${this.projectForm.modules.length + 1}`,
        percentage: 100 / (this.projectForm.modules.length + 1),
        assignee: '',
        status: '未开始'
      });
    },
    removeModule(index) {
      this.projectForm.modules.splice(index, 1);
    },
    updateProjectMembers() {
      this.projectForm.members = [...this.selectedMembers];
    },
    submitForm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          // 验证模块占比总和是否为100%
          const totalPercentage = this.projectForm.modules.reduce((sum, module) => sum + (module.percentage || 0), 0);
          if (Math.abs(totalPercentage - 100) > 0.01) {
            this.$message.error('模块占比总和必须为100%');
            return;
          }
          
          // 验证开始日期是否小于结束日期
          if (this.projectForm.startDate && this.projectForm.endDate && new Date(this.projectForm.startDate) >= new Date(this.projectForm.endDate)) {
            this.$message.error('开始日期必须早于结束日期');
            return;
          }
          
          // 提交项目数据
          this.$store.dispatch('updateProject', this.projectForm).then(() => {
            this.$message.success('项目更新成功');
            this.$router.push({ name: 'ProjectDetails', params: { id: this.projectForm.id } });
          });
        } else {
          this.$message.error('请填写完整且正确的项目信息');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.formRef.resetFields();
      this.loadProjectData();
    },
    loadProjectData() {
      if (this.originalProject) {
        this.projectForm = { ...this.originalProject };
        this.selectedMembers = [...this.originalProject.members || []];
      }
    }
  },
  created() {
    this.loadProjectData();
  }
}
</script>
  