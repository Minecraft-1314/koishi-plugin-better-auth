<template>
  <k-layout main="page-profile" :menu="menu">
    <k-content>
      <div class="user-header">
        <div class="user-avatar">
          <k-icon name="user-full" />
        </div>
        <div class="user-info">
          <h1>{{ store.user?.name || '用户资料' }}</h1>
          <p>管理你的个人资料与登录会话</p>
        </div>
        <div class="user-status">
          <span class="status-dot"></span>
          <span>已登录</span>
        </div>
      </div>

      <div class="section-card">
        <div class="section-title">
          <k-icon name="edit" />
          <span>基本资料</span>
        </div>
        <k-form :schema="schema" v-model="diff"></k-form>
      </div>

      <div class="section-card">
        <div class="section-title">
          <k-icon name="clock" />
          <span>登录历史</span>
          <span class="count-badge" v-if="tokens.length">{{ tokens.length }}</span>
        </div>

        <transition-group name="token" tag="div" class="token-list">
          <div class="token-item" v-for="token in tokens" :key="token.inc">
            <div class="token-check">
              <el-checkbox-group v-model="selectedTokens">
                <el-checkbox :value="token.inc" />
              </el-checkbox-group>
            </div>
            <div class="token-device">
              <k-icon :name="isMobile(token.userAgent) ? 'mobile' : 'desktop'" />
            </div>
            <div class="token-meta">
              <div class="token-top">
                <span class="type-tag" :class="token.type">{{ types[token.type] || token.type }}</span>
                <span class="token-time">登录于 {{ formatDate(token.createdAt) }}</span>
              </div>
              <div class="token-detail">
                <span class="detail-item">
                  <k-icon name="clock" />
                  最后访问 {{ formatDate(token.lastUsedAt) }}
                </span>
                <span class="detail-item">
                  <span class="detail-label">IP</span>
                  {{ showFullIp ? token.address : maskIp(token.address) }}
                  <el-button
                    class="action-btn ip-btn"
                    size="small"
                    text
                    @click="showFullIp = !showFullIp"
                  >
                    {{ showFullIp ? '隐藏' : '显示' }}
                  </el-button>
                </span>
                <span class="detail-item detail-ua">
                  {{ maskUa(token.userAgent) }}
                </span>
              </div>
            </div>
            <div class="token-actions">
              <el-button
                class="action-btn remove-btn"
                size="small"
                :loading="deletingToken === token.inc"
                @click="removeToken(token.inc)"
              >移除会话</el-button>
            </div>
          </div>
        </transition-group>

        <el-empty v-if="!tokens.length" description="暂无登录历史" />

        <div class="batch-actions" v-if="tokens.length">
          <el-button class="action-btn select-btn" size="small" @click="toggleSelectAll">
            {{ allSelected ? '取消全选' : '全选' }}
          </el-button>
          <el-button
            class="action-btn danger-btn"
            size="small"
            :loading="batchRemoving"
            :disabled="!selectedTokens.length"
            @click="batchRemoveTokens"
          >批量移除 ({{ selectedTokens.length }})</el-button>
        </div>
      </div>
    </k-content>
  </k-layout>
</template>

<script setup lang="ts">
import { send, store, message, Schema } from '@koishijs/client'
import { loginPassword, shared } from './utils'
import { computed, ref } from 'vue'

interface UserUpdate {
  name?: string
  password?: string
}

const types: Record<string, string> = {
  password: '密码登录',
  token: '自动登录',
}

const diff = ref<UserUpdate>({})
const saving = ref(false)
const loggingOut = ref(false)
const deletingToken = ref<number | null>(null)
const batchRemoving = ref(false)
const showFullIp = ref(false)
const selectedTokens = ref<number[]>([])

const tokens = computed(() => store.user?.tokens ?? [])

const allSelected = computed(() => {
  return tokens.value.length > 0 && tokens.value.every(token => selectedTokens.value.includes(token.inc))
})

const schema = computed<Schema<UserUpdate>>(() => {
  return Schema.object({
    name: Schema.string().description('用户名').default(shared.value.name),
    password: Schema.string().role('secret').description('密码').default(loginPassword.value),
  }).description('基本资料')
})

async function update() {
  const payload: UserUpdate = {}
  for (const key of Object.keys(diff.value) as (keyof UserUpdate)[]) {
    if (diff.value[key] !== undefined) {
      payload[key] = diff.value[key]
    }
  }
  if (!Object.keys(payload).length || saving.value) return
  saving.value = true
  try {
    await send('user/update', payload)
    message.success('修改成功！')
    if (payload.name !== undefined) {
      shared.value.name = payload.name
      if (store.user) store.user.name = payload.name
    }
    diff.value = {}
  } catch (e: any) {
    message.error(e?.message || '修改失败')
  } finally {
    saving.value = false
  }
}

async function logout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await send('user/logout')
    store.user = null
    shared.value.id = undefined
    shared.value.token = undefined
    shared.value.expiredAt = undefined
    shared.value.refreshToken = undefined
  } catch (e: any) {
    message.error(e?.message || '退出登录失败')
  } finally {
    loggingOut.value = false
  }
}

