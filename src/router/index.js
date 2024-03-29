import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import PageHome from '@/pages/PageHome'
import PageMeetupDetail from '@/pages/PageMeetupDetail'
import PageMeetupFind from '@/pages/PageMeetupFind'
import PageMeetupCreate from '@/pages/PageMeetupCreate'
import PageLogin from '@/pages/PageLogin'
import PageRegister from '@/pages/PageRegister'
import PageProfile from '@/pages/PageProfile'
import PageAdminDashboard from '@/pages/PageAdminDashboard'
import PageNotFound from '@/pages/PageNotFound'
import PageNotAuthenticated from '@/pages/PageNotAuthenticated'
import PageMeetupEdit from '@/pages/PageMeetupEdit'
import PageContactUs from '@/pages/PageContactUs'
import PageFAQ from '@/pages/PageFAQ'
import PageAboutUs from '@/pages/PageAboutUs'
import PageActivateUser from '@/pages/PageActivateUser'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'PageHome',
      component: PageHome
    },
    {
      path: '/about',
      name: 'PageAboutUs',
      component: PageAboutUs
    },
    {
      path: '/find/:category',
      name: 'PageMeetupFindCategory',
      component: PageMeetupFind,
      props: true
    },
    {
      path: '/find',
      name: 'PageMeetupFind',
      component: PageMeetupFind
    },
    {
      path: '/meetups/new',
      name: 'PageMeetupCreate',
      component: PageMeetupCreate,
      meta: {onlyAuthUser: true}
    },
    {
      path: '/admin',
      name: 'PageAdminDashboard',
      component: PageAdminDashboard,
      meta: {onlyAuthUser: true}
    },
    {
      path: '/meetups/:id',
      name: 'PageMeetupDetail',
      component: PageMeetupDetail
    },
    {
      path: '/contact',
      name: 'PageContactUs',
      component: PageContactUs
    },
    {
      path: '/faq',
      name: 'PageFAQ',
      component: PageFAQ
    },
    {
      path: '/meetups/:meetupId/edit',
      name: 'PageMeetupEdit',
      component: PageMeetupEdit,
      meta: {onlyAuthUser: true},
      props: true
    },
    {
      path: '/login',
      name: 'PageLogin',
      component: PageLogin,
      meta: { onlyGuestUser: true }
    },
    {
      path: '/register',
      name: 'PageRegister',
      component: PageRegister,
      meta: { onlyGuestUser: true }
    },
    {
      path: '/users/:hash/activate',
      name: 'PageActivateUser',
      component: PageActivateUser,
      meta: { onlyGuestUser: true }
    },
    {
      path: '/me',
      name: 'PageProfile',
      component: PageProfile,
      meta: {onlyAuthUser: true}
  },
    {
      path: '/401',
      name: 'PageNotAuthenticated',
      component: PageNotAuthenticated
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ],
  mode: 'history'
})


router.beforeEach((to, from, next) => {
  store.dispatch('auth/getAuthUser')
    .then(() => {
      const isAuthenticated = store.getters['auth/isAuthenticated']

      if (to.meta.onlyAuthUser) {
        if (isAuthenticated) {
          next()
        } else {
          next({name: 'PageNotAuthenticated'})
        }
      } else if (to.meta.onlyGuestUser) {
        if (isAuthenticated) {
          next({name: 'PageHome'})
        } else {
          next()
        }
      } else {
        next()
      }
    })
})

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  });
}

export default router