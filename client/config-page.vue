<template>
  <div class="ba-config">
    <div class="ba-config-header">
      <h1>Better Auth 插件设置</h1>
      <p class="ba-config-desc">管理认证、令牌、安全、通知与调试配置</p>
    </div>

    <div class="ba-config-toolbar">
      <el-input
        v-model="search"
        placeholder="搜索配置项"
        clearable
        class="ba-config-search"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="ba-config-actions">
        <el-button @click="resetCurrentModule">
          <el-icon><RefreshLeft /></el-icon>
          <span>重置当前模块</span>
        </el-button>
        <el-button type="primary" :loading="saving" @click="saveAll">
          <el-icon><Check /></el-icon>
          <span>保存配置</span>
        </el-button>
      </div>
    </div>

    <el-alert
      v-if="message"
      :title="message"
      :type="messageType"
      :closable="true"
      @close="message = ''"
      class="ba-config-message"
    />

    <div class="ba-config-modules">
      <div
        v-for="mod in visibleModules"
        :key="mod.key"
        class="ba-config-module"
      >
        <div class="ba-module-header" @click="toggleModule(mod.key)">
          <div class="ba-module-title">
            <el-icon><component :is="mod.icon" /></el-icon>
            <span>{{ mod.title }}</span>
          </div>
          <div class="ba-module-meta">
            <el-tag v-if="isAdvanced(mod.key)" type="info" size="small">高级</el-tag>
            <el-tag v-if="isExperimental(mod.key)" type="warning" size="small">实验</el-tag>
            <el-tag v-if="isDebug(mod.key)" type="danger" size="small">调试</el-tag>
            <el-icon class="ba-module-arrow" :class="{ 'is-expanded': expandedModules.includes(mod.key) }">
              <ArrowDown />
            </el-icon>
          </div>
        </div>

        <el-collapse-transition>
          <div v-show="expandedModules.includes(mod.key)" class="ba-module-body">
            <div class="ba-module-desc">{{ mod.description }}</div>

            <div class="ba-module-items">
              <div v-for="field in mod.fields" :key="field.key" class="ba-field">
                <div class="ba-field-header">
                  <label class="ba-field-label">{{ field.label }}</label>
                  <span v-if="field.default !== undefined" class="ba-field-default">默认：{{ formatValue(field.default) }}</span>
                </div>
                <div class="ba-field-control">
                  <el-switch
                    v-if="field.type === 'boolean'"
                    v-model="form[field.key]"
                    :disabled="saving"
                    @change="onFieldChange(field)"
                  />
                  <el-input-number
                    v-else-if="field.type === 'number'"
                    v-model="form[field.key]"
                    :disabled="saving"
                    :min="field.min"
                    :max="field.max"
                    :step="field.step ?? 1"
                    @change="onFieldChange(field)"
                  />
                  <el-select
                    v-else-if="field.type === 'select'"
                    v-model="form[field.key]"
                    :disabled="saving"
                    @change="onFieldChange(field)"
                  >
                    <el-option
                      v-for="opt in field.options"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                  <el-input
                    v-else-if="field.type === 'password'"
                    v-model="form[field.key]"
                    :disabled="saving"
                    type="password"
                    show-password
                    @input="onFieldChange(field)"
                  />
                  <el-input
                    v-else
                    v-model="form[field.key]"
                    :disabled="saving"
                    @input="onFieldChange(field)"
                  />
                </div>
                <div class="ba-field-footer">
                  <span class="ba-field-hint">{{ field.hint }}</span>
                  <span v-if="fieldErrors[field.key]" class="ba-field-error">{{ fieldErrors[field.key] }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useConfig, send, message } from '@koishijs/client'
import {
  Search,
  RefreshLeft,
  Check,
  ArrowDown,
  User,
  Lock,
  Key,
  Clock,
  Bell,
  Monitor,
} from '@element-plus/icons-vue'

const config = useConfig(true)

const form = reactive({
  adminEnabled: true,
  adminUsername: 'admin',
  adminPassword: '',
  maxLoginAttempts: 5,
  lockTime: 900,
  idleTimeout: 1800,
  passwordMinLength: 6,
  passwordRequireSpecialChar: false,
  authExpire: 604800,
  refreshExpire: 2592000,
  rememberExpire: 2592000,
  maxTokensPerUser: 20,
  revokeOnPasswordChange: true,
  cleanupEnabled: true,
  cleanupInterval: 3600,
  tokenRetention: 604800,
  refreshTokenRetention: 2592000,
  attemptRetention: 86400,
  notifyEnabled: false,
  notifyTarget: '',
  notifyRobotId: '',
  loginSuccess: true,
  loginFail: false,
  debugEnabled: false,
  logTokenOps: false,
  logLoginAttempts: false,
  logNotifications: false,
  logCleanup: false,
  logExtensions: false,
})

