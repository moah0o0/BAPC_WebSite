# 부산반빈곤센터 웹사이트 (BAPC)

## 프로젝트 개요
부산반빈곤센터(BAPC) 공식 웹사이트 - CMS 기능이 포함된 풀스택 웹 애플리케이션

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Vue.js 3 (SPA) |
| 백엔드 서버 | Python Flask |
| 데이터베이스/API | PocketBase |
| 빌드 도구 | Vue CLI + Webpack |

## 디렉토리 구조

```
bapc-kr/
├── .env                       # 환경변수 설정 (URL 중앙 관리)
├── main.py                    # Flask 백엔드 서버
├── CLAUDE.md                  # 프로젝트 문서
└── app/                       # Vue.js 프론트엔드
    ├── src/
    │   ├── config.js          # 프론트엔드 설정 (.env에서 읽음)
    │   ├── pb.js              # PocketBase 클라이언트
    │   ├── router.js          # Vue Router 설정
    │   ├── routerForPostPage.js
    │   ├── main.js            # Vue 진입점
    │   ├── App.vue            # 루트 컴포넌트
    │   └── components/
    │       ├── IndexPageComponents/    # 메인 페이지
    │       │   ├── IndexPage.vue
    │       │   ├── NewActivities.vue
    │       │   ├── NewAlertsAndEvents.vue
    │       │   ├── SlidesPosters.vue
    │       │   └── TogetherSection.vue
    │       ├── generalBoardComponents/ # 일반 게시판
    │       │   ├── GeneralBoard.vue
    │       │   ├── GeneralBoardPost.vue
    │       │   ├── CmsBoard.vue
    │       │   ├── CmsEditor.vue
    │       │   ├── EditorJs.vue
    │       │   └── parseEditorContent.js
    │       ├── specialBoardComponents/ # 특수 게시판
    │       │   ├── NewsletterPage.vue
    │       │   └── EventPage.vue
    │       └── User/                   # 사용자 관리
    │           ├── LoginPage.vue
    │           └── LogoutPage.vue
    ├── dist/                  # 빌드 결과물
    └── package.json
```

## 환경변수 설정 (.env)

모든 URL은 `.env` 파일 하나로 관리:

```env
VUE_APP_API_URL=https://api.bapc.kr
VUE_APP_CDN_URL=https://cdn.bapc.kr
VUE_APP_SITE_URL=https://bapc.kr
FLASK_PORT=8240
```

### URL 변경 시
1. `.env` 파일만 수정하면 프론트엔드/백엔드 모두 적용
2. 프론트엔드는 재빌드 필요 (`npm run build`)
3. 백엔드는 재시작만 필요

## 주요 라우트

| 경로 | 설명 |
|------|------|
| `/` | 메인 페이지 |
| `/about` | 단체 소개 |
| `/board/:collection` | 게시판 (notice, activity, archive) |
| `/post/:collection/:id` | 개별 게시글 |
| `/newsletter` | 쇠비름 뉴스레터 |
| `/event` | 일정 |
| `/cms_board/:collection` | 관리자 게시판 관리 |
| `/cms_editor/:collection/:id` | 관리자 에디터 |
| `/login`, `/logout` | 인증 |

## PocketBase 컬렉션

- `notice` - 공지사항
- `activity` - 활동소식
- `archive` - 자료실
- `newsletter` - 쇠비름 소식지
- `events` - 일정
- `poster` - 메인 슬라이드 포스터
- `users` - 사용자 (관리자 인증)
- `files` - 첨부파일
- `images` - 이미지

## 개발 명령어

```bash
# 프론트엔드 개발 서버
cd app && npm run serve

# 프론트엔드 빌드
cd app && npm run build

# 백엔드 실행
python main.py
```

## SEO (서버사이드 렌더링)

Flask에서 게시글 페이지 요청 시 동적으로 OpenGraph 메타태그 주입:
- `/post/:collection/:id` 경로에서 PocketBase API로 데이터 조회
- `<head>`에 title, description, og:image 등 삽입
- 소셜 미디어 공유 시 미리보기 지원

## 주요 협의 사항

1. **URL 중앙 관리** - 하드코딩된 URL을 `.env` + `config.js`로 통합 완료
2. **Flask 유지** - SEO를 위한 메타태그 SSR에 필요, 대안으로 Nuxt 3 마이그레이션 가능
3. **CDN 변환 함수** - `toCdnUrl()` 유틸리티로 API 파일 URL을 CDN URL로 변환

## 의존성

### 프론트엔드 (package.json)
- vue 3.x
- vue-router 4.x
- pocketbase
- @editorjs/editorjs + 플러그인들
- flatpickr, vue-datepicker
- bootstrap 5 (CDN)

### 백엔드 (Python)
- flask
- pocketbase
- python-dotenv
