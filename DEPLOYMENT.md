# Vercel 배포 가이드 🚀

## 1. GitHub 저장소 생성

1. GitHub에 새 저장소 생성
2. 로컬 프로젝트를 Git으로 초기화하고 업로드:

```bash
git init
git add .
git commit -m "Initial commit: Magic School Rule Finder"
git branch -M main
git remote add origin https://github.com/your-username/magic-school-rule-finder.git
git push -u origin main
```

## 2. Vercel 계정 생성 및 연결

1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. GitHub 저장소 선택
5. "Import" 클릭

## 3. Vercel 프로젝트 설정

### 기본 설정
- **Framework Preset**: Other
- **Root Directory**: `./` (기본값)
- **Build Command**: (비워둠 - 정적 사이트)
- **Output Directory**: `./` (기본값)

### 환경 변수 설정
1. 프로젝트 대시보드에서 "Settings" 클릭
2. "Environment Variables" 탭 선택
3. 다음 변수 추가:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Google AI Studio API 키
   - **Environment**: Production, Preview, Development 모두 선택

## 4. Google AI Studio API 키 발급

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. API 키 복사
5. Vercel 환경 변수에 입력

## 5. 배포 실행

1. Vercel에서 "Deploy" 클릭
2. 배포 완료 후 제공되는 URL로 접속
3. 애플리케이션 테스트

## 6. 도메인 설정 (선택사항)

1. Vercel 대시보드 > Settings > Domains
2. 원하는 도메인 입력
3. DNS 설정 완료

## 7. 자동 배포 설정

- GitHub에 코드를 푸시할 때마다 자동으로 재배포됩니다
- `main` 브랜치에 푸시하면 Production 환경에 배포
- 다른 브랜치에 푸시하면 Preview 환경에 배포

## 8. 환경 변수 관리

### Production 환경
- 실제 사용자들이 접근하는 환경
- 안정적인 API 키 사용

### Preview 환경  
- Pull Request나 다른 브랜치의 미리보기
- 테스트용 API 키 사용 가능

### Development 환경
- 로컬 개발 시 사용
- `vercel dev` 명령어로 로컬에서 Vercel 환경 시뮬레이션

## 9. 모니터링 및 로그

1. Vercel 대시보드 > Functions 탭에서 API 호출 로그 확인
2. Analytics 탭에서 사용자 통계 확인
3. Speed Insights로 성능 모니터링

## 10. 문제 해결

### API 키 오류
- 환경 변수가 올바르게 설정되었는지 확인
- API 키가 유효한지 확인
- 재배포 후 브라우저 캐시 클리어

### 빌드 오류
- `vercel.json` 설정 확인
- 정적 파일 경로 확인
- 콘솔 로그 확인

### 성능 문제
- 이미지 최적화
- CDN 설정 확인
- 불필요한 리소스 제거

## 11. 추가 최적화

### PWA 설정 (선택사항)
```json
// vercel.json에 추가
{
  "headers": [
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ]
}
```

### 캐싱 설정
```json
// vercel.json에 추가
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 12. 백업 및 복구

- GitHub에 모든 코드가 저장되므로 코드 백업 불필요
- 환경 변수는 별도로 백업 필요
- Vercel 대시보드에서 프로젝트 설정 백업 가능

---

배포 완료 후 애플리케이션이 정상적으로 작동하는지 확인해주세요! 🎉

