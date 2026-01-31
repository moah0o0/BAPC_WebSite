<template>
  <div class="hero-section">
    <!-- 관리자 추가 버튼 -->
    <div v-if="is_admin" class="admin-add-bar" @click="openModalForAdd">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14"/>
        <path d="M5 12h14"/>
      </svg>
      새로운 포스터 추가
    </div>

    <div class="hero-container">
      <!-- 로딩 스켈레톤 -->
      <div v-if="isLoading" class="hero-skeleton">
        <div class="skeleton-poster"></div>
        <div class="skeleton-content">
          <div class="skeleton-badge"></div>
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-else-if="posterData.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
        <h3>등록된 포스터가 없습니다</h3>
        <p v-if="is_admin">상단의 '새로운 포스터 추가' 버튼을 클릭하여 포스터를 등록하세요.</p>
      </div>

      <!-- 캐러셀 -->
      <div v-else id="heroCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
        <!-- 인디케이터 -->
        <div class="carousel-indicators">
          <button
            v-for="(poster, index) in posterData"
            :key="poster.id"
            type="button"
            data-bs-target="#heroCarousel"
            :data-bs-slide-to="index"
            :class="{ active: index === 0 }"
            :aria-current="index === 0 ? 'true' : undefined"
            :aria-label="'슬라이드 ' + (index + 1)"
          ></button>
        </div>

        <!-- 슬라이드 -->
        <div class="carousel-inner">
          <div
            v-for="(poster, index) in posterData"
            :key="poster.id"
            class="carousel-item"
            :class="{ active: index === 0 }"
          >
            <div class="slide-wrapper">
              <!-- 포스터 이미지 -->
              <div class="slide-poster">
                <img :src="getPosterUrl(poster)" :alt="poster.title" />
              </div>

              <!-- 포스터 정보 -->
              <div class="slide-content">
                <!-- 관리자 버튼 -->
                <div v-if="is_admin" class="admin-actions">
                  <button class="admin-btn edit" @click="openModalForEdit(poster.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                    수정
                  </button>
                  <button class="admin-btn delete" @click="confirmDelete(poster.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                    삭제
                  </button>
                </div>

                <span class="slide-badge">이벤트</span>
                <h2 class="slide-title">{{ poster.title }}</h2>
                <p class="slide-description">{{ poster.summary }}</p>
                <p class="slide-meta">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ poster.info }}
                </p>
                <button class="slide-cta" @click="openWindow(poster.url)">
                  자세히 보기
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 이전/다음 버튼 -->
        <button class="carousel-nav prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span class="visually-hidden">이전</span>
        </button>
        <button class="carousel-nav next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span class="visually-hidden">다음</span>
        </button>
      </div>
    </div>

    <!-- 추가/수정 모달 -->
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="poster-modal">
          <div class="modal-header">
            <h2>{{ currentEditRecordId ? '포스터 수정' : '새 포스터 추가' }}</h2>
            <button class="modal-close" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- 포스터 이미지 업로드 -->
            <div class="form-group">
              <label class="form-label">
                포스터 이미지
                <span class="required">* 필수</span>
              </label>
              <div class="poster-upload" :class="{ 'has-image': posterUrl }">
                <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  style="display: none"
                  @change="onThumbnailChange"
                />
                <template v-if="posterUrl">
                  <div class="upload-preview" :style="{ backgroundImage: `url(${posterUrl})` }">
                    <button type="button" class="preview-remove" @click="removePoster">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      </svg>
                      이미지 변경
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="upload-placeholder" @click="triggerFileInput">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <span>클릭하여 이미지 업로드</span>
                    <span class="upload-hint">권장: 400x500px, JPG/PNG</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- 제목 -->
            <div class="form-group">
              <label class="form-label">
                제목
                <span class="required">* 필수</span>
              </label>
              <input
                type="text"
                class="form-input"
                placeholder="포스터 제목을 입력하세요"
                v-model="newPosterTitle"
              />
            </div>

            <!-- 내용 -->
            <div class="form-group">
              <label class="form-label">
                내용
                <span class="required">* 필수</span>
              </label>
              <textarea
                class="form-textarea"
                placeholder="포스터에 대한 설명을 입력하세요"
                v-model="newPosterSummary"
                rows="3"
              ></textarea>
            </div>

            <!-- 정보 -->
            <div class="form-group">
              <label class="form-label">
                일시/장소
                <span class="required">* 필수</span>
              </label>
              <input
                type="text"
                class="form-input"
                placeholder="예: 2024.01.15 / 부산시민회관"
                v-model="newPosterInfo"
              />
            </div>

            <!-- 링크 -->
            <div class="form-group">
              <label class="form-label">
                바로가기 링크
                <span class="required">* 필수</span>
              </label>
              <input
                type="url"
                class="form-input"
                placeholder="https://example.com"
                v-model="newPosterUrl"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">취소</button>
            <button type="button" class="btn-primary" @click="submitPost" :disabled="isSaving">
              <span v-if="isSaving" class="btn-spinner"></span>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                저장
              </template>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import pb from '@/pb'
