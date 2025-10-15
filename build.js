const fs = require('fs');
const path = require('path');

// 환경 변수에서 API 키 가져오기
const apiKey = process.env.GEMINI_API_KEY || '';

// public 폴더의 script.js 파일 읽기
const scriptPath = path.join(__dirname, 'public', 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// 플레이스홀더를 실제 API 키로 교체
scriptContent = scriptContent.replace('__GEMINI_API_KEY_PLACEHOLDER__', apiKey);

// 수정된 내용을 다시 저장
fs.writeFileSync(scriptPath, scriptContent, 'utf8');

console.log('✅ API 키가 성공적으로 주입되었습니다.');
console.log('🔑 API 키 길이:', apiKey.length);
