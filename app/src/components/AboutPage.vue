<template>
<div class="aboutpage">
    <header>
        <div class="container">
            <h1>부산반빈곤센터는</h1>
            <p class="intro">
                빈곤에 처한 주민 스스로가 권리를 찾을 수 있도록 상담, 교육 등을 하는 비영리단체(NPO)입니다. IMF 이후 심화된 실업과 빈곤에 대응하던 시민사회의 흐름에 이어서 2010년 4월 1일 창립했습니다. 반(反)빈곤운동은 기존의 구호나 시혜적인 관점을 넘어서 주민 스스로 조직하고 힘을 키우는 것을 목표로 합니다. 누구나 기본적인 생활을 할 수 있어야 한다는 의미의 ‘기본생활권’을 추구하는 다양한 활동들을 하고 있습니다.
            </p>
            <div class="timeline">
                <div v-for="(event, index) in timelineEvents" :key="index" class="timeline-item">
                    <div class="timeline-event">
                        {{ event.title }}
                    </div>
                    <div class="timeline-year">{{ event.year }}</div>
                </div>
            </div>
        </div>
  
        <section id="activities">
            <div class="container">
                <div class="section-content">
                    <ul class="activities-list">
                        <li>빈곤과 차별에 관한 법, 조례 제·개정 운동</li>
                        <li>부산시민 공영장례 조문단 양성과정(연 2회) 및 활동</li>
                        <li>1인가구 주거빈곤 당사자 조직화</li>
                        <li>장애·빈민 열사, 희생자 추모사업</li>
                        <li>1017 빈곤철폐의날 부산조직위원회 구성 및 활동</li>
                        <li>격월 소식지 '쇠비름' 발간</li>
                        <li>정기 회원교육 '서로배움터'</li>
                        <li>서로배움실천팀, 사회과학세미나, 노래패 '길위에' 운영</li>
                        <li>콘서트 '달달한 품앗이'</li>
                        <li>연대활동</li>
                    </ul>
                </div>
            </div>
        </section>
