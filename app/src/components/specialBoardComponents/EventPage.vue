<template>
  <div class="calendar-wrapper">
    <!-- 로딩 스켈레톤 -->
    <div v-if="isLoading" class="calendar-loading">
      <div class="loading-spinner"></div>
      <p>일정을 불러오는 중...</p>
    </div>

    <div class="calendar" :class="{ 'is-loading': isLoading }">
      <div class="calendar-header">
        <button @click="prevMonth" class="nav-button" aria-label="이전 달">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div class="calendar-title-group">
          <div class="calendar-title">{{ year }}.{{ month < 10 ? '0' + month : month }}.</div>
          <div class="calendar-subtitle">부산반빈곤센터 일정</div>
        </div>
        <button @click="nextMonth" class="nav-button" aria-label="다음 달">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        <button @click="goToToday" class="go-to-button go-to-today">오늘</button>
      </div>
      <div class="calendar-content-area">
        <div class="calendar-weekdays">
          <div class="weekday sunday">일</div>
          <div class="weekday">월</div>
          <div class="weekday">화</div>
          <div class="weekday">수</div>
          <div class="weekday">목</div>
          <div class="weekday">금</div>
          <div class="weekday saturday">토</div>
        </div>

        <div class="calendar-days">
          <div
            v-for="day in calendarDays"
            :key="day.dateKey"
            :class="['day-cell',
                     { 'is-current-month': day.isCurrentMonth },
                     { 'is-today': day.isToday },
                     { 'is-sunday': day.isSunday },
                     { 'is-saturday': day.isSaturday },
                     { 'has-events': day.events.length > 0 }
                    ]"
          >
            <div class="date-and-weekday">
              <div class="date-number">
                <span class="month-part">{{ day.month < 10 ? '0' + day.month : day.month }}.</span>
                <span class="day-part">{{ day.date < 10 ? '0' + day.date : day.date }}</span>
              </div>
              <div class="weekday-mobile">{{ day.weekdayShort }}</div>
            </div>
            
            <div class="events-container">
              <div 
                v-for="(event) in day.events" 
                :key="event.id" 
                class="event-item"
                @click="eventOpen(event.id)"
              >
                <span v-if="event.time" class="event-time">{{ event.time }}</span>
                <span class="event-content">{{ event.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </div>


<!-- 커스텀 모달 -->
<div v-if="isOpen" class="center-modal-backdrop">
  <div class="center-modal">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="mb-3 md-modal">
          <div class="event-top-bar">
            <button type="button" class="icon btn-close" @click="eventClose()"></button>
          </div>

        </div>

        
        <div class="mb-3 md-modal">
            <label class="modal-label title-header" v-if="!isEdit">
              {{ targetEventTitle }}
            </label>
            <textarea class="modal-label title-header" v-model="targetEventTitle" v-else placeholder="일정명을 입력하세요" @keydown.enter.prevent></textarea>
        </div>

        <!-- 작성일자 -->
        <div class="mb-3 md-modal">
          <label v-if="!isEdit" class="modal-label date-header">
            {{ formatPocketbaseDatetime(targetEventDatetime) }}
          </label>
          <flat-pickr
            v-else
            v-model="targetEventDatetime"
            :config="config"
            class="styled-datepicker date-header"
          />
        </div>

        <div class="mb-3 md-modal">
          <label class="modal-label location-header" v-if="!isEdit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg> {{ targetEventLocation }}      
            </label>
            <textarea class="modal-label location-header" v-else placeholder="일정장소를 입력하세요" v-model="targetEventLocation" @keydown.enter.prevent></textarea>

        </div>
        
        <div class="mb-3 md-modal">
          <div class="event-bottom-bar" v-if="isAdmin">
            <div class="left">
                <svg v-if="targetEventId" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon bi bi-trash3" viewBox="0 0 16 16" @click="deleteEvent(targetEventId)">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
              </svg>
            </div>
            <div class="right">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon bi bi-pencil-square" viewBox="0 0 16 16" @click="eventEditStart()" v-if="!isEdit">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon bi bi-check-circle" viewBox="0 0 16 16" @click="eventEditFinish()" v-else>
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
              </svg>
            </div>
          </div>
          </div>

        <!-- 모달 하단 버튼 -->
      </div>
    </div>
  </div>
</div>

<div class="add-button-section" v-if="isAdmin">
  <button class="btn btn-danger" @click="eventOpen(null)">+ 추가하기</button>
</div>

</template>

<script>
import pb from '@/pb'
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css"; // 기본 스타일
import { Korean } from "flatpickr/dist/l10n/ko.js"; // 한국어 설정



export default {
  components: { flatPickr },
  data() {
    const today = new Date();
    return {
      config: {
        dateFormat: "Y-m-d H:i",
        enableTime: true,
        time_24hr: true,
        locale: Korean,
      },
      isAdmin: false,
      isOpen: false,
      isLoading: true,
      targetEventTitle: null,
      targetEventDatetime: null,
      targetEventLocation: null,
      targetEventId: null,
      isEdit: false,
      currentDay: today.getDate(),
      currentMonth: today.getMonth() + 1,
      currentYear: today.getFullYear(),
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      eventsData: {},
    };
  },
  async mounted() {
    await this.getEvents();
    const authStore = pb.authStore;

    if (authStore.isValid) {
      try {
        const user = await pb.collection('users').getOne(authStore.model.id);
        if (user.is_admin === true) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      } catch (err) {
        console.error("[Auth Error]", err);
      }
    }
  },
  computed: {
    calendarDays() {
      const days = [];
      const year = this.year;
      const month = this.month;
      const firstDay = this.getFirstDayWeekday(year, month);
      const lastDate = this.getLastDate(year, month);
      const prevLastDate = this.getLastDate(year, month - 1);
      const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'];

      for (let i = 0; i < 42; i++) {
        let date,
          isCurrentMonth = true;
        let displayMonth = month;
        let displayYear = year;

        if (i < firstDay) {
          date = prevLastDate - (firstDay - 1) + i;
          isCurrentMonth = false;
          displayMonth = month - 1;
          if (displayMonth === 0) {
            displayMonth = 12;
            displayYear -= 1;
          }
        } else if (i >= firstDay + lastDate) {
          date = i - (firstDay + lastDate) + 1;
          isCurrentMonth = false;
          displayMonth = month + 1;
          if (displayMonth === 13) {
            displayMonth = 1;
            displayYear += 1;
          }
        } else {
          date = i - firstDay + 1;
        }

        const YYYY = displayYear.toString();
        const MM = displayMonth.toString().padStart(2, '0');
        const DD = date.toString().padStart(2, '0');
        const dateKey = `${YYYY}-${MM}-${DD}`;
        const weekday = i % 7;

        days.push({
          date,
          month: displayMonth,
          year: displayYear,
          isCurrentMonth,
          dateKey,
          isSunday: weekday === 0,
          isSaturday: weekday === 6,
          isToday:
            isCurrentMonth &&
            date === this.currentDay &&
            month === this.currentMonth &&
            year === this.currentYear,
          events: this.eventsData[dateKey] || [],
          weekdayShort: weekdayNames[weekday],
        });
      }

      return days;
    },
  },
  methods: {
    // toUTCDate 함수는 로컬 시간대 기준으로 작업하므로 더 이상 필요 없습니다.
    // formatPocketbaseDatetime 함수를 Date 객체를 받아 KST로 포맷하도록 수정
    formatPocketbaseDatetime(datetimeObj) {

      const typeString = Object.prototype.toString.call(datetimeObj);

      if (typeString !== '[object Date]') {
        datetimeObj = new Date(datetimeObj)
      } 

    
      if (!datetimeObj) return "";
      const year = datetimeObj.getFullYear();
      const month = String(datetimeObj.getMonth() + 1).padStart(2, '0');
      const day = String(datetimeObj.getDate()).padStart(2, '0');
      const hours = String(datetimeObj.getHours()).padStart(2, '0');
      const minutes = String(datetimeObj.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    // PocketBase에서 가져온 UTC 이벤트를 KST 기준으로 변환하여 저장
    convertEvents(rawEvents) {
      const result = {};

      rawEvents.forEach((item) => {
        // PocketBase의 UTC 문자열을 Date 객체로 파싱하면 로컬 시간으로 자동 변환됩니다.
        const localDate = new Date(item.datetime);

        const y = localDate.getFullYear();
        const m = String(localDate.getMonth() + 1).padStart(2, '0');
        const d = String(localDate.getDate()).padStart(2, '0');
        const dateKey = `${y}-${m}-${d}`;

        // 로컬 시간을 가져와서 표시
        const timeStr = `${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;

        if (!result[dateKey]) {
          result[dateKey] = [];
        }

        // 각 이벤트 객체에 원래 datetime Date 객체도 함께 저장하여 정렬에 사용
        result[dateKey].push({
          id: item.id,
          time: timeStr,
          content: item.title,
          // 정렬을 위해 원본 Date 객체를 추가로 저장 (또는 item.datetime 문자열도 가능)
          originalDatetime: localDate 
        });
      });

      // 각 날짜(dateKey)별로 이벤트들을 시간 순으로 정렬합니다.
      for (const dateKey of Object.keys(result)) {
        result[dateKey].sort((a, b) => {
          // originalDatetime을 기준으로 오름차순 정렬 (이른 시간 -> 늦은 시간)
          return a.originalDatetime.getTime() - b.originalDatetime.getTime();
        });
      }

      return result;
    },

    async getEvents() {
      this.isLoading = true;
      try {
        const eventRecords = await pb.collection("event").getList(1, 200, {
          sort: "-datetime",
          skipTotal: true,
        });
        this.eventsData = this.convertEvents(eventRecords.items);
      } catch (err) {
        console.error("[EventPage Error]", err);
        this.eventsData = {};
      } finally {
        this.isLoading = false;
      }
    },

    getFirstDayWeekday(year, month) {
      return new Date(year, month - 1, 1).getDay();
    },
    getLastDate(year, month) {
      return new Date(year, month, 0).getDate();
    },
    prevMonth() {
      if (this.month === 1) {
        this.month = 12;
        this.year--;
      } else {
        this.month--;
      }
    },
    nextMonth() {
      if (this.month === 12) {
        this.month = 1;
        this.year++;
      } else {
        this.month++;
      }
    },
    goToToday() {
      this.year = this.currentYear;
      this.month = this.currentMonth;
    },

    async eventOpen(eventId) {
      if (eventId == null) {
        // 새 이벤트 생성 시 현재 로컬 시간을 기본값으로 설정
        this.targetEventId = null;
        this.targetEventTitle = "";
        this.targetEventDatetime = new Date();
        this.targetEventLocation = "";
        this.eventEditStart(); // 새 이벤트는 바로 편집 모드로 시작
      } else {
        // 기존 이벤트 조회 시 PocketBase의 UTC 시간을 로컬 시간으로 자동 파싱하여 할당
        const originalRecord = await pb.collection("event").getOne(eventId);
        this.targetEventId = eventId; // ID 설정
        this.targetEventTitle = originalRecord.title;
        this.targetEventDatetime = new Date(originalRecord.datetime);
        this.targetEventLocation = originalRecord.location;
        this.isEdit = false; // 기존 이벤트는 보기 모드로 시작
      }
      this.isOpen = true;
    },

    eventEditStart() {
      this.isEdit = true;
      // 편집 모드 시작 시 textarea에 자동으로 포커스 (필요 시)
      this.$nextTick(() => {
        if (this.$refs.editTitle) {
          this.$refs.editTitle.focus();
        }
      });
    },

    async eventEditFinish() {
      // 제목 textarea의 값을 가져옴
      const title = this.targetEventTitle.trim(); 
      const location = this.targetEventLocation.trim(); 
      this.targetEventDatetime = new Date(this.targetEventDatetime)
      console.log("eventFinish", this.targetEventDatetime)
      
      const datetime = this.targetEventDatetime; // flat-pickr에서 KST Date 객체로 받아옴
      
      if (!title || !location || !datetime) {
        alert("제목, 장소, 날짜는 필수 입력 항목입니다.");
        return;
      }

      try {
        const recordData = {
          title: title,
          // KST Date 객체를 toISOString()으로 변환하면 PocketBase에 저장될 UTC 문자열이 됩니다.
          datetime: datetime.toISOString(), 
          location: location,
        };

        if (this.targetEventId) {
          await pb.collection('event').update(this.targetEventId, recordData);
        } else {
          const newRecord = await pb.collection('event').create(recordData);
          this.targetEventId = newRecord.id; // 새로 생성된 ID 저장
        }

        this.isEdit = false; // 편집 모드 종료
        await this.getEvents(); // 변경된 데이터로 캘린더 새로고침
      } catch (err) {
        console.error("[일정 저장/수정 오류]", err);
        alert("일정 저장에 실패했습니다. 개발자에게 문의해주십시오.");
      }
    },

    async eventClose() {
      this.isEdit = false;
      this.isOpen = false;
      await this.getEvents(); // 혹시 모를 변경사항을 위해 캘린더 데이터 새로고침
    },

    async deleteEvent(eventId) {
      if (!confirm("정말로 이 일정을 삭제하시겠습니까?")) {
        return;
      }
      try {
        await pb.collection('event').delete(eventId);
        await this.getEvents(); // 삭제된 데이터로 캘린더 새로고침
        this.eventClose(); // 모달 닫기
      } catch (err) {
        console.error("[일정 삭제 오류]", err);
        alert("일정 삭제에 실패했습니다. 관리자에게 문의하세요.");
      }
    },
  },
};
</script>


<style scoped>
/* 로딩 상태 */
.calendar-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 100;
  border-radius: var(--radius-lg);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.calendar-loading p {
  margin-top: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.calendar.is-loading {
  opacity: 0.5;
  pointer-events: none;
}

.add-button-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-10);
}

.add-button-section .btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: 600;
}

.event-top-bar {
  display: inline-flex;
  width: 100%;
  margin-bottom: var(--space-4);
}

.event-bottom-bar {
  display: inline-flex;
  width: 100%;
  margin-top: var(--space-4);
}

.event-bottom-bar .left {
  flex: 1;
}

.event-bottom-bar .right {
  flex: 2;
  display: flex;
  justify-content: right;
}

.event-top-bar .icon,
.event-bottom-bar .icon {
  color: var(--color-gray-800);
  cursor: pointer;
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-top-bar .icon:hover,
.event-bottom-bar .icon:hover {
  transition: var(--transition-fast);
  color: var(--color-primary);
}

.md-modal {
  margin-bottom: 0 !important;
}

.event-bar {
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-3);
}

.center-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-modal {
  background: white;
  border-radius: var(--radius-xl);
  width: 320px;
  padding: var(--space-6);
  box-shadow: var(--shadow-xl);
  z-index: 1060;
}

.modal-dialog {
  margin: 0;
}

.modal-content {
  border: none;
  padding: 0;
}

.styled-datepicker {
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  width: 100%;
}

.styled-datepicker:focus {
  outline: none;
  box-shadow: none;
}

textarea.modal-label {
  all: unset;
  resize: none;
  overflow: hidden;
  width: 100%;
  height: 1.3em;
  padding-bottom: var(--space-3);
}

textarea.modal-label.title-header,
.title-header {
  font-weight: 700;
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-3);
  color: var(--color-gray-900);
}

.styled-datepicker,
textarea.modal-label.date-header,
.date-header {
  font-weight: 600;
  font-size: var(--font-size-base);
  margin-bottom: var(--space-4);
  color: var(--color-gray-600);
  padding: 0;
}

textarea.modal-label.location-header,
.location-header {
  font-weight: 500;
  font-size: var(--font-size-base);
  margin-bottom: var(--space-2);
  color: var(--color-gray-600);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* 캘린더 래퍼 */
.calendar-wrapper {
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  width: 100%;
  max-width: 1200px;
  margin: var(--space-10) auto;
  padding: var(--space-8);
  background-color: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  box-sizing: border-box;
  border: 1px solid var(--color-gray-200);
}

/* 캘린더 컴포넌트 자체 스타일 */
.calendar {
  width: 100%;
}

/* 헤더 */
.calendar-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-8);
  padding: 0 var(--space-3);
  position: relative;
  gap: var(--space-3);
}

/* 타이틀과 부제를 묶는 그룹 */
.calendar-title-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  order: 1;
}

.calendar-title {
  font-weight: 700;
  font-size: var(--font-size-3xl);
  color: var(--color-gray-900);
  text-align: center;
  line-height: 1.2;
}

/* 부제 스타일 */
.calendar-subtitle {
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--color-gray-500);
  text-align: center;
  margin-top: var(--space-1);
  line-height: 1.2;
}

.nav-button {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  width: 44px;
  height: 44px;
  color: var(--color-gray-600);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  z-index: 10;
}

.nav-button:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* 이전 달 버튼과 다음 달 버튼의 순서 */
.calendar-header button:first-child {
  order: 0;
}
.calendar-header button:nth-child(3) {
  order: 2;
}
.calendar-header .go-to-button + .nav-button {
  order: 4;
}

/* '오늘' 버튼 스타일 */
.go-to-button {
  background-color: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  z-index: 9;
  display: none;
}

.go-to-button:hover {
  background-color: var(--color-primary-dark);
}

/* 요일 */
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-gray-200);
  color: var(--color-gray-600);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.weekday {
  padding: var(--space-2) 0;
  font-size: var(--font-size-sm);
}

.sunday {
  color: var(--color-primary);
}

.saturday {
  color: #2196f3;
}

/* 날짜 그리드 */
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(120px, auto);
  gap: var(--space-2);
  padding-top: var(--space-3);
}

.day-cell {
  border: 1px solid var(--color-gray-100);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  background: white;
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-sm);
  min-height: 120px;
  overflow: hidden;
  transition: all var(--transition-fast);
  cursor: default;
}

.day-cell.is-current-month {
  background: white;
  color: var(--color-gray-900);
}

.day-cell.is-current-month:hover {
  background-color: var(--color-gray-50);
  box-shadow: var(--shadow-sm);
  border-color: var(--color-gray-200);
}

.day-cell:not(.is-current-month) {
  color: var(--color-gray-400);
  background: var(--color-gray-50);
  opacity: 0.7;
}

.day-cell.is-today {
  background-color: var(--color-primary-light);
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-sm);
}
.day-cell.is-today .date-number {
  color: var(--color-primary);
}

/* 날짜와 요일 감싸는 컨테이너 (모바일에서 사용) */
.date-and-weekday {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: var(--space-2);
}

.date-number {
  font-weight: 700;
  user-select: none;
  font-size: var(--font-size-lg);
  text-align: right;
  padding-right: var(--space-1);
  pointer-events: none;
}

.date-number .month-part {
  display: none;
}

.date-number .day-part {
  display: inline;
}

.day-cell.is-sunday .date-number {
  color: var(--color-primary);
}
.day-cell.is-saturday .date-number {
  color: #2196f3;
}

.weekday-mobile {
  display: none;
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  text-align: right;
  padding-right: var(--space-1);
  pointer-events: none;
}
.day-cell.is-today .weekday-mobile {
  color: var(--color-primary);
}
.day-cell.is-sunday .weekday-mobile {
  color: var(--color-primary);
}
.day-cell.is-saturday .weekday-mobile {
  color: #2196f3;
}

.events-container {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300) transparent;
}

.events-container::-webkit-scrollbar {
  width: 4px;
}

.events-container::-webkit-scrollbar-track {
  background: transparent;
}

.events-container::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-300);
  border-radius: 2px;
}

.event-item {
  background-color: var(--color-primary-light);
  margin-bottom: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  white-space: normal;
  word-break: break-word;
  font-size: var(--font-size-sm);
  line-height: 1.4;
  color: var(--color-primary-dark);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  pointer-events: auto;
  display: flex;
  align-items: baseline;
  transition: all var(--transition-fast);
}

.event-item:hover {
  background-color: #fecaca;
}

.event-item:last-child {
  margin-bottom: 0;
}

.event-time {
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-gray-500);
  margin-right: var(--space-2);
  flex-shrink: 0;
}

.event-content {
  flex-grow: 1;
}


/* 반응형 디자인 */
@media (max-width: 1000px) {
  .calendar-wrapper {
    padding: 25px;
  }
  .calendar-title {
    font-size: 2rem;
  }
  .calendar-subtitle {
    font-size: 1rem;
  }
  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }
  .weekday {
    font-size: 1.05rem;
  }
  .calendar-days {
    grid-auto-rows: minmax(120px, auto);
    gap: 8px;
  }
  .day-cell {
    min-height: 120px;
    padding: 8px 10px;
  }
  .date-number {
    font-size: 1.1rem;
  }
  .event-item {
    font-size: 0.85rem;
    padding: 4px 8px;
  }
  .event-time {
    font-size: 0.75rem;
    margin-right: 5px;
  }
}

@media (max-width: 1000px) {
  .calendar-wrapper {
    margin: 20px auto;
    padding: 15px;
    border-radius: 8px;
  }

  .calendar-header {
    margin-bottom: 15px;
    flex-wrap: wrap; 
    justify-content: center; 
    gap: 10px; 
  }

  .calendar-title-group {
    order: -1; /* 가장 위로 올림 */
    width: 100%; /* 너비 100% */
  }

  .calendar-title {
    font-size: 1.8rem;
    min-width: unset;
    /* width: 100%; */ /* calendar-title-group에서 처리 */
    /* text-align: center; */ /* calendar-title-group에서 처리 */
  }
  .calendar-subtitle {
    font-size: 0.9rem;
    margin-top: 3px;
  }

  .nav-button {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    z-index: 10; 
  }

  .calendar-weekdays {
    padding: 12px 0;
    font-size: 0.95rem;
  }

  .day-cell {
    min-height: 95px;
    padding: 8px;
  }

  .date-number {
    font-size: 1rem;
  }

  .event-item {
    font-size: 0.8rem;
    padding: 3px 6px;
    margin-bottom: 3px;
  }
  .event-time {
    font-size: 0.7rem;
    margin-right: 4px;
  }

  .events-container {
    overflow-y: auto;
  }

  /* 768px 이하에서는 '오늘' 버튼을 표시하고, flex 흐름을 따르도록 합니다. */
  .go-to-today {
    display: block; 
    position: static; /* 절대 위치 해제 */
    transform: none; /* 변형 해제 */
    margin-left: auto; /* nav-button 옆 오른쪽으로 밀기 */
    order: 3; /* nav-button 다음에 위치 */
  }
}

/* --- 모바일 목록형 레이아웃 시작 --- */
/* 기준점: 480px 이하 */
@media (max-width: 1000px) {
  .calendar-wrapper {
    margin: 0;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }

  .calendar {
    width: 100%;
  }

  /* 캘린더 헤더 (상단 고정) */
  .calendar-header {
    position: fixed; /* 상단 고정 */
    top: 130px; /* 전역 navbar의 높이만큼 아래로 내립니다. */
    left: 0;
    right: 0;
    z-index: 100; /* 다른 콘텐츠 위에 표시 */
    background-color: #fff; /* 배경색으로 내용이 비치지 않게 */
    box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* 그림자로 구분 */
    padding: 10px; /* 상하 패딩 추가. 이 패딩으로 헤더 높이가 결정됩니다. */
    margin-bottom: 0; /* 고정되었으니 하단 마진 제거 */
    
    gap: 5px;
    flex-wrap: nowrap; 
    justify-content: space-between; 
  }

  .calendar-title-group {
    order: 1; /* nav 버튼 사이로 이동 */
    width: auto; /* 내용에 맞춰 너비 조정 */
    flex-grow: 1; /* 남은 공간 차지 */
    justify-content: center; /* 내부 콘텐츠 가운데 정렬 */
  }
  
  .calendar-title {
    font-size: 1.6rem;
    /* width: auto; */ /* calendar-title-group에서 처리 */
    /* order: 1; */ /* calendar-title-group에서 처리 */
    /* flex-grow: 1; */ /* calendar-title-group에서 처리 */
    /* text-align: center; */ /* calendar-title-group에서 처리 */
  }
  .calendar-subtitle {
    font-size: 0.8rem;
    margin-top: 0px; /* 간격 더 줄임 */
  }

  .nav-button {
    width: 38px;
    height: 38px;
    font-size: 1.2rem;
  }
  
  /* 이전 달 버튼과 다음 달 버튼 순서 재조정 */
  .calendar-header button:first-child { 
    order: 0;
  }
  .calendar-header button:nth-child(3) { /* nextMonth 버튼 */
    order: 2;
  }
  /* '오늘' 버튼이 나타났을 때의 nextMonth 버튼 순서 조정 */
  .calendar-header .go-to-button + .nav-button {
      order: 4; /* go-to-button 다음으로 오도록 */
  }

  /* 캘린더 내용 영역 (요일 및 날짜 그리드) */
  .calendar-content-area {
    padding-top: 65px; /* 고정된 캘린더 헤더의 높이만큼 상단 여백을 줍니다. */
    overflow-y: auto; /* 이 영역에서 내용이 넘칠 때 스크롤 가능하게 합니다. */
    height: calc(100vh - 130px - 65px); /* (100vh - 전역 navbar 높이 - 캘린더 헤더 높이) */
    -webkit-overflow-scrolling: touch; /* iOS에서 부드러운 스크롤 */
  }

  .calendar-weekdays {
    display: none; 
  }

  .calendar-days {
    display: block; 
    gap: 0;
    padding-top: 0;
  }

  .day-cell {
    display: flex; 
    flex-direction: row;
    align-items: flex-start;
    min-height: auto;
    padding: 15px 10px; /* 일정이 있는 날과 없는 날 모두 동일하게 적용 */
    border: none;
    border-bottom: 1px solid #f0f0f0; 
    border-radius: 0;
    background: #fff;
    font-size: 1rem;
    opacity: 1;
  }

  .day-cell.is-current-month {
    color: black;
    background: #fff;
  }
  .day-cell.is-current-month:hover {
    background-color: #fff;
    box-shadow: none;
    border-color: #f0f0f0;
  }
  .day-cell:not(.is-current-month) {
    color: black; 
    background: #fff;
    opacity: 1;
  }
  
  .day-cell.is-today {
    background-color: #ffebee; 
    border-top: 1px solid #d32f2f; 
    border-bottom: 1px solid #d32f2f; 
    box-shadow: none;
  }
  .day-cell.is-today .date-number {
    color: #d32f2f; 
  }
  .day-cell.is-today .weekday-mobile {
    color: #d32f2f; 
  }

  /* 날짜와 요일을 감싸는 컨테이너 (모바일에서 flex-direction: column) */
  .date-and-weekday {
    flex-shrink: 0; 
    width: 45px; /* 월 포함 시 너비 조정 */
    display: flex;
    flex-direction: row; 
    align-items: baseline; 
    margin-right: 50px; 
    margin-bottom: 0; 
    padding-right: 0;
  }

  .date-number {
    font-size: 1.4rem; /* 일정이 있든 없든 동일한 크기 */
    text-align: left; 
    padding-right: 0;
    margin-bottom: 2px; 
  }
  /* 모바일 뷰에서 월 부분을 표시합니다. */
  .date-number .month-part {
    display: inline; 
  }
  /* 모바일 뷰에서 일 부분은 항상 표시됩니다. (명시적으로 유지) */
  .date-number .day-part {
    display: inline;
  }

  .day-cell.is-sunday .date-number {
    color: #d32f2f; 
  }
  .day-cell.is-saturday .date-number {
    color: #2196f3;
  }

  .weekday-mobile {
    display: block; 
    font-size: 0.85rem; /* 일정이 있든 없든 동일한 크기 */
    color: #888;
    text-align: left; 
    padding-right: 0;
    line-height: 1.2;
  }
  .day-cell.is-sunday .weekday-mobile {
    color: #d32f2f; 
  }
  .day-cell.is-saturday .weekday-mobile {
    color: #2196f3;
  }

  .events-container {
    flex-grow: 1;
    overflow-y: visible;
    padding-right: 0;
    scrollbar-width: none;
  }
  .events-container::-webkit-scrollbar {
    display: none;
  }

  .event-item {
    background-color: #ffcdd2; 
    margin-bottom: 8px;
    padding: 8px 12px;
    line-height: 1.5;
  }
  .event-time {
    font-size: 0.75rem;
    margin-right: 6px;
  }

  .event-item:last-child {
    margin-bottom: 0;
  }

  /* 이벤트가 없는 날짜 셀 처리 */
  .day-cell:not(.has-events) .events-container {
    display: none; 
  }
  /* 이벤트가 없는 날짜 셀의 레이아웃 조정 (글자 크기와 패딩은 일정이 있는 날과 동일하게 유지) */
  .day-cell:not(.has-events) {
    align-items: center; 
    /* padding: 10px; <- 이 줄을 제거하여 .day-cell의 기본 padding: 15px 10px;을 따릅니다. */
  }
  .day-cell:not(.has-events) .date-and-weekday {
    width: auto;
    margin-right: 0;
    flex-direction: row;
    align-items: baseline;
  }
  /* 일정이 없는 날짜 셀의 글자 크기 오버라이드 제거 */
  /* .day-cell:not(.has-events) .date-number {
    font-size: 1.2rem;
    margin-bottom: 0;
  } */
  /* .day-cell:not(.has-events) .weekday-mobile {
    font-size: 0.75rem;
    margin-left: 5px;
    line-height: 1;
  } */
  /* 모바일에서 '오늘' 버튼 위치 조정 */
  .go-to-today {
    order: 3; 
  }
}
/* --- 모바일 목록형 레이아웃 끝 --- */
</style>