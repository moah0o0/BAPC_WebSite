<template>
  <div class="board-page">
    <!-- 헤더 섹션 -->
    <div class="board-header">
      <div class="board-header-content">
        <h1 class="board-title">{{ collection_name_KO }}</h1>

        <!-- 관리자 버튼 -->
        <div v-if="is_admin" class="admin-actions">
          <button class="admin-btn" @click="$router.push({ name: 'cms_board', params: { collection_name: collection_name} })">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="7" height="7" x="3" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="14" rx="1"/>
              <rect width="7" height="7" x="3" y="14" rx="1"/>
            </svg>
            게시판 관리
          </button>
          <button class="admin-btn primary" @click="$router.push({ name: 'cms_editor', params: { collection_name: collection_name, record_id: 'new'} })">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            새 게시물
          </button>
        </div>

        <p class="board-count">총 <strong>{{ totalItems }}</strong>개의 게시물</p>

        <!-- 검색 -->
        <div class="search-container">
          <div class="search-input-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              v-model="searchKeyword"
              type="text"
              class="search-input"
              placeholder="검색어를 입력하세요"
              @keyup.enter="onSearch"
            />
            <button
              v-if="searchKeyword"
              class="search-clear"
              @click="clearSearch"
              aria-label="검색어 지우기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
            <button class="search-btn" @click="onSearch" aria-label="검색">
              검색
            </button>
          </div>
          <p v-if="activeSearchKeyword" class="search-result-text">
            "<strong>{{ activeSearchKeyword }}</strong>" 검색 결과
          </p>
        </div>
      </div>
    </div>

    <!-- 카테고리 필터 -->
    <div class="filter-section">
      <div class="filter-container">
        <div class="filter-tabs" role="tablist">
          <button
            v-for="category in categories"
            :key="category"
            class="filter-tab"
            :class="{ active: category === selectedCategory }"
            role="tab"
            :aria-selected="category === selectedCategory"
            @click="changeCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <!-- 컨텐츠 영역 -->
    <div class="board-content">
      <!-- 로딩 스켈레톤 -->
      <div v-if="isLoading" class="cards-grid">
        <div v-for="n in 6" :key="'skeleton-' + n" class="board-card skeleton-card">
          <div class="card-image skeleton"></div>
          <div class="card-body">
            <div class="skeleton skeleton-tag"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-date"></div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-else-if="records.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        <h3>게시물이 없습니다</h3>
        <p v-if="activeSearchKeyword">
          "<strong>{{ activeSearchKeyword }}</strong>"에 대한 검색 결과가 없습니다.
        </p>
        <p v-else-if="selectedCategory !== '전체'">
          "{{ selectedCategory }}" 카테고리에 게시물이 없습니다.
        </p>
        <p v-else>아직 등록된 게시물이 없습니다.</p>
        <button v-if="activeSearchKeyword || selectedCategory !== '전체'" class="reset-btn" @click="resetFilters">
          전체 보기
        </button>
      </div>

      <!-- 게시물 그리드 -->
      <div v-else class="cards-grid">
        <article
          v-for="record in records"
          :key="record.id"
          class="board-card"
          @click="goPost(`/post/${collection_name}/${record.id}`)"
        >
          <div v-if="record.thumbnail" class="card-image">
            <img
              class="card-image-src"
              :src="getThumbnailUrl(record)"
              :alt="record.title"
              loading="lazy"
            />
          </div>
          <div v-else class="card-image placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>

          <div class="card-body">
            <span class="category-tag">{{ record.category }}</span>
            <h3 class="card-title">{{ record.title }}</h3>
            <p v-if="!record.thumbnail" class="card-excerpt">
              {{ filterHtml(parseEditorContent(record.content_blocks)) }}
            </p>
            <time class="card-date">{{ getFormatDate(record.postdate) }}</time>
          </div>
        </article>
      </div>

      <!-- 페이지네이션 -->
      <nav v-if="!isLoading && records.length > 0 && MaxPage > 1" class="pagination-nav" aria-label="페이지 탐색">
        <button
          class="page-btn prev"
          :disabled="currentPage === 1"
          @click="changePageNum(currentPage - 1)"
          aria-label="이전 페이지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span class="btn-text">이전</span>
        </button>

        <div class="page-numbers">
          <template v-for="(item, index) in Paginations" :key="index">
            <span v-if="item === 'ellipsis'" class="page-ellipsis">…</span>
            <button
              v-else
              class="page-num"
              :class="{ active: currentPage === item }"
              @click="changePageNum(item)"
              :aria-label="`${item}페이지`"
              :aria-current="currentPage === item ? 'page' : undefined"
            >
              {{ item }}
            </button>
          </template>
        </div>

        <button
          class="page-btn next"
          :disabled="currentPage === MaxPage"
          @click="changePageNum(currentPage + 1)"
          aria-label="다음 페이지"
        >
          <span class="btn-text">다음</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import pb from '@/pb'
import parseEditorContent from '@/components/generalBoardComponents/parseEditorContent'
import { toCdnUrl } from '@/config'

