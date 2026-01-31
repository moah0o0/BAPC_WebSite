<template>
  <div class="cms-board">
    <div class="cms-container">
      <!-- 헤더 -->
      <div class="cms-header">
        <div class="header-top">
          <button class="back-button" @click="$router.go(-1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            뒤로가기
          </button>
          <nav class="breadcrumb-nav" aria-label="breadcrumb">
            <span class="breadcrumb-item">일반 게시판</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            <span class="breadcrumb-item">{{ collection_name_KO }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            <span class="breadcrumb-item active">관리 패널</span>
          </nav>
        </div>

        <div class="header-title">
          <h1>{{ collection_name_KO }} 관리</h1>
          <p>게시물을 검색, 수정, 삭제할 수 있습니다.</p>
        </div>
      </div>

      <!-- 검색 및 필터 영역 -->
      <div class="search-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="제목 또는 내용으로 검색..."
            v-model="searchTerm"
            @keyup.enter="onSearch"
          />
          <button class="search-btn" @click="onSearch">검색</button>
        </div>

        <div class="filter-controls">
          <div class="filter-item">
            <label>카테고리</label>
            <select v-model="filterCategory">
              <option value="">전체</option>
              <option v-for="cat in categoryOptions" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
          <div class="filter-item">
            <label>정렬</label>
            <button class="sort-btn" @click="toggleSortOrder">
              {{ sortOrder === '-postdate' ? '최신순' : '오래된순' }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="sortOrder === '-postdate'" d="m6 9 6 6 6-6"/>
                <path v-else d="m18 15-6-6-6 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 게시물 테이블 카드 -->
      <div class="table-card">
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <span>불러오는 중...</span>
        </div>

        <!-- 데스크톱 테이블 -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th class="checkbox-cell">
                  <input
                    type="checkbox"
                    v-model="allSelected"
                    @change="toggleAll"
                    class="custom-checkbox"
                  />
                </th>
                <th class="title-cell">제목</th>
                <th class="date-cell">게시일자</th>
                <th class="content-cell">내용 미리보기</th>
                <th class="category-cell">카테고리</th>
                <th class="action-cell">수정</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in Records" :key="record.id" :class="{ selected: selectedIds.includes(record.id) }">
                <td class="checkbox-cell">
                  <input
                    type="checkbox"
                    v-model="selectedIds"
                    :value="record.id"
                    class="custom-checkbox"
                  />
                </td>
                <td class="title-cell">
                  <span class="record-title">{{ record.title }}</span>
                </td>
                <td class="date-cell">
                  <span class="record-date">{{ formatDate(record.postdate) }}</span>
                </td>
                <td class="content-cell">
                  <span class="record-content">{{ truncate(record.content, 80) }}</span>
                </td>
                <td class="category-cell">
                  <span class="category-badge" v-if="record.category">{{ record.category }}</span>
                  <span class="category-empty" v-else>-</span>
                </td>
                <td class="action-cell">
                  <button
                    class="edit-btn"
                    @click="$router.push({ name: 'cms_editor', params: { collection_name: $route.params.collection_name, record_id: record.id } })"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                    수정
                  </button>
                </td>
              </tr>

              <!-- 데이터 없을 때 -->
              <tr v-if="!isLoading && Records.length === 0">
                <td colspan="6" class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="9" x2="15" y1="15" y2="15"/>
                  </svg>
                  <p>검색 결과가 없습니다.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 모바일 카드 뷰 -->
        <div class="mobile-cards">
          <div
            v-for="record in Records"
            :key="record.id"
            class="mobile-card"
            :class="{ selected: selectedIds.includes(record.id) }"
          >
            <div class="card-header">
              <input
                type="checkbox"
                v-model="selectedIds"
                :value="record.id"
                class="custom-checkbox"
              />
              <span class="category-badge" v-if="record.category">{{ record.category }}</span>
            </div>
            <h3 class="card-title">{{ record.title }}</h3>
            <p class="card-content">{{ truncate(record.content, 100) }}</p>
            <div class="card-footer">
              <span class="card-date">{{ formatDate(record.postdate) }}</span>
              <button
                class="edit-btn"
                @click="$router.push({ name: 'cms_editor', params: { collection_name: $route.params.collection_name, record_id: record.id } })"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
                수정
              </button>
            </div>
          </div>

          <!-- 모바일 빈 상태 -->
          <div v-if="!isLoading && Records.length === 0" class="mobile-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="9" x2="15" y1="15" y2="15"/>
            </svg>
            <p>검색 결과가 없습니다.</p>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div class="table-footer">
          <div class="pagination-info">
            총 <strong>{{ pagination.totalItems }}</strong>건
            ({{ pagination.page }}/{{ pagination.totalPages || 1 }} 페이지)
          </div>

          <div class="pagination-controls">
            <button
              class="page-btn"
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            <button
              v-for="p in visiblePages"
              :key="p"
              class="page-btn"
              :class="{ active: p === pagination.page }"
              @click="changePage(p)"
            >
              {{ p }}
            </button>

            <button
              class="page-btn"
              :disabled="pagination.page === pagination.totalPages"
              @click="changePage(pagination.page + 1)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 새 게시물 작성 버튼 -->
      <button
        class="new-post-btn"
        @click="$router.push({ name: 'cms_editor', params: { collection_name: $route.params.collection_name, record_id: 'new' } })"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14"/>
          <path d="M5 12h14"/>
        </svg>
        새 게시물 작성
      </button>
    </div>

    <!-- 선택 삭제 플로팅 버튼 -->
    <Transition name="slide-up">
      <div v-if="selectedIds.length > 0" class="floating-delete">
        <div class="delete-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          <span><strong>{{ selectedIds.length }}</strong>개 선택됨</span>
        </div>
        <button class="delete-btn" @click="deleteSelected" :disabled="isDeleting">
          <span v-if="isDeleting" class="btn-spinner"></span>
          <span v-else>선택 삭제</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
import pb from '@/pb'

export default {
  data() {
    return {
      collection_name: this.$route.params.collection_name,
      collection_name_KO: {
        activity: "활동소식",
        notice: "공지사항",
        archive: "자료실",
      }[this.$route.params.collection_name],

      Records: [],
      searchTerm: "",
      selectedIds: [],
      allSelected: false,
      isLoading: true,
      isDeleting: false,

      pagination: {
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 1,
      },

      sortOrder: "-postdate",
      filterCategory: "",
      categoryOptions: [],
    };
  },
  computed: {
    visiblePages() {
      const total = this.pagination.totalPages;
      const current = this.pagination.page;
      const pages = [];

      let start = Math.max(1, current - 2);
      let end = Math.min(total, current + 2);

      if (end - start < 4) {
        if (start === 1) {
          end = Math.min(total, 5);
        } else {
          start = Math.max(1, total - 4);
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  watch: {
    Records() {
      this.syncAllSelected();
    },
    selectedIds() {
      this.syncAllSelected();
    },
    filterCategory() {
      this.pagination.page = 1;
      this.getRecords();
    },
  },
  async mounted() {
    await this.getRecords();
  },
  methods: {
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "-postdate" ? "postdate" : "-postdate";
      this.pagination.page = 1;
      this.getRecords();
    },

    async DeleteRecord(record_id) {
      const record = await pb.collection(this.$route.params.collection_name).getOne(record_id);
      const files = record.uploads?.file || [];
      const images = record.uploads?.image || [];

      for (let i = 0; i < files.length; i++) {
        await pb.collection("files").delete(files[i].id).catch(() => {});
      }

      for (let i = 0; i < images.length; i++) {
        await pb.collection("images").delete(images[i].id).catch(() => {});
      }

      await pb.collection(this.$route.params.collection_name).delete(record_id);
    },

    toggleAll() {
      if (this.allSelected) {
        this.selectedIds = this.Records.map((r) => r.id);
      } else {
        this.selectedIds = [];
      }
    },

    syncAllSelected() {
      this.allSelected =
        this.Records.length > 0 &&
        this.selectedIds.length === this.Records.length;
    },

    async deleteSelected() {
      if (!confirm(`선택된 ${this.selectedIds.length}개 항목을 삭제하시겠습니까?`)) return;

      this.isDeleting = true;
      try {
        await Promise.all(this.selectedIds.map((id) => this.DeleteRecord(id)));
        this.selectedIds = [];
        await this.getRecords();
      } catch (err) {
        console.error("[일괄 삭제 에러]", err);
        alert("삭제 중 오류가 발생했습니다.");
      } finally {
        this.isDeleting = false;
      }
    },

    async getRecords() {
      this.isLoading = true;
      try {
        const filters = [];

        if (this.searchTerm) {
          const escaped = this.searchTerm.replace(/"/g, '\\"');
          filters.push(`title~"${escaped}" || content_blocks~"${escaped}"`);
        }
        if (this.filterCategory) {
          filters.push(`category = "${this.filterCategory}"`);
        }

        const filterQuery = filters.join(" && ");

        const result = await pb
          .collection(this.collection_name)
          .getList(this.pagination.page, this.pagination.perPage, {
            sort: this.sortOrder,
            filter: filterQuery,
          });

        this.Records = result.items;
        this.pagination.totalItems = result.totalItems;
        this.pagination.totalPages = result.totalPages;

        if (this.categoryOptions.length === 0) {
          const cats = result.items.map((r) => r.category).filter(Boolean);
          this.categoryOptions = [...new Set(cats)];
        }
      } catch (err) {
        console.error("[getRecords Error]", err);
      } finally {
        this.isLoading = false;
      }
    },

    changePage(newPage) {
      if (newPage < 1 || newPage > this.pagination.totalPages) return;
      this.pagination.page = newPage;
      this.getRecords();
    },

    onSearch() {
      this.pagination.page = 1;
      this.getRecords();
    },

    truncate(text, maxLength) {
      if (!text) return "";
      const plainText = text.replace(/<[^>]*>/g, "");
      return plainText.length > maxLength
        ? plainText.slice(0, maxLength) + "..."
        : plainText;
    },

    formatDate(dateStr) {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
    },
  },
};
</script>

<style scoped>
.cms-board {
  min-height: calc(100vh - 110px);
  background: var(--color-gray-50);
  padding: var(--space-6) var(--space-4);
}

.cms-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 헤더 */
.cms-header {
  margin-bottom: var(--space-6);
}

.header-top {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-button:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-800);
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.breadcrumb-item.active {
  color: var(--color-gray-800);
  font-weight: 500;
}

.header-title h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 var(--space-1);
}

.header-title p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0;
}

/* 검색 영역 */
.search-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  transition: all var(--transition-fast);
}

.search-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.search-box svg {
  color: var(--color-gray-400);
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: var(--font-size-base);
  color: var(--color-gray-800);
}

.search-box input::placeholder {
  color: var(--color-gray-400);
}

.search-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-btn:hover {
  background: var(--color-primary-dark);
}

.filter-controls {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.filter-item label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: 500;
}

.filter-item select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  background: white;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  cursor: pointer;
  min-width: 120px;
}

.filter-item select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sort-btn:hover {
  background: var(--color-gray-50);
}

/* 테이블 카드 */
.table-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  position: relative;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  z-index: 10;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay span {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: var(--color-gray-50);
  padding: var(--space-4);
  text-align: left;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-gray-200);
}

.data-table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-gray-100);
  vertical-align: middle;
}

