<template>
  <div class="d-flex justify-content-center align-items-center" style="height: 80vh;">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Logging out...</span>
    </div>
  </div>
</template>

<script>
import pb from '@/pb'

export default {
  name: 'LogoutPage',
  async mounted() {
    // 로그아웃 처리
    pb.authStore.clear();

    // 로그아웃 후 리다이렉트 (원하는 페이지로)
    this.$router.replace({ name: 'UserLogin' });
  },
};
</script>
