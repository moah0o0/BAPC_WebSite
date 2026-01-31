<template>
  <div class="post-page">
    <!-- 로딩 스켈레톤 -->
    <template v-if="isLoading">
      <div class="post-header">
        <div class="post-header-content">
          <div class="skeleton skeleton-category"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-meta"></div>
        </div>
      </div>
      <div class="post-body">
        <div class="post-content">
          <div class="skeleton skeleton-line" style="width: 100%;"></div>
          <div class="skeleton skeleton-line" style="width: 90%;"></div>
          <div class="skeleton skeleton-line" style="width: 95%;"></div>
          <div class="skeleton skeleton-line" style="width: 80%;"></div>
          <div class="skeleton skeleton-line" style="width: 85%;"></div>
        </div>
      </div>
    </template>

    <!-- 실제 컨텐츠 -->
    <template v-else-if="post">
      <div class="post-header">
        <div class="post-header-content">
          <span class="post-category">{{ post.category }}</span>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <time class="post-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              {{ getFormatDate(post.postdate) }}
            </time>
          </div>

          <!-- 관리자 버튼 -->
          <div v-if="is_admin" class="admin-actions">
            <button class="admin-btn" @click="goEdit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              편집
            </button>
            <button class="admin-btn danger" @click="goDelete">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
              삭제
            </button>
          </div>
        </div>
      </div>

      <div class="post-body">
        <article class="post-content" v-html="post_content"></article>
      </div>

      <div class="post-footer">
        <button class="back-btn" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          목록으로 돌아가기
        </button>
      </div>
    </template>

    <!-- 에러 상태 -->
    <template v-else>
      <div class="error-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" x2="12" y1="8" y2="12"/>
          <line x1="12" x2="12.01" y1="16" y2="16"/>
        </svg>
        <h3>게시물을 찾을 수 없습니다</h3>
        <p>삭제되었거나 잘못된 주소입니다.</p>
        <button class="back-btn" @click="goBack">목록으로 돌아가기</button>
      </div>
    </template>
  </div>
</template>

<script>
import pb from '@/pb'
import parseEditorContent from '@/components/generalBoardComponents/parseEditorContent'
import { toCdnUrl } from '@/config'

export default {
  name: "PostDetailPage",
  data() {
    return {
      post: null,
      post_content: "",
      is_admin: false,
      isLoading: true,
      collection_name: "",
    };
  },
  async mounted() {
    const pathParts = window.location.pathname.split("/");
    this.collection_name = pathParts[2] || "";
    const id = pathParts[3] || "";

    await Promise.all([
      this.fetchPost(id),
      this.checkAdmin()
    ]);
  },
  methods: {
    async fetchPost(id) {
      this.isLoading = true;
      try {
        const record = await pb.collection(this.collection_name).getOne(id, {
          fields: "title,content_blocks,category,postdate,thumbnail,id,collectionId",
        });
        this.post = record;
        this.post_content = parseEditorContent(record.content_blocks);
      } catch (e) {
        console.error("[PostDetail] 게시물 불러오기 실패:", e);
        this.post = null;
      } finally {
        this.isLoading = false;
      }
    },

    async checkAdmin() {
      const authStore = pb.authStore;
      if (authStore.isValid) {
        try {
          const user = await pb.collection('users').getOne(authStore.model.id);
          this.is_admin = user.is_admin === true;
        } catch (err) {
          console.error("[PostDetailAuth]", err);
          this.is_admin = false;
        }
      }
    },

    async deleteRecord(record_id) {
      try {
        const record = await pb.collection(this.collection_name).getOne(record_id);
        const files = record.uploads?.file || [];
        const images = record.uploads?.image || [];

        for (const file of files) {
          await pb.collection("files").delete(file.id);
        }
        for (const image of images) {
          await pb.collection("images").delete(image.id);
        }

        await pb.collection(this.collection_name).delete(record_id);
      } catch (err) {
        console.error("[DeleteRecord]", err);
        throw err;
      }
    },

    getFormatDate(rawDate) {
      if (!rawDate) return "";
      const date = new Date(rawDate);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    },

    getThumbnailUrl(item) {
      return toCdnUrl(pb.files.getURL(item, item.thumbnail));
    },

    goBack() {
      this.$router.push('/board/' + this.collection_name);
    },

    goEdit() {
      this.$router.push('/cms_editor/' + this.collection_name + '/' + this.post.id);
    },

    async goDelete() {
      if (!this.is_admin) return;
      if (!confirm("정말로 이 게시물을 삭제하시겠습니까?")) return;

      try {
        await this.deleteRecord(this.post.id);
        this.$router.push('/board/' + this.collection_name);
      } catch (err) {
        alert("삭제 중 오류가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.post-page {
  min-height: 100vh;
  background: var(--color-gray-50);
}

/* 로딩 스켈레톤 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.skeleton-category {
  width: 80px;
  height: 28px;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
}

.skeleton-title {
  width: 80%;
  height: 36px;
  margin-bottom: var(--space-4);
}

.skeleton-meta {
  width: 150px;
  height: 20px;
}

.skeleton-line {
  height: 20px;
  margin-bottom: var(--space-4);
}

@keyframes skeleton-loading {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

/* 헤더 */
.post-header {
  background: white;
  padding: var(--space-10) var(--space-4) var(--space-8);
  border-bottom: 1px solid var(--color-gray-200);
}

.post-header-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.post-category {
  display: inline-block;
  padding: var(--space-1) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
}

.post-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-gray-900);
  line-height: 1.4;
  margin: 0 0 var(--space-4);
  word-break: keep-all;
}

.post-meta {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.post-date {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.post-date svg {
  color: var(--color-gray-400);
}

/* 관리자 버튼 */
.admin-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-600);
  background: var(--color-gray-100);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.admin-btn:hover {
  background: var(--color-gray-200);
}

.admin-btn.danger {
  color: var(--color-error);
}

.admin-btn.danger:hover {
  background: #fef2f2;
}

/* 본문 */
.post-body {
  background: white;
  padding: var(--space-8) var(--space-4);
}

.post-content {
  max-width: 800px;
  margin: 0 auto;
  font-size: var(--font-size-base);
  line-height: 1.8;
  color: var(--color-gray-800);
}

.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3) {
  margin-top: 2em;
  margin-bottom: 1em;
  font-weight: 700;
  color: var(--color-gray-900);
}

.post-content :deep(h1) { font-size: 1.75rem; }
.post-content :deep(h2) { font-size: 1.5rem; }
.post-content :deep(h3) { font-size: 1.25rem; }

.post-content :deep(p) {
  margin-bottom: 1.5em;
}

.post-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  margin: var(--space-6) 0;
}

.post-content :deep(figcaption) {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin-top: var(--space-2);
}

.post-content :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
}