import { toCdnUrl } from '@/config'

export default {
  name: 'SlidesPoster',
  data() {
    return {
      isOpen: false,
      isSaving: false,
      posterData: [],
      is_admin: false,
      isLoading: true,

      newPosterTitle: '',
      newPosterSummary: '',
      newPosterInfo: '',
      newPosterUrl: '',
      posterFile: null,
      posterUrl: null,
      currentEditRecordId: null,
    }
  },
  async mounted() {
    await Promise.all([
      this.getPosters(),
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
          console.error("[PostDetailAuth]", err);
          this.is_admin = false;
        }
      }
    },

    openWindow(url) {
      if (url && url !== '#') {
        window.open(url, '_blank');
      } else {
        alert('연결된 URL이 없습니다.');
      }
    },

    getPosterUrl(record) {
      if (record.poster) {
        const rawUrl = pb.files.getURL(record, record.poster, { thumb: '500x600' });
        return toCdnUrl(rawUrl);
      }
      return 'https://via.placeholder.com/400x500?text=No+Image';
    },

    async getPosters() {
      this.isLoading = true;
      try {
        const records = await pb.collection("poster").getList(1, 10, {
          sort: "-created",
          fields: "id,title,summary,info,url,poster,collectionId",
          skipTotal: true,
        });
        this.posterData = records.items;
      } catch (err) {
        console.error("[SlidePoster Error fetching posters]", err);
      } finally {
        this.isLoading = false;
      }
    },

    async confirmDelete(id) {
      if (confirm("정말로 이 포스터를 삭제하시겠습니까?")) {
        await this.deletePoster(id);
      }
    },

    async deletePoster(id) {
      try {
        await pb.collection('poster').delete(id);
        alert("포스터가 성공적으로 삭제되었습니다.");
        await this.getPosters();
      } catch (err) {
        console.error("[SlidePoster Error deleting poster]", err);
        alert("포스터 삭제에 실패했습니다: " + err.message);
      }
    },

    openModalForAdd() {
      this.currentEditRecordId = null;
      this.newPosterTitle = '';
      this.newPosterSummary = '';
      this.newPosterInfo = '';
      this.newPosterUrl = '';
      this.posterFile = null;
      this.posterUrl = null;
      this.isOpen = true;
    },

    openModalForEdit(id) {
      this.currentEditRecordId = id;
      const poster = this.posterData.find(p => p.id === id);
      if (poster) {
        this.newPosterTitle = poster.title;
        this.newPosterSummary = poster.summary;
        this.newPosterInfo = poster.info;
        this.newPosterUrl = poster.url;
        this.posterUrl = this.getPosterUrl(poster);
        this.posterFile = null;
        this.isOpen = true;
      } else {
        alert("수정할 포스터를 찾을 수 없습니다.");
      }
    },

    closeModal() {
      this.isOpen = false;
      this.currentEditRecordId = null;
      this.newPosterTitle = '';
      this.newPosterSummary = '';
      this.newPosterInfo = '';
      this.newPosterUrl = '';
      this.posterFile = null;
      this.posterUrl = null;
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    onThumbnailChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.posterFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.posterUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.posterFile = null;
        this.posterUrl = null;
      }
    },

    removePoster() {
      this.posterFile = null;
      this.posterUrl = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    async submitPost() {
      if (!this.newPosterTitle.trim()) {
        alert("제목은 필수 입력값입니다.");
        return;
      }
      if (!this.newPosterSummary.trim()) {
        alert("내용은 필수 입력값입니다.");
        return;
      }
      if (!this.newPosterInfo.trim()) {
        alert("일시/장소 정보는 필수 입력값입니다.");
        return;
      }
      if (!this.newPosterUrl.trim()) {
        alert("바로가기 링크는 필수 입력값입니다.");
        return;
      }

      const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
      if (!urlPattern.test(this.newPosterUrl.trim())) {
        alert("유효한 URL 형식을 입력해주세요. (예: https://example.com)");
        return;
      }

      if (!this.posterUrl && !this.posterFile && !this.currentEditRecordId) {
        alert("포스터 이미지를 업로드해주세요.");
        return;
      }

      this.isSaving = true;

      try {
        const formData = new FormData();
        formData.append('title', this.newPosterTitle);
        formData.append('summary', this.newPosterSummary);
        formData.append('info', this.newPosterInfo);
        formData.append('url', this.newPosterUrl);

        if (this.posterFile) {
          formData.append('poster', this.posterFile);
        } else if (this.currentEditRecordId && !this.posterUrl) {
          formData.append('poster', '');
        }

        if (this.currentEditRecordId) {
          await pb.collection('poster').update(this.currentEditRecordId, formData);
          alert("포스터가 성공적으로 수정되었습니다.");
        } else {
          await pb.collection('poster').create(formData);
          alert("포스터가 성공적으로 추가되었습니다.");
        }

        this.closeModal();
        await this.getPosters();
      } catch (error) {
        console.error("포스터 처리 실패:", error);
        alert("포스터 처리에 실패했습니다: " + error.message);
      } finally {
        this.isSaving = false;
      }
    },
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #fef7f7 0%, #fce4e4 50%, #f9d4d4 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 60%;
  height: 200%;
  background: radial-gradient(circle, rgba(226, 39, 59, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

/* 관리자 추가 버튼 */
.admin-add-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: linear-gradient(135deg, var(--color-gray-900) 0%, var(--color-gray-800) 100%);
  color: white;
  font-weight: 600;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.admin-add-bar:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

/* 컨테이너 */
.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-6);
  position: relative;
}

/* 스켈레톤 */
.hero-skeleton {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--space-12);
  align-items: center;
}

