import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/backend/Login'
import index from '@/components/backend/Index'
import activityfrom from '@/components/backend/ActivityFrom'
import participantfrom from '@/components/backend/ParticipantFrom'
import participant from '@/components/backend/participant'
import activity from '@/components/backend/Activity'
import lottery from '@/components/backend/Lottery'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: index,
      children: [
        {
          path: '/activity',
          name: 'activity',
          component: activity
        },
        {
          path: '/activityfrom',
          name: 'activityfrom',
          component: activityfrom
        },
        {
          path: '/participantfrom',
          name: 'participantfrom',
          component: participantfrom
        },
        {
          path: '/participant',
          name: 'participant',
          component: participant
        },
        {
          path: '/lottery',
          name: 'lottery',
          component: lottery
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