.post-content :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding-left: var(--space-4);
  margin: var(--space-6) 0;
  color: var(--color-gray-600);
  font-style: italic;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  padding-left: var(--space-6);
  margin-bottom: 1.5em;
}

.post-content :deep(li) {
  margin-bottom: var(--space-2);
}

/* 비디오 래퍼 */
.post-content :deep(.video-wrapper) {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  margin: var(--space-6) 0;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.post-content :deep(.video-wrapper iframe) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* 체크리스트 */
.post-content :deep(.checklist) {
  list-style: none;
  padding: 0;
  margin: var(--space-4) 0;
}

.post-content :deep(.check-item) {
  display: flex;
  align-items: center;
  margin: var(--space-2) 0;
}

.post-content :deep(.check-item input[type="checkbox"]) {
  display: none;
}

.post-content :deep(.custom-check) {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  background: white;
  flex-shrink: 0;
}

.post-content :deep(.check-item input:checked + .custom-check) {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.post-content :deep(.check-label) {
  margin-left: var(--space-3);
  font-size: var(--font-size-base);
}

/* 파일 링크 */
.post-content :deep(.file) {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  color: var(--color-gray-700);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--space-3);
  transition: all var(--transition-fast);
}

.post-content :deep(.file:hover) {
  background: var(--color-gray-200);
}

/* 푸터 */
.post-footer {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  background: var(--color-primary-dark);
}

/* 에러 상태 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--space-8);
  text-align: center;
  color: var(--color-gray-500);
}

.error-state svg {
  color: var(--color-gray-300);
  margin-bottom: var(--space-4);
}

.error-state h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0 0 var(--space-2);
}

.error-state p {
  font-size: var(--font-size-sm);
  margin: 0 0 var(--space-6);
}

/* 모바일 */
@media (max-width: 640px) {
  .post-header {
    padding: var(--space-6) var(--space-4);
  }

  .post-title {
    font-size: var(--font-size-2xl);
  }

  .post-body {
    padding: var(--space-6) var(--space-4);
  }

  .post-content {
    font-size: var(--font-size-sm);
    line-height: 1.7;
  }

  .post-content :deep(h1) { font-size: 1.5rem; }
  .post-content :deep(h2) { font-size: 1.25rem; }
  .post-content :deep(h3) { font-size: 1.1rem; }

  .admin-actions {
    flex-wrap: wrap;
  }

  .admin-btn {
    font-size: var(--font-size-xs);
    padding: var(--space-2) var(--space-3);
  }
}
</style>
