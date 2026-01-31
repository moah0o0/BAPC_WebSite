import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from '@/components/IndexPageComponents/IndexPage';
import AboutPage from '@/components/AboutPage.vue';

// 특수게시판
import NewsletterPage from '@/components/specialBoardComponents/NewsletterPage.vue';
import EventPage from '@/components/specialBoardComponents/EventPage.vue';

// 일반게시판
import GeneralBoard from '@/components/generalBoardComponents/GeneralBoard.vue';
import GeneralBoardPost from '@/components/generalBoardComponents/GeneralBoardPost.vue'
import CmsBoard from '@/components/generalBoardComponents/CmsBoard.vue'
import CmsEditor from '@/components/generalBoardComponents/CmsEditor.vue'


// 유저 로그인&로그아웃
import LoginPage from '@/components/User/LoginPage.vue';
import LogoutPage from '@/components/User/LogoutPage.vue';


import pb from './pb';




const routes = [
  {
    path: "/post/:collection_name/:record_id",
    name: "generalBoardPost",
    component: GeneralBoardPost,
  },
];

const router = createRouter({
  mode: 'history',
  history: createWebHistory('/'),
  routes,
});


router.afterEach(() => {
  // 부트스트랩 메뉴 닫기 (간단한 DOM 방식)
  const navbarCollapse = document.querySelector('.navbar-collapse');
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    navbarCollapse.classList.remove('show'); // 메뉴 닫기
  }
})

router.beforeEach(async (to, from, next) => {
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const authStore = pb.authStore;

  if (to.name === 'LoginPage' && authStore.isValid) {
    return next({ name: 'IndexPage' }); // 또는 원하는 리다이렉트 페이지
  }

  if (!requiresAdmin) {
    return next();
  }

  if (!authStore.isValid) {
    return next({ name: 'LoginPage', query: { redirect: to.fullPath } });
  }

  try {
    // 현재 로그인한 사용자 정보 가져오기
    const user = await pb.collection('users').getOne(authStore.model.id);

    if (user.is_admin === true) {
      // 관리자 맞으면 허용
      return next();
    } else {
      alert('관리자 권한이 없습니다.');
      // 권한 없으면 이전 페이지로 or 메인으로
      return next(from.fullPath || '/');
    }
  } catch (err) {
    console.error('유저 정보 조회 실패', err);
    alert('사용자 정보를 가져오는 데 실패했습니다.');
    return next('/login');
  }
});

export default router;
