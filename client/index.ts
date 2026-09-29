import { Context, icons, message, pick, router, send, store } from '@koishijs/client'
import { watch } from 'vue'
import { shared } from './utils'
import Login from './login.vue'
import Profile from './profile.vue'
import Check from './icons/check.vue'
import Clock from './icons/clock.vue'
import Desktop from './icons/desktop.vue'
import Lock from './icons/lock.vue'
import Mobile from './icons/mobile.vue'
import SignIn from './icons/sign-in.vue'
import SignOut from './icons/sign-out.vue'
import UserFull from './icons/user-full.vue'

icons.register('check', Check)
icons.register('clock', Clock)
icons.register('desktop', Desktop)
icons.register('lock', Lock)
icons.register('mobile', Mobile)
icons.register('sign-in', SignIn)
icons.register('sign-out', SignOut)
icons.register('user-full', UserFull)

function clearShared() {
  shared.value.id = undefined
  shared.value.name = undefined
  shared.value.token = undefined
  shared.value.expiredAt = undefined
  shared.value.refreshToken = undefined
}

async function autoLogin() {
  const { id, token, expiredAt, refreshToken } = shared.value
  if (id && token && expiredAt && expiredAt > Date.now()) {
    try {
      await send('login/token', id, token)
    } catch {
      clearShared()
    }
    return
  }
  if (refreshToken) {
    try {
      await send('login/refresh', refreshToken)
    } catch {
      clearShared()
    }
  }
}

export default (ctx: Context) => {
  autoLogin()

  ctx.on('activity', (data) => {
    return data.authority > 0 && (!store.user || store.user.authority < data.authority)
  })

  ctx.scope.disposables.push(router.beforeEach((route) => {
    const { activity } = route.meta
    if (!activity) return

    const requiresUser = activity.authority > 0 || activity.fields?.includes('user')
    if (requiresUser && !store.user) {
      return route.path === '/login' ? undefined : '/login'
    }

    if (activity.authority && activity.authority > (store.user?.authority ?? 0)) {
      message.error('权限不足。')
      return false
    }

    if (store.user && route.path === '/login') {
      return '/profile'
    }
  }))

  ctx.page({
    path: '/login',
    name: '登录',
    icon: 'sign-in',
    position: 'bottom',
    order: 500,
    disabled: () => !!store.user,
    component: Login,
  })

  ctx.page({
    path: '/profile',
    name: '用户资料',
    icon: 'user-full',
    fields: ['user'],
    position: 'bottom',
    order: 500,
    component: Profile,
  })

  watch(() => store.user, (value) => {
    if (!value) {
      return router.push('/login')
    }
    Object.assign(shared.value, pick(value, ['id', 'name', 'token', 'expiredAt']))
    const from = router.currentRoute.value.redirectedFrom
    if (from && !from.path.startsWith('/login')) {
      router.push(from)
    } else {
      router.push('/profile')
    }
  }, { immediate: true })

  watch(() => store.refreshToken, (value) => {
    if (value) shared.value.refreshToken = value
  })

  let heartbeatTimer: ReturnType<typeof setInterval> | null = null
  function startHeartbeat() {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    heartbeatTimer = setInterval(() => {
      if (store.user) {
        const request = send('user/heartbeat')
        if (request) request.catch(() => {})
      }
    }, 60 * 1000)
  }
  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  watch(() => store.user, (value) => {
    if (value) startHeartbeat()
    else stopHeartbeat()
  }, { immediate: true })

  ctx.on('dispose', () => stopHeartbeat())
}
