import { createRouter, createWebHistory } from 'vue-router';

// 메인 페이지만 즉시 로드 (첫 화면)
import IndexPage from '@/components/IndexPageComponents/IndexPage';

// 나머지는 lazy loading
const AboutPage = () => import('@/components/AboutPage.vue');
const NewsletterPage = () => import('@/components/specialBoardComponents/NewsletterPage.vue');
const EventPage = () => import('@/components/specialBoardComponents/EventPage.vue');
const GeneralBoard = () => import('@/components/generalBoardComponents/GeneralBoard.vue');
const GeneralBoardPost = () => import('@/components/generalBoardComponents/GeneralBoardPost.vue');

// 관리자 전용 (별도 chunk)
const CmsBoard = () => import(/* webpackChunkName: "admin" */ '@/components/generalBoardComponents/CmsBoard.vue');
const CmsEditor = () => import(/* webpackChunkName: "admin" */ '@/components/generalBoardComponents/CmsEditor.vue');

// 로그인/로그아웃
const LoginPage = () => import('@/components/User/LoginPage.vue');
const LogoutPage = () => import('@/components/User/LogoutPage.vue');


import pb from './pb';
import config from './config';

const DEFAULT_SITE_NAME = '부산반빈곤센터';
const DEFAULT_DESCRIPTION = "빈곤에 처한 주민 스스로가 권리를 찾을 수 있도록 상담, 교육 등을 하는 비영리단체(NPO)입니다. IMF 이후 심화된 실업과 빈곤에 대응하던 시민사회의 흐름에 이어서 2010년 4월 1일 창립했습니다. 반(反)빈곤운동은 기존의 구호나 시혜적인 관점을 넘어서 주민 스스로 조직하고 힘을 키우는 것을 목표로 합니다. 누구나 기본적인 생활을 할 수 있어야 한다는 의미의 '기본생활권'을 추구하는 다양한 활동들을 하고 있습니다."
const DEFAULT_THUMBNAIL = `${config.CDN_URL}/default_thumbnail.png`

const routes = [

  // index(/)

  {
    path: '/',
    name: 'IndexPage',
    component: IndexPage,
  },

  // 랜딩 페이지

  {
    path: '/about',
    name: "aboutPage",
    component: AboutPage,
    meta: {
      title: "부산반빈곤센터 소개",
    }

  },

  // 일반 게시판

  {
    path: '/board/:collection_name',
    name: "generalBoard",
    component: GeneralBoard,
    props: true,
    meta: {
      title: "부산반빈곤센터 | 게시판",
    }
  },
  {
    path: "/post/:collection_name/:record_id",
    name: "generalBoardPost",
    component: GeneralBoardPost,
  },
  {
    path: '/cms_board/:collection_name',
    name: 'cms_board',
    component:CmsBoard,
    meta: { requiresAdmin: true }
  },
  {
    path: '/cms_editor/:collection_name/:record_id',
    name: 'cms_editor',
    component:CmsEditor,
    meta: { requiresAdmin: true }
  },

  // 특수게시판
  {
    path: '/newsletter',
    name: "newsletterPage",
    component: NewsletterPage,
    meta: {
      title: "부산반빈곤센터 | 쇠비름",
      description:"쇠비름은 부산반빈곤센터의 격월 소식지입니다. 격월로 발행되는 소식지를 이곳에서 확인해보세요. 다양한 센터 활동 소식과 회원들의 이야기가 담겨있습니다."
    }
  },
  {
    path: '/event',
    name: "eventBoard",
    component: EventPage,
    meta: {
      title: "부산반빈곤센터 | 일정",
    }
  },

  // 로그인 & 로그아웃
  {
    path: '/login',
    name: 'UserLogin',
    component: LoginPage,
  },
  {
    path: '/logout',
    name: 'UserLogout',
    component: LogoutPage,
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
