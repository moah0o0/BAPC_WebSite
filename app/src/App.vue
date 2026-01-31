<template>
  <!-- 상단 배너 -->
  <a
    href="https://obit.bapc.kr"
    target="_blank"
    rel="noopener noreferrer"
    class="banner-top"
  >
    <span class="banner-text">
      <strong>부산 공영장례 추모관</strong> 바로가기
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 17L17 7M17 7H7M17 7V17"/>
      </svg>
    </span>
  </a>

  <!-- 네비게이션 -->
  <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <img src="@/assets/bapc_renew_logo.png" alt="부산반빈곤센터" height="36">
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="메뉴 열기"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/about" class="nav-link">소개</router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              알림
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link
                  :to="{ name: 'generalBoard', params: { collection_name: 'notice' }}"
                  class="dropdown-item"
                >
                  공지사항
                </router-link>
              </li>
              <li>
                <router-link to="/event" class="dropdown-item">일정</router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'generalBoard', params: { collection_name: 'activity' }}"
              class="nav-link"
            >
              활동소식
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/newsletter" class="nav-link">쇠비름</router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'generalBoard', params: { collection_name: 'archive' }}"
              class="nav-link"
            >
              자료실
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- 메인 컨텐츠 -->
  <main class="main-content">
    <router-view />
  </main>

  <!-- 푸터 -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-info">
          <h2 class="footer-title">부산반빈곤센터</h2>
          <address class="footer-address">
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              부산광역시 동구 초량로 53, 1층 (공간달품)
            </p>
            <p>
              <a href="mailto:bapc@daum.net" class="footer-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                bapc@daum.net
              </a>
            </p>
            <p>
              <a href="tel:051-645-0418" class="footer-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                051-645-0418
              </a>
            </p>
          </address>
        </div>

        <div class="footer-links">
          <a
            href="https://www.facebook.com/bapc0401"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-social"
            aria-label="페이스북"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
            </svg>
          </a>
          <router-link to="/login" class="footer-social" aria-label="관리자 로그인">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </router-link>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} 부산반빈곤센터. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
/* 배너 */
.banner-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: var(--font-size-sm);
  z-index: 1001;
  transition: all var(--transition-fast);
}

.banner-top:hover {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, #991b1b 100%);
  color: white;
}

.banner-text {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* 네비게이션 */
.navbar {
  margin-top: 40px;
  height: 70px;
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--color-gray-100);
}

.navbar-brand img {
  height: 32px;
  width: auto;
}

.nav-link {
  font-weight: 500;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700) !important;
  padding: var(--space-2) var(--space-4) !important;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-primary) !important;
  background-color: var(--color-primary-light);
}

.nav-link.router-link-active {
  color: var(--color-primary) !important;
  font-weight: 600;
}

.dropdown-menu {
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--space-2);
}

.dropdown-item {
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  transition: all var(--transition-fast);
}

.dropdown-item:hover,
.dropdown-item:focus {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.dropdown-item.router-link-active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.navbar-toggler {
  border: none;
  padding: var(--space-2);
}

.navbar-toggler:focus {
  box-shadow: none;
}

/* 메인 컨텐츠 */
.main-content {
  margin-top: 110px;
  min-height: calc(100vh - 110px - 200px);
}

/* 푸터 */
.footer {
  background-color: var(--color-gray-100);
  padding: var(--space-12) 0 var(--space-6);
  margin-top: var(--space-16);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-8);
}

.footer-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 var(--space-4);
}

.footer-address {
  font-style: normal;
}

.footer-address p {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.footer-address svg {
  flex-shrink: 0;
  color: var(--color-gray-400);
}

.footer-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-gray-600);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--color-primary);
}

.footer-links {
  display: flex;
  gap: var(--space-3);
}

.footer-social {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: var(--radius-full);
  color: var(--color-gray-600);
  transition: all var(--transition-fast);
}

.footer-social:hover {
  background-color: var(--color-primary);
  color: white;
}

.footer-bottom {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-gray-200);
}

.footer-bottom p {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  text-align: center;
}

/* 모바일 */
@media (max-width: 991.98px) {
  .navbar-collapse {
    background-color: white;
    padding: var(--space-4);
    margin-top: var(--space-2);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
  }

  .navbar-nav {
    gap: var(--space-1);
  }

  .nav-link {
    padding: var(--space-3) var(--space-4) !important;
  }
}

@media (max-width: 767.98px) {
  .main-content {
    margin-top: 110px;
  }

  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-address p {
    justify-content: center;
  }

  .footer-title {
    font-size: var(--font-size-base);
  }
}
</style>
