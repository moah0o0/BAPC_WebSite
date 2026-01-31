<template>
  <section class="activities-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">최근 활동</h2>
        <p class="section-subtitle">부산반빈곤센터의 활동들을 살펴보세요</p>
      </div>

      <!-- 로딩 스켈레톤 -->
      <div v-if="isLoading" class="cards-grid">
        <div v-for="n in 3" :key="'skeleton-' + n" class="activity-card skeleton-card">
          <div class="card-image skeleton skeleton-image"></div>
          <div class="card-body">
            <div class="skeleton skeleton-text" style="width: 60px;"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text" style="width: 100px;"></div>
          </div>
        </div>
      </div>

      <!-- 실제 컨텐츠 -->
      <div v-else class="cards-grid">
        <article
          v-for="record in ActivityRecords"
          :key="record.id"
          class="activity-card"
          @click="goPost(`/post/activity/${record.id}`)"
        >
          <div class="card-image">
            <img
              v-if="record.thumbnail"
              class="card-image-src"
              :src="getThumbnailUrl(record)"
              :alt="record.title"
              loading="lazy"
            />
            <div v-else class="card-image-placeholder"></div>
          </div>
          <div class="card-body">
            <span class="category-tag">{{ record.category }}</span>
            <h3 class="card-title">{{ record.title }}</h3>
            <time class="card-date">{{ getFormatDate(record.postdate) }}</time>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import pb from '@/pb'
import { toCdnUrl } from '@/config'

export default {
  name: "NewActivites",
  data() {
    return {
      ActivityRecords: [],
      isLoading: true,
    };
  },
  async mounted() {
    await this.FetchRecords();
  },
  methods: {
    goPost(url) {
      window.location.href = url
    },
    async FetchRecords() {
      this.isLoading = true;
      try {
        const records = await pb.collection("activity").getList(1, 3, {
          sort: "-postdate",
          fields: "title,thumbnail,category,postdate,id,collectionId",
          skipTotal: true,
        });
        this.ActivityRecords = records.items;
      } catch (e) {
        console.error("[FetchRecords]", e);
        this.ActivityRecords = [];
      } finally {
        this.isLoading = false;
      }
    },


    getFormatDate(rawDate) {
      const date = new Date(rawDate);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    },

    getThumbnailUrl(item) {
      return toCdnUrl(pb.files.getURL(item, item.thumbnail));
    },

  },
};
</script>

<style scoped>
.activities-section {
  padding: 0 16px 48px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.activity-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image-src {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.activity-card:hover .card-image-src {
  transform: scale(1.05);
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
}

.card-body {
  padding: 20px;
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.5;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-date {
  font-size: 0.85rem;
  color: #888;
  display: block;
}

/* 태블릿 */
@media (max-width: 992px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* 모바일 */
@media (max-width: 640px) {
  .activities-section {
    padding: 0 12px 32px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .activity-card {
    display: flex;
    flex-direction: row;
    border-radius: 12px;
  }

  .card-image {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
  }

  .card-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .category-tag {
    font-size: 0.7rem;
    padding: 3px 10px;
    margin-bottom: 8px;
  }

  .card-title {
    font-size: 0.95rem;
    margin-bottom: 8px;
    -webkit-line-clamp: 2;
  }

  .card-date {
    font-size: 0.8rem;
  }
}
</style>
