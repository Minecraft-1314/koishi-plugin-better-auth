<template>
  <k-layout main="darker">
    <div class="login-page">
      <div class="login-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>
      <div class="login-container">
        <k-card class="login-card">
          <div class="login-brand">
            <div class="brand-icon">
              <k-icon name="user-full" />
            </div>
            <h1>欢迎回来</h1>
            <p>登录 Koishi 控制台以继续</p>
          </div>
          <login-form />
        </k-card>
        <p class="login-footer">Koishi Plugin Better Auth</p>
      </div>
    </div>
  </k-layout>
</template>

<script setup lang="ts">
import LoginForm from './login-form.vue'
</script>

<style lang="scss" scoped>
.login-page {
  --ba-accent: color-mix(in srgb, var(--k-color-primary, #409eff) 65%, white);
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
  animation: blob-float 22s ease-in-out infinite alternate;
}

.blob-1 {
  width: 50vmax;
  height: 50vmax;
  background: radial-gradient(circle, var(--k-color-primary, #409eff) 0%, transparent 65%);
  opacity: 0.35;
  top: -15%;
  left: -10%;
}

.blob-2 {
  width: 40vmax;
  height: 40vmax;
  background: radial-gradient(circle, var(--ba-accent, #8c6bff) 0%, transparent 65%);
  opacity: 0.3;
  bottom: -10%;
  right: -8%;
  animation-delay: -7s;
}

.blob-3 {
  width: 25vmax;
  height: 25vmax;
  background: radial-gradient(circle, var(--k-color-warning, #ffb302) 0%, transparent 65%);
  opacity: 0.2;
  top: 40%;
  left: 55%;
  animation-delay: -14s;
}

@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(3%, -4%) scale(1.05); }
  66% { transform: translate(-2%, 3%) scale(0.95); }
  100% { transform: translate(4%, 2%) scale(1.02); }
}

.login-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  z-index: 1;
  animation: card-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.login-card {
  width: 100%;
  border-radius: 20px;
  background: var(--k-card-bg, #fff);
  box-shadow: 0 20px 60px color-mix(in srgb, var(--k-page-bg, #000) 15%, transparent), 0 2px 8px color-mix(in srgb, var(--k-page-bg, #000) 6%, transparent);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--k-color-border, #e4e7ed);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.login-card:hover {
  box-shadow: 0 28px 80px color-mix(in srgb, var(--k-page-bg, #000) 20%, transparent), 0 4px 12px color-mix(in srgb, var(--k-page-bg, #000) 9%, transparent);
}

.login-card :deep(.k-card-body) {
  padding: 2.5rem 2.5rem 2rem;
}

.login-brand {
  text-align: center;
  margin-bottom: 1.5rem;
}

.brand-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--k-color-primary, #409eff), var(--ba-accent, #8c6bff));
  margin-bottom: 1rem;
}

.brand-icon::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 20px;
  border: 2px solid var(--k-color-primary, #409eff);
  opacity: 0.5;
  animation: brand-pulse 2.6s ease-out infinite;
}

.brand-icon :deep(.k-icon) {
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-brand h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: var(--k-text-dark, #1f2d3d);
}

.login-brand p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--k-text-normal, #5e6d82);
}

.login-footer {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--k-text-normal, #5e6d82);
  opacity: 0.6;
}

@keyframes card-enter {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes brand-pulse {
  0% { transform: scale(0.9); opacity: 0.7; }
  100% { transform: scale(1.35); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .login-container, .blob, .brand-icon { animation: none; }
}

@media (max-width: 480px) {
  .login-page { padding: 1rem; align-items: flex-start; }
  .login-card :deep(.k-card-body) { padding: 1.5rem 1.5rem 1.5rem; }
  .login-card { border-radius: 16px; }
  .login-container { max-width: 100%; }
}
</style>
