<template>
  <div class="newsletter-page">
    <!-- 헤더 -->
    <div class="newsletter-header">
      <div class="newsletter-header-content">
        <h1 class="newsletter-title">쇠비름</h1>
        <p class="newsletter-subtitle">부산반빈곤센터의 격월 소식지입니다</p>
        <button v-if="is_admin" class="upload-btn" @click="openModalForAdd">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          새 소식지 업로드
        </button>
      </div>
    </div>

    <!-- 연도 필터 -->
    <div class="filter-section">
      <div class="filter-container">
        <div class="filter-tabs" role="tablist">
          <button
            v-for="year in years"
            :key="year"
            class="filter-tab"
            :class="{ active: selectedYear === year }"
            role="tab"
            :aria-selected="selectedYear === year"
            @click="changeYear(year)"
          >
            {{ year }}년
          </button>
        </div>
      </div>
    </div>

    <!-- 컨텐츠 -->
    <div class="newsletter-content">
      <!-- 로딩 스켈레톤 -->
      <div v-if="isLoading" class="newsletter-grid">
        <div v-for="n in 6" :key="'skeleton-' + n" class="newsletter-card skeleton-card">
          <div class="card-cover skeleton"></div>
          <div class="card-info">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-date"></div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-else-if="newsletters.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        </svg>
        <h3>소식지가 없습니다</h3>
        <p>{{ selectedYear }}년에 발행된 소식지가 없습니다.</p>
      </div>

      <!-- 소식지 그리드 -->
      <div v-else class="newsletter-grid">
        <article
          v-for="item in newsletters"
          :key="item.id"
          class="newsletter-card"
          @click="!is_admin && openPdfInNewTab(getPublishFileUrl(item))"
        >
          <div class="card-cover">
            <img
              :src="getImageUrl(item)"
              :alt="`쇠비름 ${item.number}호 표지`"
              loading="lazy"
            />
            <div class="card-overlay">
              <span class="view-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                보기
              </span>
            </div>
          </div>
          <div class="card-info">
            <h3 class="card-title">쇠비름 {{ item.number }}호</h3>
            <time class="card-date">{{ formatDate(item.date_publish) }}</time>

            <!-- 관리자 버튼 -->
            <div v-if="is_admin" class="admin-actions">
              <a
                class="admin-link"
                :href="getPublishFileUrl(item)"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15,3 21,3 21,9"/>
                  <line x1="10" x2="21" y1="14" y2="3"/>
                </svg>
                PDF
              </a>
              <button class="admin-btn" @click.stop="openModalForEdit(item.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                수정
              </button>
              <button class="admin-btn danger" @click.stop="confirmDelete(item.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
                삭제
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

  <div class="modal fade" :class="{ show: isOpen, 'd-block': isOpen }" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ currentEditRecordId ? '소식지 수정' : '새 소식지 업로드' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3 md-modal">
            <label class="modal-label">호수<span class="require_mark" style="color: red;">* 필수값</span></label>
            <input type="number" class="form-control" placeholder="호수를 입력해주세요." v-model="newNewsletterNumber">
          </div>

          <div class="mb-3 md-modal">
            <label class="modal-label">발행월<span class="require_mark" style="color: red;">* 필수값()</span></label>
            <input type="month" class="form-control" v-model="newNewsletterDate">
          </div>

          <div class="mb-3 md-modal">
            <label class="modal-label">
              표지 이미지<span class="require_mark" style="color: red;">* 필수값 (jpg, png)</span>
            </label>
            <template v-if="newThumbnailUrl">
              <p class="thumbnail_delete_button" @click="removeThumbnail()">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>
                다시 올리기
              </p>
            </template>
            <div class="preview_thumbnail" :style="newThumbnailUrl ? { backgroundImage: `url(${newThumbnailUrl})` } : {}">
              <input type="file" ref="thumbnailInput" accept="image/*" style="display: none" @change="onThumbnailChange" />
              <template v-if="!newThumbnailUrl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="placeholder-icon" viewBox="0 0 16 16">
                  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                </svg>
                <button type="button" class="btn btn-outline-danger btn-thumbnail" @click="triggerThumbnailInput">표지 이미지 업로드</button>
              </template>
            </div>
          </div>
          
          <div class="mb-3 md-modal">
            <label class="modal-label">
              소식지 파일<span class="require_mark" style="color: red;">* 필수값 (pdf)</span>
            </label>
            <div class="file-info-box">
              <span v-if="newPublishFile">{{ newPublishFile.name }}</span>
              <span v-else-if="currentEditRecordId && newPublishFileUrl">기존 파일: {{ newPublishFileUrl.split('/').pop() }}</span>
              <span v-else>파일을 선택해주세요.</span>
              <button type="button" class="btn btn-outline-dark" @click="triggerFileInput">파일 선택</button>
            </div>
            <input type="file" ref="fileInput" accept="application/pdf" style="display: none" @change="onFileInputChange" />
          </div>
        </div>

        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn btn-outline-dark btn-none-border" @click="closeModal">취소</button>
          <button type="button" class="btn btn-danger" @click="submitNewsletter">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
              <path d="M11 2H9v3h2z"/>
              <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
            </svg> 저장
          </button>
        </div>
      </div>
    </div>
  </div>
    <div class="modal-backdrop fade" :class="{ show: isOpen }" v-if="isOpen"></div>
  </div>