.skeleton-poster {
  height: 400px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-xl);
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.skeleton-badge {
  width: 80px;
  height: 28px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-full);
}

.skeleton-title {
  width: 70%;
  height: 40px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

.skeleton-text {
  width: 100%;
  height: 24px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

.skeleton-text.short {
  width: 60%;
}

.skeleton-button {
  width: 150px;
  height: 50px;
  margin-top: var(--space-4);
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-lg);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  text-align: center;
}

.empty-state svg {
  color: var(--color-gray-300);
  margin-bottom: var(--space-4);
}

.empty-state h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-600);
  margin: 0 0 var(--space-2);
}

.empty-state p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0;
}

/* 캐러셀 */
.carousel {
  position: relative;
}

.carousel-inner {
  overflow: visible;
}

/* 슬라이드 래퍼 */
.slide-wrapper {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--space-12);
  align-items: center;
  padding: var(--space-4);
}

/* 포스터 이미지 */
.slide-poster {
  position: relative;
}

.slide-poster img {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: var(--radius-xl);
  background: var(--color-gray-100);
  transition: transform var(--transition-normal);
}

.carousel-item.active .slide-poster img {
  animation: posterIn 0.6s ease-out;
}

@keyframes posterIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 슬라이드 콘텐츠 */
.slide-content {
  padding: var(--space-4);
}

