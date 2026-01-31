<template>
  <section class="info-section">
    <div class="container">
      <div class="info-grid">
        <!-- 공지사항 -->
        <div class="info-card">
          <div class="info-card-header">
            <h3 class="info-card-title">공지사항</h3>
            <router-link to="/board/notice" class="view-all">전체보기</router-link>
          </div>

          <!-- 로딩 스켈레톤 -->
          <div v-if="isLoadingNotices" class="info-list">
            <div v-for="n in 5" :key="'notice-skeleton-' + n" class="info-item">
              <div class="skeleton skeleton-text" style="width: 85%;"></div>
            </div>
          </div>

          <!-- 실제 데이터 -->
          <div v-else class="info-list">
            <div
              v-for="record in NoticesRecords"
              :key="record.id"
              class="info-item notice-item"
              @click="goPost(`/post/notice/${record.id}`)"
            >
              <span class="info-item-title">{{ record.title }}</span>
            </div>
            <div v-if="NoticesRecords.length === 0" class="empty-state">
              등록된 공지사항이 없습니다.
            </div>
          </div>
        </div>

        <!-- 일정 -->
        <div class="info-card">
          <div class="info-card-header">
            <h3 class="info-card-title">다가오는 일정</h3>
            <router-link to="/event" class="view-all">전체보기</router-link>
          </div>

          <!-- 로딩 스켈레톤 -->
          <div v-if="isLoadingEvents" class="info-list">
            <div v-for="n in 4" :key="'event-skeleton-' + n" class="info-item">
              <div class="skeleton skeleton-text" style="width: 70%;"></div>
              <div class="skeleton skeleton-text" style="width: 40%; margin-top: 4px;"></div>
            </div>
          </div>

          <!-- 실제 데이터 -->
          <div v-else class="info-list">
            <div v-for="event in eventsData" :key="event.id" class="info-item event-item">
              <div class="event-main">
                <span class="event-title">{{ event.title }}</span>
                <span class="event-datetime">{{ formatPocketbaseDatetime(event.datetime) }}</span>
              </div>
              <span class="event-location">{{ event.location }}</span>
            </div>
            <div v-if="eventsData.length === 0" class="empty-state">
              예정된 일정이 없습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import pb from '@/pb'

export default {
  name: 'NewAlertsAndEvents',
  data() {
    return {
      NoticesRecords: [],
      eventsData: [],
      isLoadingNotices: true,
      isLoadingEvents: true,
    };
  },
  async mounted() {
    await Promise.all([
      this.FetchRecords(),
      this.getEvents()
    ]);
  },
  methods: {
    goPost(url) {
      window.location = url
    },
    async getEvents() {
      this.isLoadingEvents = true;
      try {
        const todayISO = new Date().toISOString();
        const records = await pb.collection("event").getList(1, 4, {
          sort: "datetime",
          filter: `datetime >= "${todayISO}"`,
          fields: "id,title,datetime,location",
          skipTotal: true,
        });
        this.eventsData = records.items;
      } catch(err) {
        console.log("[NewAlert_Events Error]", err)
        this.eventsData = [];
      } finally {
        this.isLoadingEvents = false;
      }
    },
    formatPocketbaseDatetime(datetimeStr) {
      const utcDate = new Date(datetimeStr)
      const m = utcDate.getUTCMonth() + 1
      const d = utcDate.getUTCDate()
      const hh = String(utcDate.getUTCHours()).padStart(2, '0')
      const mm = String(utcDate.getUTCMinutes()).padStart(2, '0')
      return `${m}월 ${d}일 ${hh}:${mm}`
    },
    async FetchRecords() {
      this.isLoadingNotices = true;
      try {
        const records = await pb.collection("notice").getList(1, 5, {
          sort: "-postdate",
          fields: "title,id",
          skipTotal: true,
        });
        this.NoticesRecords = records.items;
      } catch (e) {
        console.error("[FetchRecords]", e);
        this.NoticesRecords = [];
      } finally {
        this.isLoadingNotices = false;
      }
    },
  }
}
</script>

<style scoped>
.info-section {
  padding: 48px 16px;
  background: #f8f9fa;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.info-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #1a1a1a;
}

.info-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.view-all {
  font-size: 0.85rem;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.view-all:hover {
  color: #dc2626;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.notice-item {
  cursor: pointer;
  transition: background-color 0.15s;
  margin: 0 -12px;
  padding: 14px 12px;
  border-radius: 8px;
}

.notice-item:hover {
  background-color: #f8f9fa;
}

.info-item-title {
  font-size: 0.95rem;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.event-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-datetime {
  font-size: 0.8rem;
  color: #dc2626;
  font-weight: 500;
}

.event-location {
  font-size: 0.8rem;
  color: #888;
  white-space: nowrap;
  flex-shrink: 0;
}

.empty-state {
  padding: 32px 0;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
}

/* 모바일 */
@media (max-width: 768px) {
  .info-section {
    padding: 32px 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .info-card {
    padding: 20px;
    border-radius: 12px;
  }

  .info-card-title {
    font-size: 1.1rem;
  }

  .info-item-title,
  .event-title {
    font-size: 0.9rem;
  }

  .event-item {
    flex-direction: column;
    gap: 4px;
  }

  .event-location {
    font-size: 0.75rem;
  }
}
</style>