const search = ref('')
const expandedModules = ref(['basic', 'security', 'token'])
const saving = ref(false)
const message = ref('')
const messageType = ref('success')
const fieldErrors = reactive<Record<string, string>>({})

const modules = [
  {
    key: 'basic',
    title: '基础设置',
    icon: User,
    description: '管理员账号与基础运行参数',
    order: 1,
    fields: [
      { key: 'adminEnabled', label: '启用管理员账号', type: 'boolean', default: true, hint: '启用后将自动创建/确保管理员账号存在' },
      { key: 'adminUsername', label: '管理员用户名', type: 'string', default: 'admin', hint: '管理员账号的用户名' },
      { key: 'adminPassword', label: '管理员密码', type: 'password', default: '', hint: '修改后将自动更新管理员密码' },
    ],
  },
  {
    key: 'security',
    title: '安全设置',
    icon: Lock,
    description: '登录限制、密码策略与空闲超时',
    order: 2,
    fields: [
      { key: 'maxLoginAttempts', label: '最大登录尝试次数', type: 'number', default: 5, min: 1, max: 50, hint: '超出后将触发登录锁定' },
      { key: 'lockTime', label: '登录锁定时间（秒）', type: 'number', default: 900, min: 60, hint: '登录失败过多后的锁定时长' },
      { key: 'idleTimeout', label: '空闲超时时间（秒）', type: 'number', default: 1800, min: 0, hint: '0 表示不限制，超时后自动退出登录' },
      { key: 'passwordMinLength', label: '密码最小长度', type: 'number', default: 6, min: 4, max: 32, hint: '建议不小于 6 位' },
      { key: 'passwordRequireSpecialChar', label: '密码必须包含特殊字符', type: 'boolean', default: false, hint: '启用后会要求密码包含特殊字符' },
    ],
  },
  {
    key: 'token',
    title: '令牌设置',
    icon: Key,
    description: '令牌有效期、刷新令牌与会话上限',
    order: 3,
    fields: [
      { key: 'authExpire', label: '用户令牌有效期（秒）', type: 'number', default: 604800, min: 60, hint: '默认 7 天' },
      { key: 'refreshExpire', label: '刷新令牌有效期（秒）', type: 'number', default: 2592000, min: 60, hint: '默认 30 天' },
      { key: 'rememberExpire', label: '记住我令牌有效期（秒）', type: 'number', default: 2592000, min: 60, hint: '默认 30 天' },
      { key: 'maxTokensPerUser', label: '每个用户最大令牌数', type: 'number', default: 20, min: 1, hint: '超出后自动移除最早令牌' },
      { key: 'revokeOnPasswordChange', label: '修改密码时撤销所有令牌', type: 'boolean', default: true, hint: '提升安全性，但会要求重新登录' },
    ],
  },
  {
    key: 'cleanup',
    title: '数据清理',
    icon: Clock,
    description: '过期令牌、刷新令牌与登录尝试记录清理',
    order: 4,
    fields: [
      { key: 'cleanupEnabled', label: '启用自动数据清理', type: 'boolean', default: true, hint: '定时清理过期数据以降低存储占用' },
      { key: 'cleanupInterval', label: '清理间隔（秒）', type: 'number', default: 3600, min: 300, hint: '建议不少于 300 秒' },
      { key: 'tokenRetention', label: '令牌保留时间（秒）', type: 'number', default: 604800, min: 60, hint: '过期令牌的保留时长' },
      { key: 'refreshTokenRetention', label: '刷新令牌保留时间（秒）', type: 'number', default: 2592000, min: 60, hint: '默认 30 天' },
      { key: 'attemptRetention', label: '登录尝试记录保留时间（秒）', type: 'number', default: 86400, min: 60, hint: '默认 1 天' },
    ],
  },
  {
    key: 'notification',
    title: '登录提醒',
    icon: Bell,
    description: '登录成功/失败时的群聊提醒',
    order: 5,
    fields: [
      { key: 'notifyEnabled', label: '启用登录提醒', type: 'boolean', default: false, hint: '需要机器人插件可发送消息' },
      { key: 'notifyTarget', label: '目标群号', type: 'string', default: '', hint: '接收提醒的群号' },
      { key: 'notifyRobotId', label: '指定机器人账号', type: 'string', default: '', hint: '留空自动使用第一个可用机器人' },
      { key: 'loginSuccess', label: '登录成功时发送提醒', type: 'boolean', default: true, hint: '登录成功时发送提醒' },
      { key: 'loginFail', label: '登录失败时发送提醒', type: 'boolean', default: false, hint: '登录失败时发送提醒' },
    ],
  },
  {
    key: 'debug',
    title: '调试设置',
    icon: Monitor,
    description: '后端调试日志开关，仅输出到运行日志',
    order: 6,
    advanced: true,
    fields: [
      { key: 'debugEnabled', label: '启用调试日志', type: 'boolean', default: false, hint: '仅输出到后端日志，不影响前端性能' },
      { key: 'logTokenOps', label: '记录令牌操作日志', type: 'boolean', default: false, hint: '记录令牌创建/撤销操作' },
      { key: 'logLoginAttempts', label: '记录登录尝试日志', type: 'boolean', default: false, hint: '记录成功/失败登录尝试' },
      { key: 'logNotifications', label: '记录通知发送日志', type: 'boolean', default: false, hint: '记录登录提醒发送结果' },
      { key: 'logCleanup', label: '记录数据清理日志', type: 'boolean', default: false, hint: '记录清理任务的执行结果' },
      { key: 'logExtensions', label: '记录扩展钩子日志', type: 'boolean', default: false, hint: '记录扩展钩子执行情况' },
    ],
  },
]

