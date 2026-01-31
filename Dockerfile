# ============================================
# Stage 1: Vue.js 빌드
# ============================================
FROM node:18-alpine AS builder

WORKDIR /build

# Vue.js 빌드 시 필요한 환경변수 (Coolify Build Arguments로 전달)
ARG VUE_APP_API_URL=https://site-api.bapc.kr
ARG VUE_APP_CDN_URL=https://cdn.bapc.kr
ARG VUE_APP_SITE_URL=https://bapc.kr

ENV VUE_APP_API_URL=$VUE_APP_API_URL
ENV VUE_APP_CDN_URL=$VUE_APP_CDN_URL
ENV VUE_APP_SITE_URL=$VUE_APP_SITE_URL

# 패키지 파일만 먼저 복사 (캐시 활용)
COPY app/package*.json ./

# 의존성 설치
RUN npm ci --only=production=false

# 소스 복사 및 빌드
COPY app/ ./
RUN npm run build

# ============================================
# Stage 2: Flask + Gunicorn 실행
# ============================================
FROM python:3.11-slim

WORKDIR /app

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Flask 앱 복사
COPY main.py .

# 빌드된 Vue 앱 복사 (builder 스테이지에서)
COPY --from=builder /build/dist ./dist

# 환경변수 기본값 (Coolify에서 오버라이드 가능)
ENV VUE_APP_API_URL=https://site-api.bapc.kr
ENV VUE_APP_CDN_URL=https://cdn.bapc.kr
ENV VUE_APP_SITE_URL=https://bapc.kr
ENV FLASK_PORT=8240
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# 포트 노출
EXPOSE 8240

# Gunicorn으로 실행 (512MB 메모리 제한 고려: worker 2개)
CMD ["gunicorn", "--bind", "0.0.0.0:8240", "--workers", "2", "--threads", "2", "--timeout", "120", "main:app"]