.data-table tr:hover {
  background: var(--color-gray-50);
}

.data-table tr.selected {
  background: var(--color-primary-light);
}

.checkbox-cell {
  width: 50px;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.title-cell {
  min-width: 200px;
}

.record-title {
  font-weight: 500;
  color: var(--color-gray-800);
}

.date-cell {
  width: 120px;
}

.record-date {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.content-cell {
  min-width: 250px;
  max-width: 350px;
}

.record-content {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  line-height: 1.5;
}

.category-cell {
  width: 120px;
}

.category-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
}

.category-empty {
  color: var(--color-gray-400);
}

.action-cell {
  width: 100px;
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.edit-btn:hover {
  background: var(--color-primary);
  color: white;
}

.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-4) !important;
}

.empty-state svg {
  color: var(--color-gray-300);
  margin-bottom: var(--space-4);
}

.empty-state p {
  margin: 0;
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

/* 모바일 카드 뷰 */
.mobile-cards {
  display: none;
  padding: var(--space-4);
  gap: var(--space-4);
}

.mobile-card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.mobile-card.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.mobile-card .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.mobile-card .card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0 0 var(--space-2);
}

.mobile-card .card-content {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-3);
  line-height: 1.5;
}

.mobile-card .card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-gray-100);
}

.mobile-card .card-date {
  font-size: var(--font-size-sm);
  color: var(--color-gray-400);
}

