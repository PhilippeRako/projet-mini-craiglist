import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import LandingView from '../views/LandingView.vue'
import DashboardView from '../views/DashboardView.vue'
import AdCreateView from '../views/AdCreateView.vue'
import AdEditView from '../views/AdEditView.vue'
import MyAdsView from '../views/MyAdsView.vue'

const authCheck = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/auth/me', {
      credentials: 'include'
    });
    return res.ok;
  } catch (err) {
    return false;
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/create-ad',
      name: 'create-ad',
      component: AdCreateView,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/edit-ad/:id',
      name: 'edit-ad',
      component: AdEditView,
      meta: { requiresAuth: true }
    },
    {
      path: '/ad/:id',
      name: 'ad-detail',
      component: () => import('../views/AdDetailView.vue')
    },

    {
      path: '/conversation/:id',
      name: 'conversation',
      component: () => import('../views/ConversationView.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/inbox',
      name: 'inbox',
      component: () => import('../views/InboxView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my-ads',
      name: 'my-ads',
      component: MyAdsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profil/edit',
      name: 'profil-edit',
      component: () => import('../views/ProfileEditView.vue'),
      meta: { requiresAuth: true }
    }



  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authCheck();
    if (!isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } });
    }
  }
  next();
});

export default router