</template>

<script>
import pb from '@/pb'
import { toCdnUrl } from '@/config'

export default {
  name: "NewsletterPage",
  data() {
    return {
      newsletters: [],
      selectedYear: null,
      years: [],
      is_admin: false,
      isLoading: true,

      // 모달 관련 데이터
      isOpen: false,
      currentEditRecordId: null,
      newNewsletterNumber: '',
      newNewsletterDate: '',
      newThumbnailFile: null,
      newThumbnailUrl: null,
      newPublishFile: null,
      newPublishFileUrl: null,
    };
  },
  async mounted() {
    this.initYears();
    await Promise.all([
      this.fetchNewsletters(),
      this.checkAdmin()
    ]);
  },
  methods: {
    async checkAdmin() {
      const authStore = pb.authStore;
      if (authStore.isValid) {
        try {
          const user = await pb.collection('users').getOne(authStore.model.id);
          this.is_admin = user.is_admin === true;
        } catch (err) {
          console.error("[Newsletter CheckAdmin]", err);
          this.is_admin = false;
        }
      }
    },
    openPdfInNewTab(url) {
      console.log(url)
      if(!url) return
      window.open(url, "_blank");
    },
    initYears() {
      const currentYear = new Date().getFullYear();
      this.years = [];
      for (let y = currentYear; y >= 2012; y--) {
        this.years.push(y);
      }
      this.selectedYear = this.years[0];
    },
    async fetchNewsletters() {
      if (!this.selectedYear) return;
      this.isLoading = true;

      const from = `${this.selectedYear}-01-01 00:00:00`;
      const to = `${this.selectedYear}-12-31 23:59:59`;
      const filter = `date_publish >= "${from}" && date_publish <= "${to}"`;

      try {
        const res = await pb.collection("newsletter").getList(1, 50, {
          sort: "-number",
          filter,
          skipTotal: true,
        });
        console.log("[Newsletter] 뉴스레터 불러오기 성공:", res);
        this.newsletters = res.items;
      } catch (e) {
        console.error("[Newsletter] 뉴스레터 불러오기 실패:", e);
        this.newsletters = [];
      } finally {
        this.isLoading = false;
      }
    },
    changeYear(year) {
      if (this.selectedYear === year) return;
      this.selectedYear = year;
      this.fetchNewsletters();
    },
    formatDate(rawDate) {
      const date = new Date(rawDate);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    },
    getImageUrl(item) {
      return toCdnUrl(pb.files.getURL(item, item.thumbnail));
    },
    getPublishFileUrl(item) {
      return toCdnUrl(pb.files.getURL(item, item.publish_file));
    },

    // ---------- CRUD 및 모달 관련 메서드 ----------
    // 삭제 확인 및 실행
    async confirmDelete(id) {
      if (confirm("정말로 이 소식지를 삭제하시겠습니까?")) {
        await this.deleteNewsletter(id);
      }
    },

    // 소식지 삭제
    async deleteNewsletter(id) {
      try {
        await pb.collection('newsletter').delete(id);
        alert("소식지가 성공적으로 삭제되었습니다.");
        await this.fetchNewsletters(); // 데이터 새로고침
      } catch(err) {
        console.error("[Newsletter Error deleting]", err);
        alert("소식지 삭제에 실패했습니다: " + err.message);
      }
    },

    // 새 소식지 업로드 모달 열기
    openModalForAdd() {
      this.currentEditRecordId = null;
      this.newNewsletterNumber = '';
      this.newNewsletterDate = '';
      this.newThumbnailFile = null;
      this.newThumbnailUrl = null;
      this.newPublishFile = null;
      this.newPublishFileUrl = null;
      this.isOpen = true;
    },

    // 소식지 수정 모달 열기
    openModalForEdit(id) {
      this.currentEditRecordId = id;
      const newsletter = this.newsletters.find(n => n.id === id);
      if (newsletter) {
        this.newNewsletterNumber = newsletter.number;
        // 날짜 형식 맞추기 (YYYY-MM-DD)
        const dateObj = new Date(newsletter.date_publish);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        this.newNewsletterDate = `${year}-${month}`;
        
        this.newThumbnailUrl = this.getImageUrl(newsletter);
        this.newPublishFileUrl = this.getPublishFileUrl(newsletter);
        this.newThumbnailFile = null;
        this.newPublishFile = null;
        this.isOpen = true;
      } else {
        alert("수정할 소식지를 찾을 수 없습니다.");
      }
    },

    // 모달 닫기
    closeModal() {
      this.isOpen = false;
      this.currentEditRecordId = null;
      this.newNewsletterNumber = '';
      this.newNewsletterDate = '';
      this.newThumbnailFile = null;
      this.newThumbnailUrl = null;
      this.newPublishFile = null;
      this.newPublishFileUrl = null;
    },
    
    // 표지 이미지 입력 요소 클릭 트리거
    triggerThumbnailInput() {
      this.$refs.thumbnailInput.click();
    },

    // 소식지 파일 입력 요소 클릭 트리거
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // 썸네일 파일 변경 시 처리
    onThumbnailChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newThumbnailFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newThumbnailUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.newThumbnailFile = null;
        this.newThumbnailUrl = null;
      }
    },
    
    // 소식지 파일 변경 시 처리
    onFileInputChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newPublishFile = file;
      } else {
        this.newPublishFile = null;
      }
    },

    // 미리보기 이미지 제거
    removeThumbnail() {
      this.newThumbnailFile = null;
      this.newThumbnailUrl = null;
      if (this.$refs.thumbnailInput) {
        this.$refs.thumbnailInput.value = '';
      }
    },

    async submitNewsletter() {
      // 유효성 검사
      if (!this.newNewsletterNumber) {
        alert("호수를 입력해주세요.");
        return;
      }
      if (!this.newNewsletterDate) {
        alert("발행월을 입력해주세요.");
        return;
      }
      if (!this.newThumbnailFile && !this.newThumbnailUrl && !this.currentEditRecordId) {
         alert("표지 이미지를 업로드해주세요.");
         return;
      }
      if (!this.newPublishFile && !this.newPublishFileUrl && !this.currentEditRecordId) {
         alert("소식지 파일을 업로드해주세요.");
         return;
      }

      try {
        const formData = new FormData();
        const [year, month] = this.newNewsletterDate.split('-');

        formData.append('number', this.newNewsletterNumber);
        formData.append('date_publish', `${year}-${month}-01 00:00:00`);

        if (this.newThumbnailFile) {
          formData.append('thumbnail', this.newThumbnailFile);
        } else if (this.currentEditRecordId && !this.newThumbnailUrl) {
          formData.append('thumbnail', '');
        }

        if (this.newPublishFile) {
          formData.append('publish_file', this.newPublishFile);
        } else if (this.currentEditRecordId && !this.newPublishFileUrl) {
           formData.append('publish_file', '');
        }

        let record;
        if (this.currentEditRecordId) {
          // 기존 소식지 수정
          record = await pb.collection('newsletter').update(this.currentEditRecordId, formData);
          alert("소식지가 성공적으로 수정되었습니다.");
        } else {
          // 새 소식지 추가
          record = await pb.collection('newsletter').create(formData);
          alert("소식지가 성공적으로 추가되었습니다.");
        }
        
        console.log("소식지 처리 완료:", record);
        this.closeModal();
        await this.fetchNewsletters();
      } catch (error) {
        console.error("소식지 처리 실패:", error);
        alert("소식지 처리에 실패했습니다: " + error.message);
      }
    }
  }
}
</script>