export default {
  props: ['collection_name'],
  computed: {
    collection_name_KO() {
      return {
        activity: "활동소식",
        notice: "공지사항",
        archive: "자료실",
      }[this.$route.params.collection_name] || "게시판";
    }
  },
  watch: {
    collection_name() {
      this.selectedCategory = "전체";
      this.currentPage = 1;
      this.searchKeyword = "";
      this.activeSearchKeyword = "";
      this.FetchCategories();
      this.FetchRecords();
    }
  },
  data() {
    return {
      categories: ["전체"],
      records: [],
      selectedCategory: "전체",
      currentPage: 1,
      perPage: 9,
      MaxPage: 1,
      Paginations: [],
      totalItems: 0,
      searchKeyword: "",
      activeSearchKeyword: "",
      is_admin: false,
      isLoading: true,
    };
  },
  async mounted() {
    await Promise.all([
      this.FetchCategories(),
      this.FetchRecords(),
      this.checkAdmin()
    ]);
  },
  methods: {
    goPost(url) {
      this.$router.push(url);
    },

    parseEditorContent: parseEditorContent,

    filterHtml(content) {
      if (!content) return "";
      const textOnly = content.replace(/<[^>]*>/g, "");
      const maxLength = 150;
      if (textOnly.length <= maxLength) return textOnly;
      return textOnly.slice(0, maxLength) + "…";
    },

    sanitizeInput(str) {
      if (!str) return "";
      return str
        .replace(/['"\\]/g, "")
        .replace(/[<>]/g, "")
        .trim()
        .slice(0, 100);
    },

    getPaginators() {
      const pages = [];
      const max = this.MaxPage;
      const current = this.currentPage;

      if (max <= 7) {
        for (let i = 1; i <= max; i++) pages.push(i);
        return pages;
      }

      pages.push(1);

      if (current > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(max - 1, current + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== max) {
          pages.push(i);
        }
      }

      if (current < max - 2) {
        pages.push("ellipsis");
      }

      if (max !== 1) {
        pages.push(max);
      }

      return pages;
    },

    async checkAdmin() {
      const authStore = pb.authStore;
      if (authStore.isValid) {
        try {
          const user = await pb.collection('users').getOne(authStore.model.id);
          this.is_admin = user.is_admin === true;
        } catch (err) {
          console.error("[CheckAdmin]", err);
          this.is_admin = false;
        }
      }
    },

    async FetchCategories() {
      try {
        const records = await pb.collection(this.collection_name).getList(1, 100, {
          fields: "category",
          skipTotal: true,
        });
        const uniqueCategories = [...new Set(records.items.map((r) => r.category).filter(Boolean))];
        this.categories = ["전체", ...uniqueCategories];
      } catch (e) {
        this.categories = ["전체"];
        console.error("[FetchCategories]", e);
      }
    },

    async FetchRecords() {
      this.isLoading = true;
      const filters = [];

      if (this.selectedCategory && this.selectedCategory !== "전체") {
        const safeCategory = this.sanitizeInput(this.selectedCategory);
        if (safeCategory) {
          filters.push(`category = "${safeCategory}"`);
        }
      }

      if (this.activeSearchKeyword) {
        const safeKeyword = this.sanitizeInput(this.activeSearchKeyword);
        if (safeKeyword) {
          filters.push(`(title ~ "${safeKeyword}" || content_blocks ~ "${safeKeyword}")`);
        }
      }

      const filter = filters.length > 0 ? filters.join(" && ") : "";

      try {
        const records = await pb.collection(this.collection_name).getList(
          this.currentPage,
          this.perPage,
          {
            sort: "-postdate",
            fields: "title,thumbnail,category,postdate,id,collectionId,content_blocks",
            filter: filter,
          }
        );
        this.MaxPage = Math.ceil(records.totalItems / records.perPage) || 1;
        this.records = records.items;
        this.totalItems = records.totalItems;
      } catch (e) {
        console.error("[FetchRecords]", e);
        this.records = [];
        this.totalItems = 0;
        this.MaxPage = 1;
      } finally {
        this.isLoading = false;
      }
      this.Paginations = this.getPaginators();
    },

    async changeCategory(category) {
      if (this.selectedCategory === category) return;
      this.selectedCategory = category;
      this.currentPage = 1;
      await this.FetchRecords();
    },

    getFormatDate(rawDate) {
      const date = new Date(rawDate);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    },

    getThumbnailUrl(item) {
      return toCdnUrl(pb.files.getURL(item, item.thumbnail));
    },

    async changePageNum(newPageNum) {
      if (newPageNum < 1 || newPageNum > this.MaxPage) return;
      this.currentPage = newPageNum;
      await this.FetchRecords();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async onSearch() {
      this.activeSearchKeyword = this.searchKeyword.trim();
      this.currentPage = 1;
      await this.FetchRecords();
    },

    async clearSearch() {
      this.searchKeyword = "";
      this.activeSearchKeyword = "";
      this.currentPage = 1;
      await this.FetchRecords();
    },

    async resetFilters() {
      this.searchKeyword = "";
      this.activeSearchKeyword = "";
      this.selectedCategory = "전체";
      this.currentPage = 1;
      await this.FetchRecords();
    },
  },
};
</script>

<style scoped>
.board-page {
  min-height: 100vh;
  background: var(--color-gray-50);
}

/* 헤더 */
.board-header {
  background: white;
  padding: var(--space-10) var(--space-4) var(--space-8);
  border-bottom: 1px solid var(--color-gray-200);
}

.board-header-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.board-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 var(--space-4);
}

/* 관리자 버튼 */
.admin-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-700);
  background: var(--color-gray-100);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.admin-btn:hover {
  background: var(--color-gray-200);
}

.admin-btn.primary {
  color: white;
  background: var(--color-primary);
}

.admin-btn.primary:hover {
  background: var(--color-primary-dark);
}

.board-count {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-6);
}

