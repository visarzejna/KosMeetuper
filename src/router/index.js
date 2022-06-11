import Vue from "vue";
import Router from "vue-router";

import PageHome from "@/pages/PageHome";
import PageMeetupDetail from "@/pages/PageMeetupDetail";
import PageNotFound from "@/pages/PageNotFound";
import PageLogin from '@/pages/PageLogin'
import PageRegister from '@/pages/PageRegister'
import PageMeetupFind from "@/pages/PageMeetupFind";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "PageHome",
      component: PageHome,
    },
    {
      path: "/meetups/:id",
      name: "pageMeetupDetail",
      component: PageMeetupDetail,
    },
    {
      path: "/find",
      name: "PageMeetupFind",
      component: PageMeetupFind
    },
    {
      path: '/login',
      name: 'PageLogin',
      component: PageLogin
    },
    {
      path: '/register',
      name: 'PageRegister',
      component: PageRegister
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ],
  mode: 'history'
});

export default router;