.mobile-empty {
  text-align: center;
  padding: var(--space-12);
}

.mobile-empty svg {
  color: var(--color-gray-300);
  margin-bottom: var(--space-4);
}

.mobile-empty p {
  margin: 0;
  color: var(--color-gray-500);
}

/* 페이지네이션 */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-top: 1px solid var(--color-gray-100);
  gap: var(--space-4);
  flex-wrap: wrap;
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.pagination-controls {
  display: flex;
  gap: var(--space-1);
}

.page-btn {
  min-width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled) {
  background: var(--color-gray-50);
  border-color: var(--color-gray-300);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* 새 게시물 버튼 */
.new-post-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding: var(--space-3) var(--space-5);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.new-post-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

/* 플로팅 삭제 버튼 */
.floating-delete {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  background: var(--color-gray-900);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-xl);
  z-index: 100;
}

.delete-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: white;
  font-size: var(--font-size-sm);
}

.delete-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 80px;
}

.delete-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 애니메이션 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .cms-board {
    padding: var(--space-4);
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .breadcrumb-nav {
    font-size: var(--font-size-xs);
  }

  .header-title h1 {
    font-size: var(--font-size-xl);
  }

  .search-box {
    flex-wrap: wrap;
  }

  .search-box input {
    order: -1;
    width: 100%;
    margin-bottom: var(--space-2);
  }

  .search-box svg {
    display: none;
  }

  .search-btn {
    margin-left: auto;
  }

  .table-wrapper {
    display: none;
  }

  .mobile-cards {
    display: flex;
    flex-direction: column;
  }

  .table-footer {
    flex-direction: column;
    text-align: center;
  }

  .new-post-btn {
    width: 100%;
    justify-content: center;
  }

  .floating-delete {
    bottom: var(--space-4);
    padding: var(--space-2) var(--space-4);
    width: calc(100% - var(--space-8));
    max-width: 400px;
  }
}
</style>