</header>

    <main>
        <section id="vision" class="vision-section">
            <div class="container">
                <div class="section-header">
                    <h2>사명과 비전</h2>
                </div>
                <div class="section-content">
                    <p class="h2-text">생동감 넘치는 조직의 힘으로 빈곤과 차별의 벽을 넘는다</p>
                    <div class="vision-goals">
                        <div class="goal-card">
                            <h3>구성원이 중심이 되어 함께한다</h3>
                            <ul>
                                <li>회원이 200명이 된다.</li>
                                <li>매월 1회 회원정기모임을 통해 회원 욕구를 파악한다.</li>
                                <li>모든 회원이 사명, 비전을 이해하고 실천한다.</li>
                                <li>역할이 분명한 운영위원이 10명이 활동하고 있다.</li>
                                <li>운영위원들이 연 4회 이상 별도로 마련한 조직강화의 시간을 가진다.</li>
                            </ul>
                        </div>
                        <div class="goal-card">
                            <h3>서로 배우고 모두 성장한다</h3>
                            <ul>
                                <li>교육위원회가 주축이 되어서 월 1회 회원교육을 진행한다.</li>
                                <li>전문성 있는 팀 활동으로 조직을 강화하고 강사를 배출한다.</li>
                                <li>1인가구, 주거빈곤 당사자 조직을 촉진하고 지원한다.</li>
                            </ul>
                        </div>
                        <div class="goal-card">
                            <h3>현장에서 힘을 모으고 연결한다</h3>
                            <ul>
                                <li>공간달품이 부산의 민중의집이 된다.</li>
                                <li>연대를 도모하는 달품콘서트를 개최한다.</li>
                                <li>회원들과 함께 월 1회 이상 연대활동을 한다.</li>
                                <li>우호적인 지역자원을 발굴하여 긴밀하게 연대한다.</li>
                                <li>빈곤과 차별을 강화하는 법제도 제개정 운동을 한다.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="section-header section-header-history">
                    <h2>연혁</h2>
                </div>
                <div class="section-content">
                  <p class="h2-text">부산반빈곤센터가 걸어온 길</p>
                    <ul class="history-list">
                        <li>
                            <h3>2010년</h3>
                            <p>4월 14일 창립</p>
                            <p>11월 기초법 개정 부산공동행동 구성</p>
                        </li>
                        <li>
                            <h3>2011년~2019년</h3>
                            <p>용산참사부산추모위원회 구성, 추모사업 전개</p>
                        </li>
                        <li>
                            <h3>2011년</h3>
                            <p>4월 '알기 쉬운 기초법' 대중강연 개최</p>
                            <p>9월 거리상담 및 기초수급 탈락 피해당사자 규탄 기자회견</p>
                        </li>
                        <li>
                            <h3>2012년</h3>
                            <p>5월 '알기 쉬운 재개발과 주거권' 대중강연 개최</p>
                        </li>
                        <li>
                            <h3>2013년</h3>
                            <p>만덕5주기 주거생존권 공동대책위 구성 및 활동</p>
                        </li>
                        <li>
                            <h3>2014년</h3>
                            <p>1월 용산, 쌍용차, 밀양 연대집회</p>
                        </li>
                        <li>
                            <h3>2016년</h3>
                            <p>2월 14일 윤웅태 전 대표님 별세, 시민사회장</p>
                            <p>10월 홈리스 당사자 조직화 모임, 청년 주거빈곤 토크콘서트 개최</p>
                        </li>
                        <li>
                            <h3>2017년</h3>
                            <p>비수급 빈곤층 위기개입을 위한 기초법 네트워크</p>
                            <p>윤웅태동지정신계승사업회 창립총회</p>
                            <p>9월 공간달품 개소</p>
                            <p>10월 토크콘서트 '관계의 빈곤을 말하다'</p>
                            <p>내미는마음 조직 및 활동, 제1회 쪽방주민 합동추모식 및 작은음악회</p>
                        </li>
                        <li>
                            <h3>2018년</h3>
                            <p>사회복지사의 실천과 운동을 고민하는 간담회 개최</p>
                            <p>회원 기본교육 '지피지기 백전불패' (총 7강)</p>
                        </li>
                        <li>
                            <h3>2019년</h3>
                            <p>우리동네 은둔주민 함께살기 프로젝트 : 마음과 마음을 잇다</p>
                        </li>
                        <li>
                            <h3>2020년</h3>
                            <p>비수급 빈곤층 권리찾기 프로젝트 BEYOND</p>
                            <p>10월 특강 '빈민운동의 역사와 주민조직화'</p>
                            <p>'토지와 부동산 그리고 빈곤문제'</p>
                        </li>
                        <li>
                            <h3>2021년</h3>
                            <p>7월 사회안전망으로서의 공영장례, 부산시 조례제정을 위한 정책토론회</p>
                            <p>(12월 '부산광역시 공영장례 조례' 제정)</p>
                        </li>
                        <li>
                            <h3>2022년</h3>
                            <p>제1회 장애·빈민 명절맞이 합동추모식</p>
                            <p>6월 해방과 참여의 교육학, 파울로 프레이리 실천세미나</p>
                            <p>10월 토론회 '부산시 고독사 예방정책과 공영장례 이후 과제'</p>
                            <p>11월 복지는 권리다! 기초수급 권리찾기 상담, 교육</p>
                        </li>
                        <li>
                            <h3>2023년</h3>
                            <p>'노동자 민중을 위한 노동법' 등 서면시장번영회지회 연대강연 주최</p>
                        </li>
                        <li>
                            <h3>2024년</h3>
                            <p>1인가구 주민의 존엄한 삶과 존엄한 죽음을 위한 프로젝트 ‘보듬다’</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="container">
                <div class="section-header section-header-history">
                    <h2>오시는 길</h2>
                </div>
                <div class="section-content">
                  <p class="h2-text">공간달품으로 오는 방법</p>
                  <iframe class="googleMap" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3263.4762718378215!2d129.03428417600665!3d35.1197864606111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568eb05c94fe205%3A0x172ceb836e2a0670!2z67aA7IKw67CY67mI6rOk7IS87YSwKOqzteqwhOuLrO2SiCk!5e0!3m2!1sko!2skr!4v1752221645628!5m2!1sko!2skr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                  <p class="h2-text-small">부산광역시 동구 초량로53, 1층<br><strong>버스</strong>  22, 52, 103, 190부산고교 하차<br><strong>도시철도</strong> 1호선 초량역에서 도보 10분(부산고 버스정류장에서 초량6동주민센터 방향으로 50m)<br>* 자차 이용시 주차는 초량6동 공영주차장에 하시면 됩니다.</p>
                </div>
            </div>
        </section>
    </main>
</div>
</template>

<script setup>
import { ref } from 'vue';

const timelineEvents = ref([
  { title: '광주대단지 사건', year: '1971' },
  { title: '광주 민중항쟁', year: '1980' },
  { title: '6월항쟁 빈민운동', year: '1987' },
  { title: 'IMF 경제위기', year: '1997' }, 
  { title: '용산참사', year: '2009' }, 
]);
</script>

