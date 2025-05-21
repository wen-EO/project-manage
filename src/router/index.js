import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ProjectDetails from '../views/ProjectDetails.vue';
import CreateProject from '../views/CreateProject.vue';
import UserRegister from '../views/UserRegister.vue';
import EditProject from '../views/EditProject.vue';
import Login from '../components/Login.vue';
import UserBaseSalary from '../views/UserBaseSalary.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/project/:id',
    name: 'ProjectDetails',
    component: ProjectDetails
  },
  {
    path: '/create-project',
    name: 'CreateProject',
    component: CreateProject,
    meta: { requiresAuth: true, roles: ['manager', 'admin'] }
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister
  },
  {
    path: '/edit-project/:id',
    name: 'EditProject',
    component: EditProject,
    meta: { requiresAuth: true, roles: ['manager'] }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/user-base-salary',
    name: 'UserBaseSalary',
    component: UserBaseSalary,
    meta: { requiresAuth: true, roles: ['admin'] }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' });
  } else if (to.meta.roles && user && !to.meta.roles.includes(user.role)) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;