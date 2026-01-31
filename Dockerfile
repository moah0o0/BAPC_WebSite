# ============================================
# Stage 1: Vue.js 빌드
# ============================================
FROM node:18-alpine AS builder

WORKDIR /build

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

# 시스템 의존성 최소화
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Flask 앱 복사
COPY main.py .

# 빌드된 Vue 앱 복사 (builder 스테이지에서)
COPY --from=builder /build/dist ./dist

# 환경변수
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# 포트 노출
EXPOSE 8240

# Gunicorn으로 실행 (512MB 메모리 제한 고려: worker 2개)
CMD ["gunicorn", "--bind", "0.0.0.0:8240", "--workers", "2", "--threads", "2", "--timeout", "120", "main:app"]