const sortedModules = computed(() => modules.slice().sort((a, b) => a.order - b.order))

const visibleModules = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return sortedModules.value
  return sortedModules.value
    .map(mod => {
      const matchedFields = mod.fields.filter(f => f.label.toLowerCase().includes(keyword) || f.hint.toLowerCase().includes(keyword))
      if (!matchedFields.length) return null
      return { ...mod, fields: matchedFields }
    })
    .filter(Boolean) as typeof modules
})

function isAdvanced(key: string) {
  return ['debug'].includes(key)
}

function isExperimental(key: string) {
  return []
}

function isDebug(key: string) {
  return ['debug'].includes(key)
}

function toggleModule(key: string) {
  const idx = expandedModules.value.indexOf(key)
  if (idx >= 0) expandedModules.value.splice(idx, 1)
  else expandedModules.value.push(key)
}

function formatValue(value: any) {
  if (typeof value === 'boolean') return value ? '是' : '否'
  if (Number.isInteger(value)) return String(value)
  return String(value)
}

function validateField(field: any) {
  const value = form[field.key]
  if (field.type === 'number') {
    if (field.min !== undefined && Number(value) < field.min) {
      fieldErrors[field.key] = `最小值为 ${field.min}`
      return false
    }
    if (field.max !== undefined && Number(value) > field.max) {
      fieldErrors[field.key] = `最大值为 ${field.max}`
      return false
    }
  }
  delete fieldErrors[field.key]
  return true
}

function onFieldChange(field: any) {
  validateField(field)
}

function buildPayload() {
  return {
    admin: {
      enabled: form.adminEnabled,
      username: form.adminUsername,
      password: form.adminPassword || undefined,
    },
    security: {
      maxLoginAttempts: form.maxLoginAttempts,
      lockTime: form.lockTime,
      idleTimeout: form.idleTimeout,
      passwordMinLength: form.passwordMinLength,
      passwordRequireSpecialChar: form.passwordRequireSpecialChar,
      passwordHashAlgorithm: 'sha256',
    },
    token: {
      authExpire: form.authExpire,
      refreshExpire: form.refreshExpire,
      rememberExpire: form.rememberExpire,
      maxTokensPerUser: form.maxTokensPerUser,
      revokeOnPasswordChange: form.revokeOnPasswordChange,
    },
    cleanup: {
      enabled: form.cleanupEnabled,
      interval: form.cleanupInterval,
      tokenRetention: form.tokenRetention,
      refreshTokenRetention: form.refreshTokenRetention,
      attemptRetention: form.attemptRetention,
    },
    notification: {
      enabled: form.notifyEnabled,
      target: form.notifyTarget,
      robotId: form.notifyRobotId,
      loginSuccess: form.loginSuccess,
      loginFail: form.loginFail,
    },
    debug: {
      enabled: form.debugEnabled,
      logTokenOps: form.logTokenOps,
      logLoginAttempts: form.logLoginAttempts,
      logNotifications: form.logNotifications,
      logCleanup: form.logCleanup,
      logExtensions: form.logExtensions,
    },
  }
}

