<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 로그인 폼 -->
      <div v-if="!is_logined" class="login-card">
        <div class="login-header">
          <div class="login-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 class="login-title">관리자 로그인</h1>
          <p class="login-subtitle">부산반빈곤센터 관리 시스템</p>
        </div>

        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">이메일</label>
            <div class="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="이메일 주소 입력"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">비밀번호</label>
            <div class="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="비밀번호 입력"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                  <line x1="2" x2="22" y1="2" y2="22"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" x2="12" y1="8" y2="12"/>
              <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>로그인</span>
          </button>
        </form>

        <div class="login-footer">
          <router-link to="/" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            홈으로 돌아가기
          </router-link>
        </div>
      </div>

      <!-- 이미 로그인된 상태 -->
      <div v-else class="login-card status-card">
        <div class="status-icon" :class="is_admin ? 'success' : 'warning'">
          <svg v-if="is_admin" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" x2="12" y1="8" y2="12"/>
            <line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
        </div>

        <h2 class="status-title">
          {{ is_admin ? '관리자로 로그인됨' : '권한 없음' }}
        </h2>
        <p class="status-text">
          {{ is_admin ? '관리 페이지에 접근할 수 있습니다.' : '관리자 권한이 없는 계정입니다.' }}
        </p>

        <div class="status-actions">
          <router-link v-if="is_admin" to="/" class="action-btn primary">
            홈으로 이동
          </router-link>
          <router-link :to="{ name: 'UserLogout' }" class="action-btn secondary">
            로그아웃
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pb from '@/pb'

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: null,
      is_admin: null,
      is_logined: false,
      isLoading: false,
      showPassword: false,
    };
  },
  async mounted() {
    const authStore = pb.authStore;

    if (authStore.isValid) {
      this.is_logined = true;
      try {
        const user = await pb.collection('users').getOne(authStore.model.id);
        this.is_admin = user.is_admin === true;
      } catch (err) {
        console.error('[LoginPage Auth Check]', err);
        this.is_admin = false;
      }
    }
  },
  methods: {
    async login() {
      this.error = null;
      this.isLoading = true;

      try {
        await pb.collection('users').authWithPassword(this.email, this.password);
        const redirect = this.$route.query.redirect || '/';
        this.$router.push(redirect);
      } catch (err) {
        this.error = '이메일 또는 비밀번호가 올바르지 않습니다.';
        console.error('[Login Error]', err);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 150px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%);
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: var(--space-8);
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.login-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
}

.login-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 var(--space-2);
}

.login-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper svg {
  position: absolute;
  left: var(--space-4);
  color: var(--color-gray-400);
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: var(--space-3) var(--space-4) var(--space-3) 48px;
  font-size: var(--font-size-base);
  color: var(--color-gray-800);
  background: var(--color-gray-50);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.input-wrapper input:focus {
  outline: none;
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.input-wrapper input::placeholder {
  color: var(--color-gray-400);
}

.password-toggle {
  position: absolute;
  right: var(--space-3);
  padding: var(--space-2);
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.password-toggle:hover {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.login-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-gray-200);
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-primary);
}

/* 상태 카드 */
.status-card {
  text-align: center;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-5);
}

.status-icon.success {
  background: #d1fae5;
  color: var(--color-success);
}

.status-icon.warning {
  background: #fef3c7;
  color: var(--color-warning);
}

.status-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 var(--space-2);
}

.status-text {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-6);
}

.status-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.action-btn.primary {
  background: var(--color-primary);
  color: white;
}

.action-btn.primary:hover {
  background: var(--color-primary-dark);
}

.action-btn.secondary {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
}

.action-btn.secondary:hover {
  background: var(--color-gray-200);
}

/* 모바일 */
@media (max-width: 480px) {
  .login-page {
    padding: var(--space-4);
  }

  .login-card {
    padding: var(--space-6);
  }

  .login-icon {
    width: 56px;
    height: 56px;
  }

  .login-title {
    font-size: var(--font-size-xl);
  }
}
</style>