/* 관리자 액션 */
.admin-actions {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.admin-btn.edit {
  color: var(--color-gray-600);
}

.admin-btn.edit:hover {
  background: var(--color-gray-100);
}

.admin-btn.delete {
  color: var(--color-error);
}

.admin-btn.delete:hover {
  background: #fef2f2;
  border-color: var(--color-error);
}

/* 배지 */
.slide-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
}

/* 제목 */
.slide-title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  color: var(--color-gray-900);
  line-height: 1.3;
  margin: 0 0 var(--space-4);
}

/* 설명 */
.slide-description {
  font-size: var(--font-size-lg);
  line-height: 1.8;
  color: var(--color-gray-600);
  margin: 0 0 var(--space-4);
}

/* 메타 정보 */
.slide-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  font-weight: 500;
  margin: 0 0 var(--space-6);
}

.slide-meta svg {
  color: var(--color-primary);
}

/* CTA 버튼 */
.slide-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.slide-cta:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(226, 39, 59, 0.4);
}

.slide-cta svg {
  transition: transform var(--transition-fast);
}

.slide-cta:hover svg {
  transform: translateX(4px);
}

/* 캐러셀 네비게이션 */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 10;
}

.carousel-nav:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.carousel-nav.prev {
  left: -25px;
}

.carousel-nav.next {
  right: -25px;
}

/* 인디케이터 */
.carousel-indicators {
  position: relative;
  bottom: -20px;
  margin: var(--space-6) 0 0;
  gap: var(--space-2);
}

.carousel-indicators button {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background: var(--color-gray-300);
  border: none;
  opacity: 1;
  transition: all var(--transition-fast);
}

.carousel-indicators button.active {
  width: 30px;
  background: var(--color-primary);
}

/* 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 1000;
}

.poster-modal {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-gray-100);
}

.modal-header h2 {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-gray-400);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.modal-body {
  padding: var(--space-6);
}

.form-group {
  margin-bottom: var(--space-5);
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: var(--space-2);
}

.required {
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-error);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--color-gray-800);
  transition: all var(--transition-fast);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--color-gray-400);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* 포스터 업로드 */
.poster-upload {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 160px;
  background: var(--color-gray-50);
  border: 2px dashed var(--color-gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.upload-placeholder:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.upload-placeholder svg {
  color: var(--color-gray-400);
}

.upload-placeholder span {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.upload-hint {
  font-size: var(--font-size-xs) !important;
  color: var(--color-gray-400) !important;
}

.upload-preview {
  position: relative;
  height: 160px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-lg);
}

.preview-remove {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.preview-remove:hover {
  background: var(--color-error);
}

/* 모달 푸터 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-gray-100);
  background: var(--color-gray-50);
}

.btn-secondary {
  padding: var(--space-3) var(--space-5);
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-secondary:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-300);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-primary:disabled {
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 모달 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .poster-modal,
.modal-leave-to .poster-modal {
  transform: scale(0.95) translateY(10px);
}

/* 모바일 반응형 */
@media (max-width: 900px) {
  .hero-container {
    padding: var(--space-8) var(--space-4);
  }

  .hero-skeleton,
  .slide-wrapper {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .slide-poster img {
    max-height: 350px;
  }

  .carousel-nav {
    display: none;
  }

  .slide-title {
    font-size: var(--font-size-xl);
  }

  .slide-description {
    font-size: var(--font-size-base);
  }

  .slide-cta {
    width: 100%;
    justify-content: center;
  }

  .admin-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-container {
    padding: var(--space-6) var(--space-3);
  }

  .slide-content {
    padding: var(--space-2);
  }

  .slide-poster img {
    max-height: 300px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer button {
    width: 100%;
    justify-content: center;
  }
}
</style>
