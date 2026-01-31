<template>
  <section class="together-section">
    <div class="container">
      <div class="together-content">
        <h2 class="together-title">함께하면 꿈꾸면</h2>
        <span class="together-title-highlight">변화는 가능합니다.</span>
        <p class="together-text">
          작은 행동들이 모여 큰 변화를 일으킵니다. 일상에서 할 수 있는 실천들도 많이 있습니다.
          참여와 연대는 반빈곤운동이 꽃피게 하는 밑거름이 될 것입니다.
          <span class="highlight">빈곤과 차별없는 세상</span>을 향해 함께 나아갑시다.
        </p>

        <div class="action-buttons">
          <a class="action-btn" style="cursor: pointer;" @click.prevent="handleMembership">
            <span>회원가입</span>
            <span class="btn-subtitle">여기를 클릭하시면 신청서로 이동합니다.</span>
          </a>
          <a class="action-btn" style="cursor: pointer;" @click="copyAccountNumber()">
            <span>후원계좌</span>
            <span class="btn-subtitle">부산은행 101-2043-6389-04 (부산반빈곤센터)</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TogetherSection',
  methods: {
    handleMembership() {
      window.open('https://db.blueweb.co.kr/formmail/Newformmail.html?dataname=bapc171', '_blank');
    },
    async copyAccountNumber() {
      const accountInfo = "부산은행 101-2043-6389-04 (부산반빈곤센터)";
      try {
        await navigator.clipboard.writeText(accountInfo);
        alert("계좌번호가 클립보드에 복사되었습니다.");
      } catch {
        // fallback for older browsers
        const tempInput = document.createElement("input");
        tempInput.value = accountInfo;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("계좌번호가 클립보드에 복사되었습니다.");
      }
    }
  }
}
</script>

<style scoped>
/* 공통 설정 */
.container {
  max-width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 0 auto;
}

/* 배경 및 색상 */
.together-section {
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.384)),
    url('@/assets/AKR20250102127200051_03_i_P4.jpg');
  background-size: cover;
  background-position: center;
  padding: 100px 0;
  color: white;
}

.together-content {
  max-width: 800px;
  margin: 0 auto;
}

/* 타이틀 */
.together-title,
.together-title-highlight {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: -1px;
  margin-bottom: 10px;
}

.together-title-highlight {
  background-color: #dc3545;
  padding: 4px 8px;
  display: inline-block;
  border-radius: 4px;
}

/* 본문 텍스트 */
.together-text {
  font-size: 1.25rem;
  line-height: 1.8;
  font-weight: 500;
  margin-top: 30px;
  letter-spacing: -0.5px;
}

.together-text .highlight {
  background-color: #f840525e;
  padding: 2px 4px;
  border-radius: 2px;
}

/* 버튼 영역 */
.action-buttons {
  margin-top: 40px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px 20px;
  margin-bottom: 15px;
  background-color: #000000a3;
  border-radius: 6px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
}

.action-btn:hover {
  background-color: #dc3545;
  transform: translateX(5px);
}

/* 서브텍스트 */
.btn-subtitle {
  font-size: 0.9rem;
  margin-top: 5px;
  opacity: 0.9;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .together-section {
    padding: 60px 15px;
  }

  .together-title,
  .together-title-highlight {
    font-size: 1.7rem;
  }

  .together-text {
    font-size: 1rem;
    line-height: 1.6;
  }

  .action-btn {
    font-size: 0.95rem;
    padding: 12px 16px;
  }

  .btn-subtitle {
    font-size: 0.85rem;
  }
}
</style>
