<template>
  <div class="editor-page">
    <div class="editor-container">
      <!-- 헤더 -->
      <div class="editor-header">
        <nav class="breadcrumb-nav" aria-label="breadcrumb">
          <span class="breadcrumb-item">{{ collection_name_KO }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span class="breadcrumb-item active">{{ isEdit ? '게시물 수정' : '새 게시물 작성' }}</span>
        </nav>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isPageLoading" class="page-loading">
        <div class="loading-spinner"></div>
        <span>불러오는 중...</span>
      </div>

      <!-- 에디터 폼 -->
      <div v-else class="editor-form">
        <!-- 제목 입력 -->
        <div class="title-section">
          <textarea
            class="title-input"
            v-model="form.title"
            :placeholder="isEdit && existing_record ? existing_record.title : '제목을 입력하세요'"
            @keydown.prevent.enter
            rows="1"
          ></textarea>
        </div>

        <!-- 카테고리 선택 -->
        <div class="category-section">
          <label class="section-label">카테고리</label>
          <div class="category-buttons">
            <button
              v-for="cat in categories"
              :key="cat"
              class="category-btn"
              :class="{ active: form.category === cat }"
              @click="set_category_old(cat)"
            >
              {{ cat }}
            </button>
            <button class="category-btn add" @click="set_category_new">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14"/>
                <path d="M5 12h14"/>
              </svg>
              추가
            </button>
          </div>
        </div>

        <!-- 에디터 -->
        <div class="content-section">
          <EditorJs
            v-if="pb && (existing_record || !isEdit)"
            ref="editorComponent"
            :pbInstance="pb"
            :content="existing_record ? existing_record.content_blocks : {}"
            @uploadImage="uploadImages.push($event)"
            @uploadFile="uploadFiles.push($event)"
          />
        </div>

        <!-- 하단 버튼 -->
        <div class="action-bar">
          <button type="button" class="btn-secondary" @click="$router.go(-1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            나가기
          </button>
          <button type="button" class="btn-primary" @click="isOpen = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            작성 완료
          </button>
        </div>
      </div>
    </div>

    <!-- 저장 모달 -->
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="isOpen = false">
        <div class="save-modal">
          <div class="modal-header">
            <h2>게시물 설정</h2>
            <button class="modal-close" @click="isOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- 대표이미지 -->
            <div class="form-group">
              <label class="form-label">
                대표이미지
                <span v-if="collection === 'activity'" class="required-mark">* 필수</span>
              </label>

              <div class="thumbnail-upload" :class="{ 'has-image': thumbnailUrl }">
                <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  style="display: none"
                  @change="onThumbnailChange"
                />

                <template v-if="thumbnailUrl">
                  <div class="thumbnail-preview" :style="{ backgroundImage: `url(${thumbnailUrl})` }">
                    <button type="button" class="thumbnail-remove" @click="removeThumbnail">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                      삭제
                    </button>
                  </div>
                </template>

                <template v-else>
                  <div class="thumbnail-placeholder" @click="triggerFileInput">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <span>클릭하여 이미지 업로드</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- 작성일자 -->
            <div class="form-group">
              <label class="form-label">
                작성일자
                <span class="required-mark">* 필수</span>
              </label>
              <VueDatePicker
                locale="ko"
                :format="formatDate"
                :enable-time-picker="false"
                v-model="form.postdate"
                class="custom-datepicker"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="isOpen = false">취소</button>
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
import VueDatePicker from '@vuepic/vue-datepicker';
import EditorJs from './EditorJs.vue';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: 'PostEditor',
  components: {
    VueDatePicker,
    EditorJs
  },
  data() {
    return {
      thumbnailUrl: null,
      isOpen: false,
      isPageLoading: true,
      isSaving: false,
      pb: null,
      collection: this.$route.params.collection_name,
      record_id: this.$route.params.record_id,
      existing_record: null,
      uploadImages: [],
      uploadFiles: [],
      categories: [],
      new_categories: [],
      form: {
        title: '',
        category: '',
        postdate: '',
      },
      thumbnailFile: null,
      isEdit: false,
      collection_name_KO: {
        activity: "활동소식",
        notice: "공지사항",
        archive: "자료실",
      }[this.$route.params.collection_name],
    }
  },
  async mounted() {
    this.pb = pb
    this.isEdit = (this.record_id !== "new")

    try {
      if (this.isEdit) {
        this.existing_record = await this.pb.collection(this.collection).getOne(this.record_id);
        this.form = {
          title: this.existing_record.title || '',
          category: this.existing_record.category || '',
          postdate: this.existing_record.postdate || '',
        }
        if (this.existing_record.thumbnail) {
          this.thumbnailUrl = this.pb.files.getUrl(this.existing_record, this.existing_record.thumbnail);
          try {
            const res = await fetch(this.thumbnailUrl)
            const blob = await res.blob()
            this.thumbnailFile = new File([blob], "thumbnail.png", { type: blob.type || 'image/png' })
          } catch (e) {
            console.error('[Thumbnail fetch error]', e)
          }
        }

        this.uploadImages = this.existing_record.uploads?.image || []
        this.uploadFiles = this.existing_record.uploads?.file || []
      }

      await this.loadCategories()
    } catch (e) {
      console.error('[Editor mount error]', e)
    } finally {
      this.isPageLoading = false
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    onThumbnailChange(e) {
      const file = e.target.files[0]
      if (!file) return
      this.thumbnailFile = file
      this.thumbnailUrl = URL.createObjectURL(file)
    },
    removeThumbnail() {
      this.thumbnailFile = null
      this.thumbnailUrl = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = null
      }
    },
    set_category_old(category_text) {
      this.form.category = category_text
      this.categories = this.categories.filter(e => !this.new_categories.includes(e))
      this.new_categories = []
    },
    set_category_new() {
      const category_text = prompt("추가할 카테고리명을 입력해주세요.")
      if (!category_text) return
      if (!this.categories.includes(category_text)) this.categories.push(category_text)
      this.form.category = category_text
      this.new_categories.push(category_text)
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      return `${year}-${month}-${day}`
    },
    async loadCategories() {
      try {
        const allRecords = await this.pb.collection(this.collection).getFullList({
          fields: 'category',
          filter: 'category != null && category != ""',
        })
        const categorySet = new Set(allRecords.map(r => r.category))
        this.categories = Array.from(categorySet)
      } catch (error) {
        console.error('카테고리 불러오기 실패:', error)
      }
    },
    async submitPost() {
      this.isSaving = true

      try {
        const editor = this.$refs.editorComponent.editor
        const savedData = await editor.save()
        await this.cleanUnusedUploads(savedData)

        if (
          !this.form.title?.trim() ||
          !this.form.category?.trim() ||
          !this.form.postdate ||
          !savedData.blocks ||
          savedData.blocks.length === 0
        ) {
          alert('제목, 카테고리, 날짜, 내용은 반드시 입력해야 합니다.')
          return
        }

        const formData = new FormData()
        formData.append('title', this.form.title)
        formData.append('category', this.form.category)
        formData.append('postdate', new Date(this.form.postdate).toISOString())
        formData.append('content_blocks', JSON.stringify(savedData))

        if (!this.thumbnailFile && this.collection === 'activity') {
          alert("활동 게시판은 반드시 대표이미지를 등록하셔야 합니다.")
          return
        }

        if (!this.thumbnailFile) {
          this.thumbnailFile = ''
        }
        formData.append('thumbnail', this.thumbnailFile)

        formData.append('uploads', JSON.stringify({ file: this.uploadFiles, image: this.uploadImages }))

        if (this.isEdit) {
          await this.pb.collection(this.collection).update(this.record_id, formData)
          alert('게시물이 수정되었습니다.')
        } else {
          await this.pb.collection(this.collection).create(formData)
          alert('게시물이 등록되었습니다.')
        }
        this.$router.push({ name: 'generalBoard', params: { collection_name: this.collection } })
      } catch (err) {
        console.error('저장 실패:', err)
        alert('저장 중 오류가 발생했습니다.')
      } finally {
        this.isSaving = false
      }
    },
    async cleanUnusedUploads(savedData) {
      const usedIds = new Set()
      for (const block of savedData.blocks) {
        const fileId = block.data?.file?.id
        if (fileId) usedIds.add(fileId)
      }

      const unusedImages = this.uploadImages.filter(item => !usedIds.has(item.id))
      const unusedFiles = this.uploadFiles.filter(item => !usedIds.has(item.id))

      await Promise.all(unusedImages.map(i => this.pb.collection('images').delete(i.id).catch(() => {})))
      await Promise.all(unusedFiles.map(f => this.pb.collection('files').delete(f.id).catch(() => {})))

      this.uploadImages = this.uploadImages.filter(item => usedIds.has(item.id))
      this.uploadFiles = this.uploadFiles.filter(item => usedIds.has(item.id))
    }
  }
}
</script>

