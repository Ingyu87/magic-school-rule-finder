# 마법 학교 - 규칙찾기와 식만들기 🧙‍♀️

초등학생을 위한 수학 규칙 찾기 교육 게임입니다. 마법 학교 테마로 재미있게 수학을 배울 수 있어요!

## 🎮 게임 소개

### 세 가지 마법 수업
1. **마법 주문 완성하기** - 숫자 배열의 규칙 찾기
2. **마법진 그리기** - 도형과 패턴의 규칙 찾기  
3. **균형의 물약 만들기** - 저울을 이용한 식 만들기

### 주요 기능
- 🎯 5문제씩 구성된 다양한 난이도의 문제
- 🎨 AI가 생성하는 개인화된 마법사 캐릭터
- 📊 상세한 학습 결과 분석 및 피드백
- 📄 PDF 결과 보고서 다운로드
- 🔄 유사 문제 풀어보기 기능

## 🚀 배포 방법

### Vercel로 배포하기

1. **GitHub에 코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/magic-school-rule-finder.git
   git push -u origin main
   ```

2. **Vercel에서 배포**
   - [Vercel](https://vercel.com)에 접속
   - GitHub 계정으로 로그인
   - "New Project" 클릭
   - GitHub 저장소 선택
   - "Deploy" 클릭

3. **API 키 설정**
   - Vercel 대시보드에서 프로젝트 선택
   - Settings > Environment Variables
   - `GEMINI_API_KEY` 추가 (Google AI Studio에서 발급)

## ⚙️ 로컬 개발 환경 설정

### 필요 조건
- Python 3.x (로컬 서버용)
- Google AI Studio API 키

### 설치 및 실행
```bash
# 저장소 클론
git clone https://github.com/your-username/magic-school-rule-finder.git
cd magic-school-rule-finder

# API 키 설정
# script.js 파일에서 GEMINI_API_KEY 변수에 API 키 입력

# 로컬 서버 실행
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

## 🔑 API 키 발급 방법

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. "Create API Key" 클릭
3. API 키 복사
4. `script.js` 파일의 `GEMINI_API_KEY` 변수에 입력

## 📁 프로젝트 구조

```
magic-school-rule-finder/
├── index.html          # 메인 HTML 파일
├── script.js           # JavaScript 로직 및 문제 데이터
├── style.css           # 스타일시트
├── package.json        # 프로젝트 설정
├── vercel.json         # Vercel 배포 설정
├── .gitignore          # Git 무시 파일 목록
└── README.md           # 프로젝트 설명서
```

## 🎯 교육 목표

- **수학적 사고력 향상**: 패턴 인식과 규칙 찾기 능력 개발
- **논리적 추론**: 단계별 사고 과정을 통한 문제 해결
- **창의적 학습**: 게임화된 환경에서의 즐거운 학습 경험
- **개인화된 피드백**: AI 기반 맞춤형 학습 분석

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **PDF**: jsPDF, html2canvas
- **배포**: Vercel

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

Made with ❤️ for Korean elementary students