.board-count strong {
  color: var(--color-gray-700);
}

/* 검색 */
.search-container {
  max-width: 480px;
  margin: 0 auto;
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-gray-50);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  padding: var(--space-1);
  transition: all var(--transition-fast);
}

.search-input-wrap:focus-within {
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.search-icon {
  position: absolute;
  left: var(--space-4);
  color: var(--color-gray-400);
  pointer-events: none;
}

.search-input {
  flex: 1;
  padding: var(--space-3) var(--space-4) var(--space-3) 48px;
  font-size: var(--font-size-base);
  color: var(--color-gray-800);
  background: transparent;
  border: none;
  outline: none;
}

.search-input::placeholder {
  color: var(--color-gray-400);
}

.search-clear {
  padding: var(--space-2);
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.search-clear:hover {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}

.search-btn {
  padding: var(--space-2) var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-btn:hover {
  background: var(--color-primary-dark);
}

.search-result-text {
  margin-top: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

/* 필터 */
.filter-section {
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  z-index: 10;
}

.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  overflow-x: auto;
}

.filter-tabs {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-3) 0;
}

.filter-tab {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-600);
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.filter-tab:hover {
  color: var(--color-gray-900);
  background: var(--color-gray-100);
}

.filter-tab.active {
  color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: 600;
}

/* 컨텐츠 */
.board-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

/* 카드 그리드 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.board-card {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.board-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.board-card:hover .card-image-src {
  transform: scale(1.05);
}

.card-image {
  height: 180px;
  overflow: hidden;
  background: var(--color-gray-100);
}

.card-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-300);
}

.card-image-src {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-body {
  padding: var(--space-5);
}

.category-tag {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-3);
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray-900);
  line-height: 1.5;
  margin: 0 0 var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-excerpt {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: 1.6;
  margin: 0 0 var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-date {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  display: block;
}

/* 스켈레톤 */
.skeleton-card .card-image {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-tag {
  width: 60px;
  height: 20px;
  border-radius: var(--radius-full);
}

.skeleton-title {
  width: 100%;
  height: 20px;
  margin: var(--space-3) 0;
  border-radius: var(--radius-sm);
}

.skeleton-date {
  width: 80px;
  height: 14px;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: var(--space-16) var(--space-4);
  color: var(--color-gray-500);
}

.empty-state svg {
  color: var(--color-gray-300);
  margin-bottom: var(--space-4);
}

.empty-state h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0 0 var(--space-2);
}

.empty-state p {
  font-size: var(--font-size-sm);
  margin: 0 0 var(--space-6);
}

.reset-btn {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reset-btn:hover {
  background: var(--color-primary-dark);
}

/* 페이지네이션 */
.pagination-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-10);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-600);
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled) {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.page-num {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-600);
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-num:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.page-num.active {
  color: white;
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.page-ellipsis {
  padding: 0 var(--space-2);
  color: var(--color-gray-400);
}

/* 태블릿 */
@media (max-width: 992px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5);
  }
}

/* 모바일 */
@media (max-width: 640px) {
  .board-header {
    padding: var(--space-6) var(--space-4);
  }

  .board-title {
    font-size: var(--font-size-2xl);
  }

  .admin-actions {
    flex-wrap: wrap;
  }

  .admin-btn {
    font-size: var(--font-size-xs);
    padding: var(--space-2) var(--space-3);
  }

  .search-btn {
    padding: var(--space-2) var(--space-4);
  }

  .filter-tabs {
    padding: var(--space-2) 0;
  }

  .filter-tab {
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-xs);
  }

  .board-content {
    padding: var(--space-4);
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .board-card {
    display: flex;
    border-radius: var(--radius-lg);
  }

  .card-image {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
  }

  .card-image.placeholder svg {
    width: 24px;
    height: 24px;
  }

  .card-body {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .category-tag {
    font-size: 10px;
    padding: 2px var(--space-2);
    margin-bottom: var(--space-2);
  }

  .card-title {
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-2);
  }

  .card-excerpt {
    display: none;
  }

  .page-btn .btn-text {
    display: none;
  }

  .page-btn {
    padding: var(--space-2);
  }

  .page-num {
    min-width: 32px;
    height: 32px;
    font-size: var(--font-size-xs);
  }
}
</style>
