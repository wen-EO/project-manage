<template>
  <div class="container mx-auto p-4">
    <el-card class="mb-6">
      <template #header>
        <h3 class="font-bold">设置人员底薪</h3>
      </template>
      <el-table :data="users" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column label="底薪">
          <template #default="scope">
            <el-input v-model.number="scope.row.baseSalary" type="number"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="saveBaseSalary(scope.row.id, scope.row.baseSalary)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UserBaseSalary',
  computed: {
    ...mapGetters(['users'])
  },
  methods: {
    saveBaseSalary(userId, baseSalary) {
      this.$store.dispatch('updateUserBaseSalary', { userId, baseSalary }).then(() => {
        this.$message.success('底薪设置成功');
      });
    }
  }
}
</script>