import { createStore } from 'vuex';

// 法定工作日工作时间（早9点到下午6点）
const WORK_START_TIME = 9 * 60; // 9点换算成分钟
const WORK_END_TIME = 18 * 60; // 18点换算成分钟

// 判断是否为法定工作日
function isWeekday(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

// 判断是否在工作时间内
function isWorkingTime(date) {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return isWeekday(date) && minutes >= WORK_START_TIME && minutes <= WORK_END_TIME;
}

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
        status: 'approved',
        baseSalary: 5000 // 添加人员底薪信息
      },
      {
        id: '2',
        username: 'manager',
        password: 'manager',
        name: '项目经理',
        role: 'manager',
        status: 'approved',
        baseSalary: 6000
      },
      {
        id: '3',
        username: 'member',
        password: 'member',
        name: '项目成员',
        role: 'member',
        status: 'approved',
        baseSalary: 4000
      },
      {
        id: '4',
        username: 'wzk',
        password: '123',
        name: '王昭康',
        role: 'member',
        status: 'approved',
        baseSalary: 4500
      },
      {
        id: '5',
        username: 'cw',
        password: '123',
        name: '程文',
        role: 'member',
        status: 'approved',
        baseSalary: 4200
      },
      {
        id: '6',
        username: 'lgp',
        password: '123',
        name: '吕高鹏',
        role: 'member',
        status: 'approved',
        baseSalary: 4300
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
    },
    UPDATE_USER_BASE_SALARY(state, { userId, baseSalary }) {
      const userIndex = state.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex].baseSalary = baseSalary;
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
    },
    updateUserBaseSalary({ commit }, { userId, baseSalary }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('UPDATE_USER_BASE_SALARY', { userId, baseSalary });
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
    users: (state) => state.users
  }
});