async function removeToken(inc: number) {
  if (deletingToken.value !== null) return
  deletingToken.value = inc
  try {
    await send('user/delete-token', inc)
    message.success('会话已移除')
    if (store.user) {
      store.user.tokens = store.user.tokens.filter(t => t.inc !== inc)
    }
    selectedTokens.value = selectedTokens.value.filter(id => id !== inc)
  } catch (e: any) {
    message.error(e?.message || '移除会话失败')
  } finally {
    deletingToken.value = null
  }
}

async function batchRemoveTokens() {
  if (!selectedTokens.value.length || batchRemoving.value) return
  batchRemoving.value = true
  try {
    await send('user/delete-tokens', selectedTokens.value)
    message.success('已批量移除会话')
    if (store.user) {
      store.user.tokens = store.user.tokens.filter(t => !selectedTokens.value.includes(t.inc))
    }
    selectedTokens.value = []
  } catch (e: any) {
    message.error(e?.message || '批量移除失败')
  } finally {
    batchRemoving.value = false
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedTokens.value = []
  } else {
    selectedTokens.value = tokens.value.map(token => token.inc)
  }
}

function formatDate(input: string | number | Date) {
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return String(input)
  return date.toLocaleString()
}

function isMobile(ua: string) {
  return /Mobile|Android|iPhone|iPad|iPod/i.test(ua)
}