<style scoped>
.newsletter-page {
  min-height: 100vh;
  background: var(--color-gray-50);
}

/* 헤더 */
.newsletter-header {
  background: white;
  padding: var(--space-10) var(--space-4) var(--space-8);
  border-bottom: 1px solid var(--color-gray-200);
  text-align: center;
}

.newsletter-header-content {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 var(--space-2);
  font-family: 'Noto Serif KR', serif;
}

.newsletter-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-6);
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.upload-btn:hover {
  background: var(--color-primary-dark);
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
  justify-content: center;
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
.newsletter-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

/* 그리드 */
.newsletter-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.newsletter-card {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.newsletter-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-cover {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: var(--color-gray-100);
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.newsletter-card:hover .card-cover img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.newsletter-card:hover .card-overlay {
  opacity: 1;
}

.view-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.card-info {
  padding: var(--space-4);
}

.card-info .card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0 0 var(--space-1);
}

.card-info .card-date {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 500;
  display: block;
}

/* 관리자 액션 */
.admin-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-gray-100);
}

.admin-link,
.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-gray-600);
  background: var(--color-gray-100);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.admin-link:hover,
.admin-btn:hover {
  background: var(--color-gray-200);
}

.admin-btn.danger {
  color: var(--color-error);
}

.admin-btn.danger:hover {
  background: #fef2f2;
}

