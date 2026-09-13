<template>
  <div class="login-form">
    <div class="form-item">
      <label>用户名</label>
      <el-input
        ref="nameInputRef"
        placeholder="请输入用户名"
        v-model="shared.name"
        @input="error = undefined"
      >
        <template #prefix>
          <k-icon name="user"></k-icon>
        </template>
      </el-input>
    </div>

    <div class="form-item">
      <label>密码</label>
      <el-input
        placeholder="请输入密码"
        v-model="loginPassword"
        :type="showPassword ? 'text' : 'password'"
        @keyup.enter.stop="loginWithPassword"
        @input="error = undefined"
      >
        <template #prefix>
          <k-icon name="lock"></k-icon>
        </template>
        <template #suffix>
          <span class="password-toggle" @click="showPassword = !showPassword">
            <k-icon :name="showPassword ? 'eye' : 'eye-slash'"></k-icon>
          </span>
        </template>
      </el-input>
    </div>

    <div class="options">
      <el-checkbox v-model="rememberMe">记住我</el-checkbox>
    </div>

    <transition name="error">
      <p class="error" v-if="error" :key="error">{{ error }}</p>
    </transition>

    <div class="control">
      <button class="btn btn-primary" :disabled="loading" @click="loginWithPassword">
        <span class="btn-icon" :class="{ loading }"></span>
        <span class="btn-text">{{ loading ? '登录中…' : '登录' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { shared, loginPassword, getDeviceFingerprint } from './utils'
import { send, message } from '@koishijs/client'

const error = ref<string>()
const showPassword = ref(false)
const loading = ref(false)
const rememberMe = ref(true)
const nameInputRef = ref()

async function loginWithPassword() {
  if (loading.value) return
  const name = shared.value.name
  const password = loginPassword.value
  if (!name || !password) {
    error.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  error.value = undefined
  try {
    const fingerprint = getDeviceFingerprint()
    await send('login/password', name, password, rememberMe.value, fingerprint)
    shared.value.name = name
    if (!rememberMe.value) shared.value.refreshToken = undefined
    message.success(`欢迎回来，${name}！`)
  } catch (e: any) {
    error.value = e?.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    nameInputRef.value?.focus()
  })
})
</script>

<style lang="scss" scoped>
.login-form {
  .form-item {
    margin-bottom: 1rem;
    animation: form-fade 0.45s ease 0.15s both;

    label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--k-text-normal, #5e6d82);
      margin-bottom: 0.4rem;
      letter-spacing: 0.02em;
    }

    :deep(.el-input__wrapper) {
      height: 46px;
      border-radius: 12px;
      padding: 0 14px;
      box-shadow: 0 0 0 1px var(--k-color-border, #dcdfe6) inset;
      transition: box-shadow 0.25s ease, background 0.25s ease;
    }

    :deep(.el-input__wrapper.is-focus) {
      box-shadow: 0 0 0 2px var(--k-color-primary, #409eff), 0 4px 12px color-mix(in srgb, var(--k-color-primary, #409eff) 20%, transparent);
    }

    :deep(.el-input__prefix), :deep(.el-input__suffix) {
      display: flex;
      align-items: center;
      color: var(--k-text-normal, #5e6d82);
    }
  }

  .options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.25rem 0 0.5rem;
    animation: form-fade 0.45s ease 0.25s both;

    :deep(.el-checkbox__label) {
      color: var(--k-text-normal, #5e6d82);
      font-size: 0.8125rem;
    }
  }

  .error {
    color: var(--k-color-danger, #f56c6c);
    font-size: 0.8125rem;
    margin: 0.25rem 0 0;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    background: color-mix(in srgb, var(--k-color-danger, #f56c6c) 10%, transparent);
    animation: error-shake 0.35s ease;
  }

  .error-enter-active, .error-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .error-enter-from, .error-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }

  .control {
    margin-top: 1.5rem;
    animation: form-fade 0.45s ease 0.35s both;
  }

  .btn {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: transform 0.18s ease, box-shadow 0.25s ease, background 0.25s ease, opacity 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1;
    gap: 0.5rem;
    user-select: none;
    position: relative;
  }

  .btn-text {
    display: inline-block;
    line-height: 1;
    text-align: center;
  }

  .btn-primary {
    color: #fff;
    background: linear-gradient(135deg, var(--k-color-primary, #409eff), var(--ba-accent, #8c6bff));
    box-shadow: 0 8px 24px color-mix(in srgb, var(--k-color-primary, #409eff) 35%, transparent);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px color-mix(in srgb, var(--k-color-primary, #409eff) 45%, transparent);
    }

    &:active:not(:disabled) {
      transform: translateY(0) scale(0.98);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-icon {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    opacity: 0;
    transition: opacity 0.2s ease;

    &.loading {
      opacity: 1;
      animation: spin 0.8s linear infinite;
    }
  }

  .password-toggle {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    padding: 4px;
    color: var(--k-text-normal, #5e6d82);
    transition: color 0.2s ease;

    &:hover {
      color: var(--k-color-primary, #409eff);
    }
  }

  @keyframes form-fade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes error-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .form-item, .options, .control, .error { animation: none; }
    .btn { transition: none; }
  }
}
</style>
