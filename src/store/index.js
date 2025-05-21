import { createStore } from 'vuex';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    projects: JSON.parse(localStorage.getItem('projects')) || [],
    users: JSON.parse(localStorage.getItem('users')) || [
      {
        id: '1',
        username: 'admin',
        password: 'admin',
        name: '系统管理员',
        role: 'admin',
        status: 'approved'
      },
      {
        id: '2',
        username: 'manager',
        password: 'manager',
        name: '项目经理',
        role: 'manager',
        status: 'approved'
      },
      {
        id: '3',
        username: 'member',
        password: 'member',
        name: '项目成员',
        role: 'member',
        status: 'approved'
      },
      {
        id: '4',
        username: 'wzk',
        password: '123',
        name: '王昭康',
        role: 'member',
        status: 'approved'
      },
      {
        id: '5',
        username: 'cw',
        password: '123',
        name: '程文',
        role: 'member',
        status: 'approved'
      },
      {
        id: '6',
        username: 'lgp',
        password: '123',
        name: '吕高鹏',
        role: 'member',
        status: 'approved'
      }
    ]
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    LOGOUT(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
    SET_PROJECTS(state, projects) {
      state.projects = projects;
      localStorage.setItem('projects', JSON.stringify(projects));
    },
    ADD_PROJECT(state, project) {
      state.projects.push(project);
      localStorage.setItem('projects', JSON.stringify(state.projects));
    },
    UPDATE_PROJECT(state, updatedProject) {
      const index = state.projects.findIndex(p => p.id === updatedProject.id);
      if (index !== -1) {
        state.projects.splice(index, 1, updatedProject);
        localStorage.setItem('projects', JSON.stringify(state.projects));
      }
    },
    SET_USERS(state, users) {
      state.users = users;
      localStorage.setItem('users', JSON.stringify(users));
    },
    APPROVE_USER(state, userId) {
      const userIndex = state.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex].status = 'approved';
        localStorage.setItem('users', JSON.stringify(state.users));
      }
    }
  },
  actions: {
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = this.state.users.find(u => u.username === username && u.password === password);
          if (user && user.status === 'approved') {
            commit('SET_USER', user);
            resolve(user);
          } else if (user && user.status !== 'approved') {
            reject(new Error('账号未通过审核，请等待管理员审批'));
          } else {
            reject(new Error('认证失败，用户名或密码错误'));
          }
        }, 500);
      });
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
    fetchProjects({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const projects = JSON.parse(localStorage.getItem('projects')) || [];
          commit('SET_PROJECTS', projects);
          resolve(projects);
        }, 500);
      });
    },
    createProject({ commit }, project) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const projects = JSON.parse(localStorage.getItem('projects')) || [];
          project.id = Date.now().toString();
          projects.push(project);
          localStorage.setItem('projects', JSON.stringify(projects));
          commit('ADD_PROJECT', project);
          resolve(project);
        }, 500);
      });
    },
    updateProject({ commit }, project) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const projects = JSON.parse(localStorage.getItem('projects')) || [];
          const index = projects.findIndex(p => p.id === project.id);
          if (index !== -1) {
            projects.splice(index, 1, project);
            localStorage.setItem('projects', JSON.stringify(projects));
            commit('UPDATE_PROJECT', project);
          }
          resolve(project);
        }, 500);
      });
    },
    fetchUsers({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem('users')) || [];
          commit('SET_USERS', users);
          resolve(users);
        }, 500);
      });
    },
    registerUser({ commit }, user) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem('users')) || [];
          user.id = Date.now().toString();
          user.role = user.role || 'member';
          user.status = 'pending';
          users.push(user);
          localStorage.setItem('users', JSON.stringify(users));
          commit('SET_USERS', users);
          resolve(user);
        }, 500);
      });
    },
    approveUser({ commit }, userId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('APPROVE_USER', userId);
          resolve();
        }, 500);
      });
    }
  },
  getters: {
    user: (state) => state.user,
    projects: (state) => state.projects,
    userProjects: (state) => {
      if (!state.user) return [];
      if (state.user.role === 'admin') return state.projects;
      if (state.user.role === 'manager') {
        return state.projects.filter(p => p.managerId === state.user.id);
      }
      return state.projects.filter(p => p.members && p.members.includes(state.user.id));
    },
    users: (state) => state.users,
    isWorkingTime() {
      // 这里可以实现具体的工作时间判断逻辑
      // 简单示例，假设当前时间在 9:00 - 18:00 为工作时间
      const now = new Date();
      const hour = now.getHours();
      return hour >= 9 && hour < 18;
    }
  }
});