/* 스켈레톤 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-card .card-cover {
  aspect-ratio: 3/4;
}

.skeleton-title {
  width: 80%;
  height: 20px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-2);
}

.skeleton-date {
  width: 50%;
  height: 16px;
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
  margin: 0;
}

/* 모달 스타일 */
.modal-dialog {
  max-width: 500px;
}

.modal-content {
  padding: 20px;
}

.modal-header {
  border-bottom: none;
  padding-bottom: 0;
}

.modal-title {
  font-weight: 700;
  font-size: var(--font-size-xl);
}

.modal-body {
  padding-top: var(--space-4);
}

.modal-footer {
  border-top: none;
  padding-top: var(--space-4);
}

.md-modal {
  margin-top: var(--space-2) !important;
  padding-top: var(--space-3) !important;
  padding-left: var(--space-2) !important;
  padding-right: var(--space-2) !important;
  border-top: 1px solid var(--color-gray-200);
}

.modal-label {
  font-weight: 600;
  margin-bottom: var(--space-2);
  display: block;
}

.require_mark {
  margin-left: var(--space-1);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.preview_thumbnail {
  width: 100%;
  height: 200px;
  background-color: var(--color-gray-100);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.preview_thumbnail:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  color: var(--color-gray-400);
  margin-bottom: var(--space-3);
}

.btn-thumbnail {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-primary);
  background: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.thumbnail_delete_button {
  text-align: right;
  font-size: var(--font-size-sm);
  cursor: pointer;
  color: var(--color-error);
  margin-bottom: var(--space-2);
}

.thumbnail_delete_button:hover {
  font-weight: 600;
}

.file-info-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

/* 반응형 */
@media (max-width: 1024px) {
  .newsletter-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .newsletter-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .newsletter-title {
    font-size: var(--font-size-3xl);
  }

  .filter-tabs {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .newsletter-header {
    padding: var(--space-6) var(--space-4);
  }

  .newsletter-title {
    font-size: var(--font-size-2xl);
  }

  .newsletter-content {
    padding: var(--space-4);
  }

  .newsletter-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .card-info {
    padding: var(--space-3);
  }

  .card-info .card-title {
    font-size: var(--font-size-sm);
  }

  .card-info .card-date {
    font-size: var(--font-size-xs);
  }

  .admin-actions {
    flex-wrap: wrap;
  }
}
</style>