async function saveAll() {
  const modulesToValidate = sortedModules.value.flatMap(mod => mod.fields)
  const valid = modulesToValidate.every(validateField)
  if (!valid) {
    message.value = '请修正配置项错误后再保存'
    messageType.value = 'error'
    return
  }

  saving.value = true
  message.value = ''
  try {
    await send('config/better-auth/update', buildPayload())
    message.value = '配置已保存'
    messageType.value = 'success'
  } catch (e: any) {
    message.value = e?.message || '保存失败'
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

function resetCurrentModule() {
  const activeKey = expandedModules.value[0]
  if (!activeKey) return
  const mod = modules.find(m => m.key === activeKey)
  if (!mod) return
  for (const field of mod.fields) {
    form[field.key] = field.default
    delete fieldErrors[field.key]
  }
  message.value = '已重置当前模块为默认值'
  messageType.value = 'info'
}

watch(() => config.value, (val) => {
  applyConfig(val)
}, { immediate: true, deep: true })

function applyConfig(val: any) {
  const pluginConfig = val?.betterAuth ?? val?.better_auth ?? {}
  const admin = pluginConfig.admin ?? {}
  const security = pluginConfig.security ?? {}
  const token = pluginConfig.token ?? {}
  const cleanup = pluginConfig.cleanup ?? {}
  const notification = pluginConfig.notification ?? {}
  const debug = pluginConfig.debug ?? {}

  form.adminEnabled = admin.enabled ?? true
  form.adminUsername = admin.username ?? 'admin'
  form.adminPassword = admin.password ?? ''
  form.maxLoginAttempts = security.maxLoginAttempts ?? 5
  form.lockTime = security.lockTime ?? 900
  form.idleTimeout = security.idleTimeout ?? 1800
  form.passwordMinLength = security.passwordMinLength ?? 6
  form.passwordRequireSpecialChar = security.passwordRequireSpecialChar ?? false
  form.authExpire = token.authExpire ?? 604800
  form.refreshExpire = token.refreshExpire ?? 2592000
  form.rememberExpire = token.rememberExpire ?? 2592000
  form.maxTokensPerUser = token.maxTokensPerUser ?? 20
  form.revokeOnPasswordChange = token.revokeOnPasswordChange ?? true
  form.cleanupEnabled = cleanup.enabled ?? true
  form.cleanupInterval = cleanup.interval ?? 3600
  form.tokenRetention = cleanup.tokenRetention ?? 604800
  form.refreshTokenRetention = cleanup.refreshTokenRetention ?? 2592000
  form.attemptRetention = cleanup.attemptRetention ?? 86400
  form.notifyEnabled = notification.enabled ?? false
  form.notifyTarget = notification.target ?? ''
  form.notifyRobotId = notification.robotId ?? ''
  form.loginSuccess = notification.loginSuccess ?? true
  form.loginFail = notification.loginFail ?? false
  form.debugEnabled = debug.enabled ?? false
  form.logTokenOps = debug.logTokenOps ?? false
  form.logLoginAttempts = debug.logLoginAttempts ?? false
  form.logNotifications = debug.logNotifications ?? false
  form.logCleanup = debug.logCleanup ?? false
  form.logExtensions = debug.logExtensions ?? false
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaConfigPage',
})
</script>

<style lang="scss" scoped>
.ba-config {
    padding: 1.25rem;
    max-width: 960px;
    color: var(--k-text-dark, #1f2d3d);
}

.ba-config-header {
  margin-bottom: 1.25rem;

  h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--k-text-dark, #1f2d3d);
  }

  .ba-config-desc {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--k-text-normal, #5e6d82);
  }
}

.ba-config-toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  .ba-config-search {
    flex: 1;
    min-width: 220px;
  }

  .ba-config-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.ba-config-message {
  margin-bottom: 1rem;
}

.ba-config-modules {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ba-config-module {
  border: 1px solid var(--k-color-border, #e4e7ed);
  border-radius: 12px;
  background: var(--k-card-bg, #fff);
  overflow: hidden;
}

.ba-module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;

  &:hover {
    background: var(--k-hover-bg, #f5f7fa);
  }
}

.ba-module-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--k-text-dark, #1f2d3d);

  .k-icon,
  :deep(.el-icon) {
    color: var(--k-color-primary, #409eff);
  }
}

.ba-module-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ba-module-arrow {
  transition: transform 0.25s ease;
  color: var(--k-text-normal, #5e6d82);

  &.is-expanded {
    transform: rotate(180deg);
  }
}

.ba-module-body {
  padding: 0 1rem 1rem;
  border-top: 1px solid var(--k-color-border, #e4e7ed);
}

.ba-module-desc {
  padding: 0.75rem 0;
  font-size: 0.8125rem;
  color: var(--k-text-normal, #5e6d82);
}

.ba-module-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ba-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ba-field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.ba-field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--k-text-dark, #1f2d3d);
}

.ba-field-default {
  font-size: 0.75rem;
  color: var(--k-text-normal, #5e6d82);
}

.ba-field-control {
  display: flex;
  align-items: center;
}

.ba-field-footer {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.ba-field-hint {
  font-size: 0.75rem;
  color: var(--k-text-normal, #5e6d82);
}

.ba-field-error {
  font-size: 0.75rem;
  color: var(--k-color-danger, #f56c6c);
}

@media (max-width: 640px) {
  .ba-config {
    padding: 1rem;
  }

  .ba-config-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .ba-module-header {
    padding: 0.75rem;
  }

  .ba-module-body {
    padding: 0 0.75rem 0.75rem;
  }
}
</style>