function maskIp(ip: string) {
  if (!ip) return '未知'
  if (ip.includes(':')) {
    const parts = ip.split(':')
    return `${parts.slice(0, Math.max(1, parts.length - 2)).join(':')}:**`
  }
  const parts = ip.split('.')
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.**.**`
  return ip
}

function maskUa(ua: string) {
  if (!ua) return '未知'
  return ua.replace(/^Mozilla\/5\.0 \(([^;]+); ([^;]+); ([^)]+)\).*$/, '$1 $2')
}

const menu = computed(() => [{
  icon: 'check',
  label: '应用更改',
  disabled: !Object.keys(diff.value).length || saving.value,
  action: update,
}, {
  type: 'danger',
  icon: 'sign-out',
  label: '退出登录',
  disabled: loggingOut.value,
  action: logout,
}])
</script>

<style lang="scss" scoped>
.page-profile {
  --ba-accent: color-mix(in srgb, var(--k-color-primary, #409eff) 65%, white);

  h1 {
    font-size: 1.375rem;
    margin: 0;
    line-height: 1.6;
  }

  .user-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 16px;
    background: linear-gradient(135deg, color-mix(in srgb, var(--k-color-primary, #409eff) 12%, transparent), color-mix(in srgb, var(--ba-accent, #8c6bff) 8%, transparent));
    border: 1px solid color-mix(in srgb, var(--k-color-border, #e4e7ed) 60%, transparent);
    animation: header-enter 0.4s ease both;

    .user-avatar {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--k-color-primary, #409eff), var(--ba-accent, #8c6bff));
      flex-shrink: 0;
      box-shadow: 0 6px 16px color-mix(in srgb, var(--k-color-primary, #409eff) 30%, transparent);

      :deep(.k-icon) {
        color: #fff;
        font-size: 24px;
        display: flex;
      }
    }

    .user-info {
      flex: 1;
      min-width: 0;

      p {
        margin: 0.25rem 0 0;
        font-size: 0.8125rem;
        color: var(--k-text-normal, #5e6d82);
      }
    }

    .user-status {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8125rem;
      color: var(--k-color-success, #67c23a);
      background: color-mix(in srgb, var(--k-color-success, #67c23a) 12%, transparent);
      padding: 0.3rem 0.8rem;
      border-radius: 999px;
      flex-shrink: 0;

      .status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--k-color-success, #67c23a);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-color-success, #67c23a) 25%, transparent);
        animation: status-pulse 2s ease-in-out infinite;
      }
    }
  }

  .section-card {
    margin-top: 1.25rem;
    padding: 1.5rem;
    border-radius: 16px;
    background: var(--k-card-bg, #fff);
    border: 1px solid var(--k-color-border, #e4e7ed);
    box-shadow: 0 2px 12px color-mix(in srgb, var(--k-page-bg, #000) 6%, transparent);
    animation: header-enter 0.45s ease 0.08s both;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--k-text-dark, #1f2d3d);

    :deep(.k-icon) {
      color: var(--k-color-primary, #409eff);
      display: flex;
    }

    .count-badge {
      margin-left: auto;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--k-text-normal, #5e6d82);
      background: var(--k-hover-bg, #f5f7fa);
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
    }
  }

  .token-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0;
  }

  .token-item {
    background: var(--k-hover-bg, #f5f7fa);
    border-radius: 12px;
    padding: 0.9rem 1rem;
    box-shadow: 0 1px 4px color-mix(in srgb, var(--k-page-bg, #000) 5%, transparent);
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    border: 1px solid transparent;
  }

  .token-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px color-mix(in srgb, var(--k-page-bg, #000) 12%, transparent);
    border-color: color-mix(in srgb, var(--k-color-primary, #409eff) 35%, transparent);
  }

  .token-device {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--k-color-primary, #409eff) 12%, transparent);
    flex-shrink: 0;

    :deep(.k-icon) {
      color: var(--k-color-primary, #409eff);
      font-size: 20px;
      display: flex;
    }
  }

  .token-enter-active, .token-leave-active {
    transition: all 0.25s ease;
  }
  .token-enter-from {
    opacity: 0;
    transform: translateY(-8px);
  }
  .token-leave-to {
    opacity: 0;
    transform: translateX(16px);
  }
  .token-leave-active {
    position: absolute;
    width: 100%;
  }

  .token-check {
    margin-top: 0.25rem;
  }

  .token-meta {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .token-top {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .type-tag {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.1rem 0.6rem;
    border-radius: 999px;

    &.password {
      color: var(--k-color-primary, #409eff);
      background: color-mix(in srgb, var(--k-color-primary, #409eff) 12%, transparent);
    }

    &.token {
      color: var(--k-color-success, #67c23a);
      background: color-mix(in srgb, var(--k-color-success, #67c23a) 12%, transparent);
    }
  }

  .token-time {
    font-size: 0.8125rem;
    color: var(--k-text-normal, #5e6d82);
  }

  .token-detail {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1rem;
    font-size: 0.8125rem;
    color: var(--k-text-normal, #5e6d82);
  }

  .detail-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;

    :deep(.k-icon) {
      display: flex;
      font-size: 0.85rem;
    }
  }

  .detail-label {
    opacity: 0.7;
  }

  .detail-ua {
    opacity: 0.7;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .token-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  :deep(.action-btn) {
    border-radius: 10px;
    font-weight: 500;
    font-size: 0.8125rem;
    transition: transform 0.18s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
  }

  :deep(.action-btn:not(.is-disabled):hover) {
    transform: translateY(-1px);
  }

  :deep(.action-btn.is-loading) {
    opacity: 0.7;
  }

  :deep(.remove-btn) {
    background: transparent;
    color: var(--k-text-normal, #5e6d82);
    border: 1px solid var(--k-color-border, #dcdfe6);
    padding: 0.5em 1em;
  }

  :deep(.remove-btn:not(.is-disabled):hover) {
    color: var(--k-color-danger, #f56c6c);
    border-color: var(--k-color-danger, #f56c6c);
    background: color-mix(in srgb, var(--k-color-danger, #f56c6c) 8%, transparent);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--k-color-danger, #f56c6c) 20%, transparent);
  }

  :deep(.ip-btn) {
    padding: 0.15em 0.6em;
    color: var(--k-color-primary, #409eff);
    border-radius: 6px;
    transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
  }

  :deep(.ip-btn:hover) {
    background: color-mix(in srgb, var(--k-color-primary, #409eff) 10%, transparent);
    color: var(--k-color-primary, #409eff);
    transform: translateY(-1px);
  }

  .batch-actions {
    margin: 0.5rem 0 0;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--k-color-border, #e4e7ed);

    :deep(.action-btn) {
      padding: 0.55em 1.2em;
      height: 34px;
    }

    :deep(.select-btn) {
      background: color-mix(in srgb, var(--k-hover-bg, #f5f7fa) 60%, var(--k-card-bg, #fff));
      color: var(--k-text-dark, #1f2d3d);
      border: 1px solid color-mix(in srgb, var(--k-color-border, #e4e7ed) 60%, transparent);
    }

    :deep(.select-btn:not(.is-disabled):hover) {
      background: var(--k-card-bg, #fff);
      border-color: var(--k-color-primary, #409eff);
      color: var(--k-color-primary, #409eff);
    }

    :deep(.danger-btn) {
      background: linear-gradient(135deg, var(--k-color-danger, #f56c6c), #e74c3c);
      color: #fff;
      border: none;
      box-shadow: 0 6px 16px color-mix(in srgb, var(--k-color-danger, #f56c6c) 30%, transparent);
    }

    :deep(.danger-btn:not(.is-disabled):hover) {
      box-shadow: 0 8px 24px color-mix(in srgb, var(--k-color-danger, #f56c6c) 40%, transparent);
    }

    :deep(.danger-btn.is-disabled) {
      opacity: 0.5;
    }
  }

  @keyframes header-enter {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes status-pulse {
    0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-color-success, #67c23a) 25%, transparent); }
    50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--k-color-success, #67c23a) 15%, transparent); }
  }

  @media (max-width: 768px) {
    .user-header {
      flex-wrap: wrap;
      padding: 1.25rem;
    }

    .user-status {
      margin-left: 4.5rem;
    }

    .token-item {
      flex-direction: column;
      align-items: stretch;
    }

    .token-actions {
      margin-left: 0;
      display: flex;
      justify-content: flex-end;
    }

    .detail-ua {
      max-width: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .user-header, .section-card, .token-item, .status-dot {
      animation: none;
      transition: none;
    }
  }
}
</style>