<style scoped>
.editor-page {
  min-height: calc(100vh - 110px);
  background: var(--color-gray-50);
}

.editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
}

/* 헤더 */
.editor-header {
  margin-bottom: var(--space-6);
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

/* 페이지 로딩 */
.page-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  gap: var(--space-4);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.page-loading span {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

/* 에디터 폼 */
.editor-form {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
}

/* 제목 입력 */
.title-section {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-gray-100);
}

.title-input {
  width: 100%;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  border: none;
  resize: none;
  padding: 0;
  line-height: 1.4;
  background: transparent;
}

.title-input:focus {
  outline: none;
}

.title-input::placeholder {
  color: var(--color-gray-400);
}

/* 카테고리 섹션 */
.category-section {
  margin-bottom: var(--space-6);
}

.section-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: var(--space-3);
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.category-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-gray-100);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-btn:hover {
  background: var(--color-gray-200);
}

.category-btn.active {
  background: var(--color-primary);
  color: white;
}

.category-btn.add {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: transparent;
  border: 1px dashed var(--color-gray-300);
  color: var(--color-gray-500);
}

.category-btn.add:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

/* 에디터 영역 */
.content-section {
  min-height: 400px;
  margin-bottom: var(--space-6);
}

/* 액션 바 */
.action-bar {
  display: flex;
  justify-content: space-between;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-100);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
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