<style scoped>
.aboutpage {
  color: black;
  line-height: 1.7;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

header {
  padding-top: 100px;
  padding-bottom: 10px;
  text-align: left;
  /* background-color: #fcebeb; */
  border-bottom: 1px solid black;
}

header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.h2-text{
  text-align: left;
  font-size: 1.3rem;
  font-weight: 500;
}

.h2-text-small {
  text-align: left;
  font-size: 1.1rem;
  font-weight: 400;
}


.intro {
  font-size: 1.3rem;
  line-height: 180%;
  font-weight: 500;
  margin-top: 15px;
  color: black;
  max-width: 700px;
}

.timeline {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 30px;
  overflow-x: auto;
  padding: 1.5rem 1rem;
  margin: 2rem auto 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
}

.timeline-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  scroll-snap-align: start;
  flex: 0 0 auto;
  width: 160px;
  text-align: center;
}

.timeline-event {
  padding: 10px 12px;
  background-color: #333;
  border-width: 2px;
  border-style: solid;
  border-color: #333;
  color: #fff;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 12px;
  word-break: keep-all;
  line-height: 1.3;
  position: relative;
}

.timeline-event::after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 50%;
  border: 0;
  transform: translateX(-70%);
  border-width: 4px;
  border-color: #333 transparent transparent transparent;
  border-style: solid;
  border-radius: 15px;
}

.timeline-year {
  font-size: 0.9rem;
  color: #000;
  padding: 5px 30px;
}

main {
  padding-bottom: 60px;
}



section {
  padding: 60px 0;
}

.section-header {
  text-align: left;
  margin-bottom: 10px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #e2273b;
  position: relative;
  display: inline-block;
}


.section-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.activities-list,
.goal-card ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.activities-list li,
.goal-card li {
  position: relative;
  padding-left: 25px;
  margin-bottom: 10px;
  color: black;
  font-weight: 500;
  font-size: 1.2em;
}

.activities-list li::before{
  content: '▶  ';
}


.activities-list li{
  background-color: rgb(241, 241, 241);
  padding: 8px 30px;
}

.goal-card li::before {
  content: '-';
  position: absolute;
  left: 0;
  color: #e2273b;
  font-weight: bold;
}

.vision-goals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.goal-card {
  background-color: #f8f9fa;
  padding: 25px;
  border-left: 3px solid #e2273b;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.goal-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.goal-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e2273b;
  margin-top: 0;
}

.history-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  border-left: 2px solid #e2273b;
  padding-left: 20px;
  margin: 0;
}

.history-list h3 {
  font-weight: bold;
  color: #e2273b;
  font-size: 1.1rem;
  position: relative;
  margin-top: 0;
}

.history-list h3::before {
  content: '';
  position: absolute;
  left: -27px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background-color: #e2273b;
  border-radius: 50%;
}

.history-list li {
  border-bottom: 1px dashed #eee;
  padding-bottom: 15px;
  list-style: none;
}

.history-list li:last-of-type {
  border-bottom: none;
}

.history-list p {
  margin: 0;
}

/* 반응형 */
@media (max-width: 768px) {
  section {
    padding: 40px 0;
  }

  .section-header h2 {
    font-size: 1.8rem;
  }

  .vision-goals {
    grid-template-columns: 1fr;
  }
}

.vision-section {
  background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(252, 222, 222) 100%);

}

.section-header-history{
  margin-top:50px;
}

.googleMap {
  width: 100%;
}

@media (max-width: 768px) {
  .aboutpage {
    font-size: 0.95rem;
  }

  header h1 {
    font-size: 1.8rem;
    text-align: left;
  }

  .intro {
    font-size: 1.1rem;
    max-width: 100%;
  }

  .timeline {
    gap: 16px;
    padding: 1rem 0.5rem;
  }

  .timeline-item {
    width: 120px;
  }

  .timeline-event {
    font-size: 0.9rem;
    padding: 8px 10px;
  }

  .timeline-year {
    font-size: 0.75rem;
    padding: 3px 20px;
  }

  .goal-card {
    padding: 16px;
  }

  .goal-card h3 {
    font-size: 1rem;
  }

  .goal-card li {
    font-size: 0.95rem;
  }

  .activities-list li {
    font-size: 1rem;
    padding: 6px 20px;
  }

  .history-list h3 {
    font-size: 1rem;
  }

  .h2-text,
  .h2-text-small {
    font-size: 1rem;
  }

  .googleMap {
    height: 300px;
  }

  .section-content {
    gap: 24px;
  }

  .section-header h2 {
    font-size: 1.6rem;
  }

  .section-header-history {
    margin-top: 40px;
  }
}

</style>