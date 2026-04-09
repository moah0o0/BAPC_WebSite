// 중앙 설정 파일 - .env에서 읽어옴
const config = {
  API_URL: process.env.VUE_APP_API_URL || "https://site-api.bapc.kr",
  CDN_URL: process.env.VUE_APP_CDN_URL || "https://cdn.bapc.kr",
  SITE_URL: process.env.VUE_APP_SITE_URL || "https://bapc.kr",
};

// API 파일 URL을 CDN URL로 변환하는 유틸리티 함수
export function toCdnUrl(rawUrl) {
  if (!rawUrl) return rawUrl;
  return rawUrl.replace(/^https?:\/\/[^/]+\/api\/files/, config.CDN_URL);
}

export default config;