.save-modal {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 480px;
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
  margin-bottom: var(--space-3);
}

.required-mark {
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-error);
}

/* 썸네일 업로드 */
.thumbnail-upload {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.thumbnail-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  height: 180px;
  background: var(--color-gray-50);
  border: 2px dashed var(--color-gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.thumbnail-placeholder:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.thumbnail-placeholder svg {
  color: var(--color-gray-400);
}

.thumbnail-placeholder span {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.thumbnail-preview {
  position: relative;
  height: 180px;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
}

.thumbnail-remove {
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

.thumbnail-remove:hover {
  background: var(--color-error);
}

/* 커스텀 데이트피커 */
.custom-datepicker {
  width: 100%;
}

.custom-datepicker :deep(.dp__input) {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
}

.custom-datepicker :deep(.dp__input:focus) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
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

.btn-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
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

.modal-enter-from .save-modal,
.modal-leave-to .save-modal {
  transform: scale(0.95) translateY(10px);
}

/* 모바일 반응형 */
@media (max-width: 640px) {
  .editor-container {
    padding: var(--space-4);
  }

  .editor-form {
    padding: var(--space-4);
    border-radius: var(--radius-lg);
  }

  .title-input {
    font-size: var(--font-size-xl);
  }

  .action-bar {
    flex-direction: column;
    gap: var(--space-3);
  }

  .action-bar button {
    width: 100%;
    justify-content: center;
  }

  .save-modal {
    margin: var(--space-4);
    max-height: calc(100vh - var(--space-8));
  }

  .modal-body {
    padding: var(--space-4);
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
