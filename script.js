// --- API 키 입력란 ---
// 중요: 아래 "" 안에 Google AI Studio에서 발급받은 API 키를 넣어주세요.
// API 키를 발급받으려면: https://aistudio.google.com/app/apikey
// Vercel 배포 시: Vercel 대시보드 > Settings > Environment Variables에서 GEMINI_API_KEY 설정
const GEMINI_API_KEY = "__GEMINI_API_KEY_PLACEHOLDER__";

// API 키가 설정되었는지 확인하는 함수
function checkApiKey() {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === "") {
         return false;
    }
    return true;
}

// --- QUESTION BANK (데이터 구조 일관성 수정 및 보완) ---
const questionBank = {
    spell: {
        type1: [ // 단순 덧셈/뺄셈
            { id: 101, difficulty: '하', problem: "다음 숫자 배열의 규칙을 찾아 ?에 들어갈 알맞은 수를 고르세요: 2, 4, 6, 8, ?", options: ['9', '10', '11', '12', '14'], answer: '10', explanation: "숫자들이 2씩 커지고 있어요. 8 다음에는 8+2=10이 와야 해요." },
            { id: 102, difficulty: '중', problem: "규칙에 따라 ?에 들어갈 알맞은 수를 고르세요: 5, 9, 13, 17, ?", options: ['19', '20', '21', '22', '23'], answer: '21', explanation: "숫자들이 4씩 커지고 있어요. 17 다음에는 17+4=21이 와야 해요." },
            { id: 103, difficulty: '중', problem: "규칙에 따라 ?에 들어갈 알맞은 수를 고르세요: 30, 27, 24, 21, ?", options: ['17', '18', '19', '20', '22'], answer: '18', explanation: "숫자들이 3씩 작아지고 있어요. 21 다음에는 21-3=18이 와야 해요." },
            { id: 104, difficulty: '중', problem: "빈칸에 들어갈 알맞은 수는 무엇일까요? 11, 22, 33, ?, 55", options: ['34', '40', '43', '44', '54'], answer: '44', explanation: "숫자들이 11씩 커지고 있어요. 33 다음에는 33+11=44가 와야 해요." },
            { id: 105, difficulty: '중', problem: "다음 수 배열의 빈칸에 알맞은 수는? 98, 91, 84, ?, 70", options: ['77', '78', '79', '80', '81'], answer: '77', explanation: "숫자들이 7씩 작아지고 있어요. 84 다음에는 84-7=77이 와야 해요." },
            { id: 106, difficulty: '상', problem: "다음 숫자 배열에서 규칙을 찾아 ?에 들어갈 수를 고르세요: 100, 88, 76, 64, ?", options: ['50', '52', '54', '56', '58'], answer: '52', explanation: "숫자들이 12씩 작아지고 있어요. 64 다음에는 64-12=52가 와야 해요." },
        ],
        type2: [ // 단순 곱셈/나눗셈
            { id: 201, difficulty: '하', problem: "다음 숫자 배열의 규칙을 찾아 ?에 들어갈 알맞은 수를 고르세요: 2, 4, 8, 16, ?", options: ['20', '24', '30', '32', '64'], answer: '32', explanation: "숫자들이 2배씩 커지고 있어요. 16 다음에는 16×2=32가 와야 해요." },
            { id: 202, difficulty: '중', problem: "규칙에 따라 ?에 들어갈 알맞은 수를 고르세요: 3, 9, 27, 81, ?", options: ['162', '243', '251', '300', '321'], answer: '243', explanation: "숫자들이 3배씩 커지고 있어요. 81 다음에는 81×3=243이 와야 해요." },
            { id: 203, difficulty: '중', problem: "규칙에 따라 ?에 들어갈 알맞은 수를 고르세요: 80, 40, 20, 10, ?", options: ['1', '2', '4', '5', '8'], answer: '5', explanation: "숫자들이 2로 나누어지고 있어요. 10 다음에는 10÷2=5가 와야 해요." },
            { id: 204, difficulty: '중', problem: "빈칸에 들어갈 알맞은 수는 무엇일까요? 1, 5, 25, 125, ?", options: ['250', '500', '625', '750', '1000'], answer: '625', explanation: "숫자들이 5배씩 커지고 있어요. 125 다음에는 125×5=625가 와야 해요." },
            { id: 205, difficulty: '중', problem: "다음 수 배열의 빈칸에 알맞은 수는? 486, 162, 54, ?, 6", options: ['9', '12', '18', '24', '27'], answer: '18', explanation: "숫자들이 3으로 나누어지고 있어요. 54 다음에는 54÷3=18이 와야 해요." },
            { id: 206, difficulty: '상', problem: "다음 숫자 배열에서 규칙을 찾아 ?에 들어갈 수를 고르세요: 4, 12, 36, 108, ?", options: ['216', '300', '324', '360', '432'], answer: '324', explanation: "숫자들이 3배씩 커지고 있어요. 108 다음에는 108×3=324가 와야 해요." },
        ],
        type3: [ // 복합 연산
            { id: 301, difficulty: '하', problem: "다음 배열의 규칙을 찾아 ?에 들어갈 수를 고르세요: 1, 3, 7, 15, ?", options: ['28', '30', '31', '32', '35'], answer: '31', explanation: "앞의 수에 2를 곱하고 1을 더하는 규칙이에요. (1×2)+1=3, (3×2)+1=7 ... 따라서 15×2+1=31 입니다." },
            { id: 302, difficulty: '중', problem: "다음 배열의 규칙을 찾아 ?에 들어갈 수를 고르세요: 2, 5, 11, 23, ?", options: ['40', '42', '45', '47', '50'], answer: '47', explanation: "앞의 수에 2를 곱하고 1을 더하는 규칙이에요. 23×2+1=47 입니다." },
            { id: 303, difficulty: '중', problem: "다음 배열의 규칙을 찾아 ?에 들어갈 수를 고르세요: 3, 8, 18, 38, ?", options: ['78', '76', '74', '72', '70'], answer: '78', explanation: "앞의 수에 2를 곱하고 2를 더하는 규칙이에요. 38×2+2=78 입니다." },
            { id: 304, difficulty: '중', problem: "다음 배열의 규칙을 찾아 ?에 들어갈 수를 고르세요: 4, 9, 19, 39, ?", options: ['79', '78', '77', '76', '75'], answer: '79', explanation: "앞의 수에 2를 곱하고 1을 더하는 규칙이에요. 39×2+1=79 입니다." },
            { id: 305, difficulty: '중', problem: "다음 배열의 규칙을 찾아 ?에 들어갈 수를 고르세요: 5, 14, 41, 122, ?", options: ['365', '344', '322', '301', '289'], answer: '365', explanation: "앞의 수에 3을 곱하고 1을 빼는 규칙이에요. 122×3-1=365 입니다." },
            { id: 306, difficulty: '상', problem: "다음 배열의 규칙을 찾아 ?에 들어갈 수를 고르세요: 2, 5, 14, 41, ?", options: ['122', '123', '124', '125', '126'], answer: '122', explanation: "앞의 수에 3을 곱하고 1을 빼는 규칙이에요. 41×3-1=122 입니다." },
        ],
        type4: [ // 순서와 관련된 규칙
            { id: 401, difficulty: '하', problem: "첫 번째에 5, 두 번째에 10, 세 번째에 15가 오는 규칙입니다. 다섯 번째에 올 수는 무엇일까요?", options: ['20', '25', '30', '35', '40'], answer: '25', explanation: "n번째 오는 수는 n × 5 입니다. 따라서 다섯 번째 수는 5 × 5 = 25입니다." },
            { id: 402, difficulty: '중', problem: "첫 번째에 1, 두 번째에 4, 세 번째에 9가 오는 규칙입니다. 다섯 번째에 올 수는 무엇일까요?", options: ['16', '20', '25', '30', '36'], answer: '25', explanation: "n번째 오는 수는 n × n 입니다. 따라서 다섯 번째 수는 5 × 5 = 25입니다." },
            { id: 403, difficulty: '중', problem: "첫 번째에 3, 두 번째에 5, 세 번째에 7이 오는 규칙입니다. 여섯 번째에 올 수는 무엇일까요?", options: ['11', '12', '13', '14', '15'], answer: '13', explanation: "n번째 오는 수는 n × 2 + 1 입니다. 따라서 여섯 번째 수는 6 × 2 + 1 = 13입니다." },
            { id: 404, difficulty: '중', problem: "첫 번째에 10, 두 번째에 20, 세 번째에 30... 규칙으로 수가 놓여있습니다. 8번째에 올 수는 무엇일까요?", options: ['60', '70', '80', '90', '100'], answer: '80', explanation: "n번째 오는 수는 n × 10 입니다. 따라서 8번째 수는 8 × 10 = 80입니다." },
            { id: 405, difficulty: '중', problem: "첫 번째에 9, 두 번째에 18, 세 번째에 27... 규칙으로 수가 놓여있습니다. 5번째에 올 수는 무엇일까요?", options: ['36', '45', '54', '63', '72'], answer: '45', explanation: "n번째 오는 수는 n × 9 입니다. 따라서 5번째 수는 5 × 9 = 45입니다." },
            { id: 406, difficulty: '상', problem: "첫 번째에 2, 두 번째에 5, 세 번째에 10, 네 번째에 17이 오는 규칙입니다. 다섯 번째에 올 수는 무엇일까요?", options: ['24', '25', '26', '27', '28'], answer: '26', explanation: "n번째 오는 수는 n × n + 1 입니다. 따라서 다섯 번째 수는 5 × 5 + 1 = 26입니다." },
        ],
        type5: [ // 두 수 사이의 대응 관계
            { id: 501, difficulty: '하', problem: "위쪽 수가 1, 2, 3, 4일 때 아래쪽 수는 5, 6, 7, 8입니다. 위쪽 수가 10이라면 아래쪽 수는 무엇일까요?", options: ['11', '12', '13', '14', '15'], answer: '14', explanation: "아래쪽 수는 위쪽 수보다 항상 4가 더 큽니다. 따라서 10 + 4 = 14입니다." },
            { id: 502, difficulty: '중', problem: "□가 3, 4, 5일 때 △는 9, 12, 15입니다. □가 7이라면 △는 무엇일까요?", options: ['18', '20', '21', '24', '28'], answer: '21', explanation: "△는 □의 3배입니다. (△ = □ × 3) 따라서 7 × 3 = 21입니다." },
            { id: 503, difficulty: '중', problem: "입력한 수가 10, 20, 30일 때 출력되는 수는 8, 18, 28입니다. 입력한 수가 50이라면 출력되는 수는?", options: ['38', '48', '52', '58', '68'], answer: '48', explanation: "출력되는 수는 입력한 수보다 2가 작습니다. 따라서 50 - 2 = 48입니다." },
            { id: 504, difficulty: '중', problem: "나이가 10살, 11살, 12살일 때 태어난 해는 2015년, 2014년, 2013년입니다. 나이가 15살이라면 태어난 해는? (올해는 2025년)", options: ['2009', '2010', '2011', '2012', '2013'], answer: '2010', explanation: "2025 - 나이 = 태어난 해 입니다. 따라서 2025 - 15 = 2010년 입니다." },
            { id: 505, difficulty: '중', problem: "1층에 6명, 2층에 12명, 3층에 18명이 살고 있습니다. 5층에는 몇 명이 살고 있을까요?", options: ['24', '28', '30', '32', '36'], answer: '30', explanation: "각 층에 사는 사람의 수는 층 수 × 6 입니다. 따라서 5층에는 5 × 6 = 30명이 삽니다." },
            { id: 506, difficulty: '상', problem: "기계에 2를 넣으면 5가, 3을 넣으면 7이, 4를 넣으면 9가 나옵니다. 8을 넣으면 무엇이 나올까요?", options: ['15', '16', '17', '18', '19'], answer: '17', explanation: "나오는 수는 들어간 수 × 2 + 1 입니다. 따라서 8을 넣으면 8 × 2 + 1 = 17이 나옵니다." },
        ]
    },
    drawing: {
        type1: [ // 단순 반복
            { id: 601, difficulty: '하', problem: "다음 마법진의 규칙을 찾아 ?에 알맞은 모양을 고르세요.", pattern: [{shape:'circle',color:'red'}, {shape:'square',color:'blue'}, {shape:'circle',color:'red'}, {shape:'square',color:'blue'}], options: [{shape:'circle',color:'red'}, {shape:'square',color:'red'}, {shape:'circle',color:'blue'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'green'}], answer: {shape:'circle',color:'red'}, explanation: "빨간 원과 파란 사각형이 반복되는 규칙이에요. 파란 사각형 다음에는 다시 빨간 원이 와야 해요." },
            { id: 602, difficulty: '중', problem: "다음 마법진의 규칙을 찾아 ?에 알맞은 모양을 고르세요.", pattern: [{shape:'star',color:'yellow'}, {shape:'triangle',color:'green'}, {shape:'square',color:'blue'}, {shape:'star',color:'yellow'}], options: [{shape:'star',color:'yellow'}, {shape:'triangle',color:'green'}, {shape:'square',color:'blue'}, {shape:'circle',color:'red'}, {shape:'triangle',color:'yellow'}], answer: {shape:'triangle',color:'green'}, explanation: "노란 별, 초록 삼각형, 파란 사각형이 순서대로 반복되는 규칙입니다. 노란 별 다음에는 초록 삼각형이 와야 합니다." },
            { id: 603, difficulty: '중', problem: "다음 마법진의 규칙을 찾아 ?에 알맞은 모양을 고르세요.", pattern: [{shape:'square',color:'red'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'yellow'}, {shape:'square',color:'red'}], options: [{shape:'square',color:'blue'}, {shape:'triangle',color:'red'}, {shape:'triangle',color:'yellow'}, {shape:'square',color:'red'}, {shape:'circle',color:'blue'}], answer: {shape:'square',color:'blue'}, explanation: "빨간 사각형, 파란 사각형, 노란 삼각형이 순서대로 반복되는 규칙입니다. 빨간 사각형 다음에는 파란 사각형이 와야 합니다." },
            { id: 604, difficulty: '중', problem: "다음 마법진의 규칙을 찾아 ?에 알맞은 모양을 고르세요.", pattern: [{shape:'circle',color:'green'}, {shape:'star',color:'red'}, {shape:'circle',color:'green'}, {shape:'star',color:'red'}], options: [{shape:'circle',color:'green'}, {shape:'star',color:'red'}, {shape:'circle',color:'red'}, {shape:'star',color:'green'}, {shape:'square',color:'green'}], answer: {shape:'circle',color:'green'}, explanation: "초록 원과 빨간 별이 반복되는 규칙입니다. 빨간 별 다음에는 다시 초록 원이 와야 합니다." },
            { id: 605, difficulty: '중', problem: "다음 마법진의 규칙을 찾아 ?에 알맞은 모양을 고르세요.", pattern: [{shape:'triangle',color:'blue'}, {shape:'triangle',color:'yellow'}, {shape:'triangle',color:'red'}, {shape:'triangle',color:'blue'}], options: [{shape:'triangle',color:'yellow'}, {shape:'triangle',color:'blue'}, {shape:'triangle',color:'red'}, {shape:'circle',color:'yellow'}, {shape:'square',color:'yellow'}], answer: {shape:'triangle',color:'yellow'}, explanation: "파란 삼각형, 노란 삼각형, 빨간 삼각형이 순서대로 반복됩니다. 파란 삼각형 다음에는 노란 삼각형이 와야 합니다." },
            { id: 606, difficulty: '상', problem: "다음 마법진의 규칙을 찾아 ?에 알맞은 모양을 고르세요.", pattern: [{shape:'circle',color:'red'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'yellow'}, {shape:'star',color:'green'}, {shape:'circle',color:'red'}], options: [{shape:'square',color:'blue'}, {shape:'triangle',color:'yellow'}, {shape:'star',color:'green'}, {shape:'circle',color:'red'}, {shape:'circle',color:'blue'}], answer: {shape:'square',color:'blue'}, explanation: "빨간 원, 파란 사각형, 노란 삼각형, 초록 별이 순서대로 반복되는 규칙입니다. 빨간 원 다음에는 파란 사각형이 와야 합니다." },
        ],
        type2: [ // 속성 변화
            { id: 701, difficulty: '하', problem: "모양은 그대로, 색깔만 바뀌는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'circle',color:'red'}, {shape:'circle',color:'blue'}, {shape:'circle',color:'yellow'}], options: [{shape:'circle',color:'green'}, {shape:'square',color:'green'}, {shape:'circle',color:'red'}, {shape:'square',color:'red'}, {shape:'triangle',color:'green'}], answer: {shape:'circle',color:'green'}, explanation: "모양은 원으로 똑같고, 색깔이 빨강, 파랑, 노랑, 초록 순으로 바뀌고 있어요." },
            { id: 702, difficulty: '중', problem: "색깔은 그대로, 모양만 바뀌는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'circle',color:'blue'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'blue'}], options: [{shape:'star',color:'blue'}, {shape:'star',color:'red'}, {shape:'circle',color:'blue'}, {shape:'square',color:'green'}, {shape:'triangle',color:'yellow'}], answer: {shape:'star',color:'blue'}, explanation: "색깔은 파란색으로 똑같고, 모양이 원, 사각형, 삼각형, 별 순서로 바뀌고 있어요." },
            { id: 703, difficulty: '중', problem: "모양은 반복되고, 색깔만 바뀌는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'star',color:'red'}, {shape:'star',color:'yellow'}, {shape:'star',color:'blue'}], options: [{shape:'star',color:'green'}, {shape:'circle',color:'green'}, {shape:'star',color:'red'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'yellow'}], answer: {shape:'star',color:'green'}, explanation: "모양은 별로 고정이고, 색깔이 빨강, 노랑, 파랑, 초록 순서로 바뀌고 있어요." },
            { id: 704, difficulty: '중', problem: "색깔은 반복되고, 모양만 바뀌는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'square',color:'yellow'}, {shape:'triangle',color:'yellow'}, {shape:'star',color:'yellow'}], options: [{shape:'circle',color:'yellow'}, {shape:'circle',color:'red'}, {shape:'square',color:'yellow'}, {shape:'triangle',color:'blue'}, {shape:'star',color:'green'}], answer: {shape:'circle',color:'yellow'}, explanation: "색깔은 노란색으로 고정이고, 모양이 사각형, 삼각형, 별, 원 순서로 바뀌고 있어요." },
            { id: 705, difficulty: '중', problem: "모양과 색깔이 각각 다른 규칙으로 바뀌고 있습니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'circle',color:'red'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'yellow'}], options: [{shape:'star',color:'green'}, {shape:'star',color:'red'}, {shape:'circle',color:'green'}, {shape:'square',color:'yellow'}, {shape:'triangle',color:'blue'}], answer: {shape:'star',color:'green'}, explanation: "모양은 원, 사각형, 삼각형, 별 순서로, 색깔은 빨강, 파랑, 노랑, 초록 순서로 바뀌고 있습니다." },
            { id: 706, difficulty: '상', problem: "모양은 거꾸로, 색깔은 순서대로 바뀌는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'star',color:'red'}, {shape:'triangle',color:'blue'}, {shape:'square',color:'yellow'}], options: [{shape:'circle',color:'green'}, {shape:'circle',color:'red'}, {shape:'star',color:'green'}, {shape:'triangle',color:'yellow'}, {shape:'square',color:'blue'}], answer: {shape:'circle',color:'green'}, explanation: "모양은 별, 삼각형, 사각형, 원 순서로, 색깔은 빨강, 파랑, 노랑, 초록 순서로 바뀌고 있습니다." },
        ],
        type3: [ // 개수 변화
            { id: 801, difficulty: '하', problem: "도형의 개수가 1개씩 늘어나는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [[{shape:'star',color:'yellow'}], [{shape:'star',color:'yellow'}, {shape:'star',color:'yellow'}], [{shape:'star',color:'yellow'}, {shape:'star',color:'yellow'}, {shape:'star',color:'yellow'}]], options: [[[{shape:'star',color:'yellow'}]],[[{shape:'star',color:'yellow'}, {shape:'star',color:'yellow'}]],[[{shape:'star',color:'yellow'},{shape:'star',color:'yellow'},{shape:'star',color:'yellow'},{shape:'star',color:'yellow'}]],[[{shape:'circle',color:'yellow'},{shape:'circle',color:'yellow'},{shape:'circle',color:'yellow'},{shape:'circle',color:'yellow'}]],[[{shape:'star',color:'blue'},{shape:'star',color:'blue'},{shape:'star',color:'blue'},{shape:'star',color:'blue'}]]], answer: [[{shape:'star',color:'yellow'}, {shape:'star',color:'yellow'}, {shape:'star',color:'yellow'}, {shape:'star',color:'yellow'}]], explanation: "노란 별의 개수가 1개, 2개, 3개로 늘어나고 있으므로 다음은 4개가 와야 합니다." },
            { id: 802, difficulty: '중', problem: "도형의 개수가 2개씩 늘어나는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [[{shape:'circle',color:'blue'}], [{shape:'circle',color:'blue'}, {shape:'circle',color:'blue'}, {shape:'circle',color:'blue'}]], options: [[[{shape:'circle',color:'blue'}]],[[{shape:'circle',color:'blue'}, {shape:'circle',color:'blue'}]],[[{shape:'circle',color:'blue'},{shape:'circle',color:'blue'},{shape:'circle',color:'blue'},{shape:'circle',color:'blue'}]],[[{shape:'circle',color:'blue'},{shape:'circle',color:'blue'},{shape:'circle',color:'blue'},{shape:'circle',color:'blue'},{shape:'circle',color:'blue'}]]], answer: [[{shape:'circle',color:'blue'}, {shape:'circle',color:'blue'}, {shape:'circle',color:'blue'}, {shape:'circle',color:'blue'}, {shape:'circle',color:'blue'}]], explanation: "파란 원의 개수가 1개에서 3개로 2개 늘어났습니다. 따라서 다음은 3개에서 2개 늘어난 5개가 와야 합니다." },
            { id: 803, difficulty: '중', problem: "도형의 개수가 1개씩 줄어드는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [[{shape:'triangle',color:'green'}, {shape:'triangle',color:'green'}, {shape:'triangle',color:'green'}, {shape:'triangle',color:'green'}], [{shape:'triangle',color:'green'}, {shape:'triangle',color:'green'}, {shape:'triangle',color:'green'}]], options: [[[{shape:'triangle',color:'green'}]],[[{shape:'triangle',color:'green'}, {shape:'triangle',color:'green'}]],[[{shape:'triangle',color:'green'}, {shape:'triangle',color:'green'}, {shape:'triangle',color:'green'}]],[[{shape:'square',color:'green'}, {shape:'square',color:'green'}]],[[{shape:'triangle',color:'red'}, {shape:'triangle',color:'red'}]]], answer: [[{shape:'triangle',color:'green'}, {shape:'triangle',color:'green'}]], explanation: "초록 삼각형의 개수가 4개, 3개로 줄어들고 있으므로 다음은 2개가 와야 합니다." },
            { id: 804, difficulty: '중', problem: "도형의 개수가 2배씩 늘어나는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [[{shape:'circle',color:'red'}], [{shape:'circle',color:'red'},{shape:'circle',color:'red'}], [{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'}]], options: [[[{shape:'circle',color:'red'}]],[[{shape:'circle',color:'red'},{shape:'circle',color:'red'}]],[[{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'}]]], answer: [[{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'},{shape:'circle',color:'red'}]], explanation: "빨간 원의 개수가 1개, 2개, 4개로 2배씩 늘어나고 있습니다. 따라서 다음은 8개가 와야 합니다." },
            { id: 805, difficulty: '중', problem: "가로, 세로로 도형이 1개씩 늘어나는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [[[{shape:'star',color:'blue'}]], [[{shape:'star',color:'blue'},{shape:'star',color:'blue'}],[{shape:'star',color:'blue'},{shape:'star',color:'blue'}]]], options: [[[[{shape:'star',color:'blue'}]]],[[[{shape:'star',color:'blue'},{shape:'star',color:'blue'}],[{shape:'star',color:'blue'},{shape:'star',color:'blue'}]]], [[[{shape:'star',color:'blue'},{shape:'star',color:'blue'},{shape:'star',color:'blue'}],[{shape:'star',color:'blue'},{shape:'star',color:'blue'},{shape:'star',color:'blue'}],[{shape:'star',color:'blue'},{shape:'star',color:'blue'},{shape:'star',color:'blue'}]]]], answer: [[[{shape:'star',color:'blue'},{shape:'star',color:'blue'},{shape:'star',color:'blue'}],[{shape:'star',color:'blue'},{shape:'star',color:'blue'},{shape:'star',color:'blue'}],[{shape:'star',color:'blue'},{shape:'star',color:'blue'},{shape:'star',color:'blue'}]]], explanation: "처음에는 1x1 배열, 다음에는 2x2 배열이므로 그 다음은 3x3 배열이 와야 합니다." },
            { id: 806, difficulty: '상', problem: "도형의 개수가 1, 3, 6, 10개로 늘어나는 삼각수 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [[[{shape:'circle',color:'green'}]], [[{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'}]], [[{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'},{shape:'circle',color:'green'}]]], options: [[[[{shape:'circle',color:'green'}]], [[{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'}]], [[{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'},{shape:'circle',color:'green'}]], [[{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'},{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'},{shape:'circle',color:'green'},{shape:'circle',color:'green'}]]]], answer: [[[{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'},{shape:'circle',color:'green'}],[{shape:'circle',color:'green'},{shape:'circle',color:'green'},{shape:'circle',color:'green'},{shape:'circle',color:'green'}]]], explanation: "도형의 개수가 +2, +3, +4... 씩 늘어나는 규칙입니다. 6개 다음에는 4개가 늘어난 10개가 되어야 합니다." }
        ],
        type4: [ // 회전/반전
            { id: 901, difficulty: '하', problem: "삼각형이 시계방향으로 90도씩 회전하고 있습니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'triangle',color:'green',rotation:0}, {shape:'triangle',color:'green',rotation:90}, {shape:'triangle',color:'green',rotation:180}], options:[{shape:'triangle',color:'green',rotation:270}, {shape:'triangle',color:'green',rotation:0}, {shape:'triangle',color:'blue',rotation:270}, {shape:'square',color:'green',rotation:270}], answer: {shape:'triangle',color:'green',rotation:270}, explanation: "삼각형이 오른쪽으로 90도씩 돌아가고 있습니다. 아래를 향한 삼각형 다음에는 왼쪽을 향하는 삼각형이 와야 합니다." },
            { id: 902, difficulty: '중', problem: "도형이 시계 반대방향으로 90도씩 회전하고 있습니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'arrow',color:'yellow',rotation:0}, {shape:'arrow',color:'yellow',rotation:270}, {shape:'arrow',color:'yellow',rotation:180}], options:[{shape:'arrow',color:'yellow',rotation:90}, {shape:'arrow',color:'red',rotation:90}, {shape:'arrow',color:'yellow',rotation:180}, {shape:'L',color:'yellow',rotation:90}], answer: {shape:'arrow',color:'yellow',rotation:90}, explanation: "화살표 모양이 왼쪽으로 90도씩 돌아가고 있습니다. 아래를 향한 화살표 다음에는 오른쪽을 향하는 화살표가 와야 합니다." },
            { id: 903, difficulty: '중', problem: "도형이 좌우로 뒤집히는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'L',color:'blue',reflection:'none'}, {shape:'L',color:'blue',reflection:'horizontal'}, {shape:'L',color:'blue',reflection:'none'}], options:[{shape:'L',color:'blue',reflection:'horizontal'}, {shape:'L',color:'blue',reflection:'none'}, {shape:'L',color:'red',reflection:'horizontal'}, {shape:'F',color:'blue',reflection:'horizontal'}], answer: {shape:'L',color:'blue',reflection:'horizontal'}, explanation: "L 모양이 원래 모습과 좌우가 뒤집힌 모습으로 번갈아 나타납니다. 원래 모습 다음에는 뒤집힌 모습이 와야 합니다." },
            { id: 904, difficulty: '중', problem: "도형이 상하로 뒤집히는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'F',color:'red',reflection:'none'}, {shape:'F',color:'red',reflection:'vertical'}, {shape:'F',color:'red',reflection:'none'}], options:[{shape:'F',color:'red',reflection:'vertical'}, {shape:'F',color:'red',reflection:'none'}, {shape:'F',color:'blue',reflection:'vertical'}, {shape:'L',color:'red',reflection:'vertical'}], answer: {shape:'F',color:'red',reflection:'vertical'}, explanation: "F 모양이 원래 모습과 위아래가 뒤집힌 모습으로 번갈아 나타납니다. 원래 모습 다음에는 뒤집힌 모습이 와야 합니다." },
            { id: 905, difficulty: '중', problem: "180도 회전하는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'arrow',color:'green',rotation:0}, {shape:'arrow',color:'green',rotation:180}, {shape:'arrow',color:'green',rotation:0}], options:[{shape:'arrow',color:'green',rotation:180}, {shape:'arrow',color:'green',rotation:0}, {shape:'arrow',color:'red',rotation:180}], answer: {shape:'arrow',color:'green',rotation:180}, explanation: "위를 향한 화살표와 아래를 향한 화살표가 번갈아 나타납니다. 위를 향한 화살표 다음에는 아래를 향한 화살표가 와야 합니다." },
            { id: 906, difficulty: '상', problem: "시계방향 90도 회전과 좌우 뒤집기가 번갈아 적용됩니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'R',color:'yellow',rotation:0}, {shape:'R',color:'yellow',rotation:90}, {shape:'R',color:'yellow',rotation:90, reflection:'horizontal'}], options:[{shape:'R',color:'yellow',rotation:180, reflection:'horizontal'}, {shape:'R',color:'yellow',rotation:90, reflection:'horizontal'}, {shape:'R',color:'yellow',rotation:180}, {shape:'L',color:'yellow',rotation:180, reflection:'horizontal'}], answer: {shape:'R',color:'yellow',rotation:180, reflection:'horizontal'}, explanation: "처음에는 90도 회전, 그 다음에는 좌우 뒤집기, 그 다음은 다시 90도 회전이 적용되는 복잡한 규칙입니다." },
        ],
        type5: [ // 복합 규칙
            { id: 1001, difficulty: '하', problem: "모양과 색깔이 짝을 이뤄 반복됩니다. ?에 알맞은 모양을 고르세요.", pattern: [[{shape:'circle',color:'red'}], [{shape:'square',color:'red'}], [{shape:'circle',color:'blue'}], [{shape:'square',color:'blue'}]], options: [[{shape:'circle',color:'red'}], [{shape:'square',color:'red'}], [{shape:'circle',color:'blue'}]], answer: [[{shape:'circle',color:'red'}]], explanation: "빨간 원-사각형, 파란 원-사각형 순서로 반복됩니다. 파란 사각형 다음에는 다시 빨간 원이 와야 합니다." },
            { id: 1002, difficulty: '중', problem: "큰 도형 안의 작은 도형 색깔이 바뀌는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'square_with_circle',outer_color:'blue',inner_color:'red'}, {shape:'square_with_circle',outer_color:'blue',inner_color:'yellow'}], options: [{shape:'square_with_circle',outer_color:'blue',inner_color:'green'}, {shape:'square_with_circle',outer_color:'blue',inner_color:'red'}, {shape:'circle_with_square',outer_color:'blue',inner_color:'green'}], answer: {shape:'square_with_circle',outer_color:'blue',inner_color:'green'}, explanation: "파란 사각형은 그대로이고, 안의 원 색깔만 빨강, 노랑, 초록 순서로 바뀝니다." },
            { id: 1003, difficulty: '중', problem: "바깥 도형과 안쪽 도형이 서로 바뀌는 규칙입니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'circle_with_square',outer_color:'red',inner_color:'blue'}, {shape:'square_with_circle',outer_color:'blue',inner_color:'red'}], options: [{shape:'circle_with_square',outer_color:'red',inner_color:'blue'}, {shape:'square_with_circle',outer_color:'blue',inner_color:'red'}, {shape:'circle_with_square',outer_color:'blue',inner_color:'red'}], answer: {shape:'circle_with_square',outer_color:'red',inner_color:'blue'}, explanation: "바깥 도형과 안쪽 도형의 모양과 색깔이 서로 자리를 바꿉니다." },
            { id: 1004, difficulty: '중', problem: "도형의 모양은 2칸씩, 색깔은 1칸씩 반복됩니다. ?에 알맞은 모양을 고르세요.", pattern: [{shape:'circle',color:'red'}, {shape:'circle',color:'blue'}, {shape:'square',color:'green'}, {shape:'square',color:'red'}], options: [{shape:'triangle',color:'blue'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'red'}], answer: {shape:'triangle',color:'blue'}, explanation: "모양은 원-원-사각형-사각형-삼각형-삼각형... 순서이고, 색깔은 빨강-파랑-초록-빨강... 순서입니다." },
            { id: 1005, difficulty: '상', problem: "가로, 세로, 대각선에 서로 다른 도형 3개가 놓이는 규칙입니다. 빈칸에 알맞은 모양은?", pattern: [[[{shape:'circle',color:'red'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'green'}],[{shape:'square',color:'blue'}, {shape:'?',color:''}, {shape:'circle',color:'red'}]]], options: [[{shape:'triangle',color:'green'}], [{shape:'square',color:'blue'}], [{shape:'circle',color:'red'}]], answer: [[{shape:'triangle',color:'green'}]], explanation: "가로, 세로, 대각선에 놓인 도형들이 모두 다릅니다. 두 번째 줄에 없는 도형은 초록 삼각형입니다." },
            { id: 1006, difficulty: '상', problem: "시계 방향으로 돌면서 도형이 하나씩 추가되는 규칙입니다. ?에 알맞은 모양은?", pattern: [ [[{shape:'circle',color:'red'}]], [[{shape:'circle',color:'red'}, {shape:'square',color:'blue'}]] ], options: [[[{shape:'circle',color:'red'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'yellow'}]], [[{shape:'circle',color:'red'}, {shape:'square',color:'blue'}, {shape:'star',color:'green'}]]], answer: [[{shape:'circle',color:'red'}, {shape:'square',color:'blue'}, {shape:'triangle',color:'yellow'}]], explanation: "시계 방향으로 돌면서 원, 사각형, 삼각형, 별이 차례대로 추가되고 있습니다." },
        ]
    },
    potion: {
        type1: [ // 단순 빈칸 채우기 (덧셈)
            { id: 1101, difficulty: '하', left: [5, '?'], right: [10], answer: '5', options: ['3', '4', '5', '6', '7'], explanation: "오른쪽 저울의 합은 10이에요. 왼쪽 저울도 합이 10이 되려면 5에 5를 더해야 해요. 5+5=10" },
            { id: 1102, difficulty: '중', left: [8, 7], right: ['?', 10], answer: '5', options: ['3', '5', '7', '15', '25'], explanation: "왼쪽 저울의 합은 8+7=15입니다. 오른쪽 저울도 합이 15가 되려면, 10에 5를 더해야 합니다." },
            { id: 1103, difficulty: '중', left: [12, 4], right: ['?', 9], answer: '7', options: ['5', '6', '7', '8', '16'], explanation: "왼쪽 저울의 합은 12+4=16입니다. 오른쪽 저울도 합이 16이 되려면 9에 7을 더해야 합니다." },
            { id: 1104, difficulty: '중', left: ['?', 15], right: [25], answer: '10', options: ['5', '10', '15', '25', '40'], explanation: "오른쪽 저울의 합은 25입니다. 왼쪽 저울도 합이 25가 되려면 15에 10을 더해야 합니다." },
            { id: 1105, difficulty: '중', left: [6, 11], right: ['?'], answer: '17', options: ['5', '11', '16', '17', '27'], explanation: "왼쪽 저울의 합은 6+11=17입니다. 오른쪽 저울과 같아지려면 ?는 17이 되어야 합니다." },
            { id: 1106, difficulty: '상', left: [23, 18], right: [30, '?'], answer: '11', options: ['10', '11', '12', '41', '71'], explanation: "왼쪽 저울의 합은 23+18=41입니다. 오른쪽 저울도 합이 41이 되려면 30에 11을 더해야 합니다." },
        ],
        type2: [ // 뺄셈 관계
            { id: 1201, difficulty: '하', left: [15], right: ['?', 8], answer: '7', options: ['6', '7', '8', '15', '23'], explanation: "왼쪽 저울의 무게는 15입니다. 오른쪽도 15가 되려면 15-8=7이 필요합니다." },
            { id: 1202, difficulty: '중', left: [20], right: [12, '?'], answer: '8', options: ['6', '7', '8', '20', '32'], explanation: "왼쪽 저울의 무게는 20입니다. 오른쪽도 20이 되려면 20-12=8이 필요합니다." },
            { id: 1203, difficulty: '중', left: [18, '?'], right: [30], answer: '12', options: ['10', '12', '18', '30', '48'], explanation: "오른쪽 저울의 무게는 30입니다. 왼쪽도 30이 되려면 30-18=12가 필요합니다." },
            { id: 1204, difficulty: '중', left: [35], right: ['?', 5], answer: '30', options: ['20', '25', '30', '35', '40'], explanation: "왼쪽의 합은 35입니다. 오른쪽도 35가 되려면 35-5=30이 필요합니다." },
            { id: 1205, difficulty: '중', left: [50], right: [29, '?'], answer: '21', options: ['19', '20', '21', '29', '79'], explanation: "왼쪽은 50입니다. 오른쪽도 50이 되려면 50-29=21이 필요합니다." },
            { id: 1206, difficulty: '상', left: [100, '?'], right: [45, 60], answer: '5', options: ['5', '15', '95', '105', '205'], explanation: "오른쪽의 합은 105입니다. 왼쪽도 105가 되려면 105-100=5가 필요합니다." },
        ],
        type3: [ // 곱셈 관계
            { id: 1301, difficulty: '하', left: [2, 2, 2], right: ['?'], answer: '6', options: ['2', '3', '5', '6', '9'], explanation: "2g 구슬 3개의 무게는 2x3=6g 입니다." },
            { id: 1302, difficulty: '중', left: [5,5,5,5], right: ['?','?'], answer: '10', options: ['5', '10', '15', '20', '40'], explanation: "왼쪽의 합은 20g 입니다. 오른쪽도 20g이 되려면 ? 두 개의 합이 20이어야 하므로 ?는 10입니다." },
            { id: 1303, difficulty: '중', left: [3,3,3,3,3], right: ['?','?','?'], answer: '5', options: ['3', '5', '8', '15', '45'], explanation: "왼쪽의 합은 15g 입니다. 오른쪽도 15g이 되려면 ? 세 개의 합이 15여야 하므로 ?는 5입니다." },
            { id: 1304, difficulty: '중', left: [4, 4], right: ['?'], answer: '8', options: ['2', '4', '6', '8', '12'], explanation: "4g 큐브 2개의 무게는 4x2=8g 입니다." },
            { id: 1305, difficulty: '중', left: [10,10,10], right: [], problem: "10g짜리 무게추 3개는 6g짜리 무게추 몇 개와 무게가 같을까요?", answer: '5', options: ['3', '4', '5', '6', '30'], explanation: "10g 3개는 30g입니다. 30g은 6g 5개와 같습니다. (30 / 6 = 5)" },
            { id: 1306, difficulty: '상', left: [8,8,8], right: ['?','?','?','?','?','?'], answer: '4', options: ['3', '4', '6', '8', '24'], explanation: "왼쪽의 합은 24g 입니다. 오른쪽도 24g이 되려면 ? 여섯 개의 합이 24여야 하므로 ?는 4입니다." },
        ],
        type4: [ // 나눗셈 관계
            { id: 1401, difficulty: '하', left: [20], right: ['?','?','?','?'], answer: '5', options: ['4', '5', '6', '16', '24'], explanation: "20g을 4개로 똑같이 나누면 20/4=5g 입니다." },
            { id: 1402, difficulty: '중', left: [18], right: [], problem: "18g짜리 마법 돌은 3g짜리 작은 돌 몇 개와 무게가 같을까요?", answer: '6', options: ['3', '6', '9', '15', '21'], explanation: "18g을 3g으로 나누면 6개가 됩니다. (18 / 3 = 6)" },
            { id: 1403, difficulty: '중', left: [30], right: ['?','?','?','?','?'], answer: '6', options: ['5', '6', '7', '25', '35'], explanation: "30g을 5개로 똑같이 나누면 30/5=6g 입니다." },
            { id: 1404, difficulty: '중', left: [24], right: ['?','?','?','?','?','?','?','?'], answer: '3', options: ['2', '3', '4', '16', '32'], explanation: "24g을 8개로 똑같이 나누면 24/8=3g 입니다." },
            { id: 1405, difficulty: '중', left: [45], right: [], problem: "무게가 같은 구슬 9개의 총 무게가 45g일 때, 구슬 한 개의 무게는?", answer: '5', options: ['4', '5', '6', '9', '36'], explanation: "45g을 9개로 똑같이 나누면 45/9=5g 입니다." },
            { id: 1406, difficulty: '상', left: [56], right: [], problem: "56g의 마법 가루를 무게가 같은 7개의 주머니에 나누어 담았습니다. 주머니 3개의 무게는 얼마일까요?", answer: '24', options: ['8', '16', '21', '24', '56'], explanation: "한 주머니의 무게는 56/7=8g 입니다. 따라서 주머니 3개의 무게는 8x3=24g 입니다." },
        ],
        type5: [ // 복합 연산
            { id: 1501, difficulty: '하', left: [5, 10], right: ['?', 3], answer: '12', options: ['2', '8', '12', '15', '18'], explanation: "왼쪽의 합은 15입니다. 오른쪽도 15가 되려면 15-3=12가 필요합니다." },
            { id: 1502, difficulty: '중', left: [16], right: ['?', 6], problem: "무게가 2인 재료 8개의 합은 ?와 6의 합과 같습니다. ?는 얼마일까요?", answer: '10', options: ['2', '8', '10', '16', '22'], explanation: "2x8=16. 16 = ?+6 이므로 ?는 10입니다." },
            { id: 1503, difficulty: '중', left: [20], right: [5, 8, '?'], answer: '7', options: ['5', '7', '8', '13', '20'], explanation: "왼쪽은 20입니다. 오른쪽 5+8=13이므로, 20이 되려면 7이 더 필요합니다." },
            { id: 1504, difficulty: '중', left: [21], right: [30], problem: "무게가 3인 재료 7개의 합은 30에서 ?를 뺀 것과 같습니다. ?는 얼마일까요?", answer: '9', options: ['9', '11', '21', '30', '51'], explanation: "3x7=21. 21 = 30-? 이므로 ?는 9입니다." },
            { id: 1505, difficulty: '중', left: [15, '?'], right: [20], problem: "15와 ?의 합은 무게가 4인 재료 5개의 합과 같습니다. ?는 얼마일까요?", answer: '5', options: ['4', '5', '15', '20', '35'], explanation: "4x5=20. 15+?=20 이므로 ?는 5입니다." },
            { id: 1506, difficulty: '상', left: [25], right: ['?', 15], problem: "무게가 2인 재료 10개와 5의 합은 ?와 15의 합과 같습니다. ?는 얼마일까요?", answer: '10', options: ['5', '10', '15', '25', '40'], explanation: "(2x10)+5=25. 25 = ?+15 이므로 ?는 10입니다." },
        ]
    }
};

// --- STATE MANAGEMENT ---
let nickname = '';
let characterGender = ''; // 'female' or 'male'
let currentGameType = ''; // 'spell', 'drawing', or 'potion'
let currentScreen = 'landing-screen';
let questions = []; // 이번 게임에 출제될 5문제
let userAnswers = [];
let currentQuestionIndex = 0;
let score = 0;
let baseCharacterData = null; // Cache for the base character's base64 data

// --- DOM ELEMENTS ---
const screens = {
    landing: document.getElementById('landing-screen'),
    selection: document.getElementById('selection-screen'),
    activity: document.getElementById('activity-screen'),
    results: document.getElementById('results-screen')
};
const nicknameInput = document.getElementById('nickname-input');
const startButton = document.getElementById('start-button');
const genderFemaleButton = document.getElementById('gender-female');
const genderMaleButton = document.getElementById('gender-male');
const welcomeMessage = document.getElementById('welcome-message');
const classSpellCard = document.getElementById('class-spell');
const classDrawingCard = document.getElementById('class-drawing');
const classPotionCard = document.getElementById('class-potion');
const activityTitle = document.getElementById('activity-title');
const characterTitle = document.getElementById('character-title');
const progressText = document.getElementById('progress-text');
const problemTextContainer = document.getElementById('problem-text-container');
const problemVisualContainer = document.getElementById('problem-visual-container');
const optionsContainer = document.getElementById('options-container');
const resultsTitle = document.getElementById('results-title');
const resultsSummary = document.getElementById('results-summary');
const resultsDetails = document.getElementById('results-details');
const retryButton = document.getElementById('retry-button');
const pdfButton = document.getElementById('pdf-button');
const loadingSpinner = document.getElementById('loading-spinner');
const loadingText = document.getElementById('loading-text');
const stardustContainer = document.getElementById('stardust-container');
const characterImgActivity = document.getElementById('character-img-activity');
const characterImgResult = document.getElementById('character-img-result');
const characterLoaderResult = document.getElementById('character-loader-result');
const finalCharacterContainer = document.getElementById('final-character-container');
const evaluationLevel = document.getElementById('evaluation-level');
const evaluationText = document.getElementById('evaluation-text');
const feedbackLoader = document.getElementById('feedback-loader');
const similarQuestionModal = document.getElementById('similar-question-modal');
const closeModalButton = document.getElementById('close-modal-button');
const similarQuestionContainer = document.getElementById('similar-question-container');

// --- THEME & NAVIGATION ---
function applyTheme(gameType) {
    document.body.className = `min-h-screen flex items-center justify-center p-4 theme-${gameType}`;
}

function navigateTo(screenId) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    if (screens[screenId]) screens[screenId].classList.remove('hidden');
    currentScreen = screenId;
}

// --- ANIMATIONS ---
function playStardustAnimation() {
    stardustContainer.innerHTML = '';
    stardustContainer.classList.remove('hidden');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * -20}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        const duration = Math.random() * 2 + 1.5;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${Math.random() * 1}s`;
        stardustContainer.appendChild(star);
    }
    setTimeout(() => {
        stardustContainer.classList.add('hidden');
    }, 2500);
}

// --- CHARACTER IMAGE DOWNLOAD ---
function downloadCharacterImage() {
    if (!characterImgResult.src || characterImgResult.src.startsWith('https://placehold.co')) {
        alert("생성된 이미지가 없어 다운로드할 수 없습니다.");
        return;
    }
    const link = document.createElement('a');
    link.href = characterImgResult.src;
    link.download = `${nickname}_${currentGameType}_캐릭터.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- API & IMAGE GENERATION HELPERS ---
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                if (response.status === 429 || response.status >= 500) {
                   throw new Error(`API Error with status ${response.status}, retrying...`);
                }
                // Do not retry on other client-side errors (like 400 Bad Request)
                return response; 
            }
            return response;
        } catch (error) {
            if (i < retries - 1) {
                console.warn(error.message);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2; // Exponential backoff
            } else {
                console.error("All retry attempts failed.");
                throw error;
            }
        }
    }
}

async function callGenerativeApi(endpoint, payload) {
    if (!checkApiKey()) {
        const isVercel = window.location.hostname.includes('vercel.app');
        const errorMessage = isVercel 
            ? "API 키가 설정되지 않았습니다.\n\nVercel 배포 시:\n1. Vercel 대시보드 > Settings > Environment Variables\n2. GEMINI_API_KEY 추가\n3. Google AI Studio API 키 입력\n4. 재배포\n\n로컬 개발 시:\n1. https://aistudio.google.com/app/apikey 방문\n2. API 키 발급\n3. script.js 파일의 GEMINI_API_KEY 변수에 입력"
            : "API 키가 설정되지 않았습니다.\n\nAPI 키 발급 방법:\n1. https://aistudio.google.com/app/apikey 방문\n2. 'Create API Key' 클릭\n3. 발급받은 키를 script.js 파일의 GEMINI_API_KEY 변수에 입력";
        throw new Error(errorMessage);
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${endpoint}?key=${GEMINI_API_KEY}`;
     const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Response Error:", errorBody);
        throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
}

async function generateBaseCharacterImage() {
    try {
        const genderText = characterGender === 'female' ? 'girl' : 'boy';
        let userPrompt = '';
        
        switch (currentGameType) {
            case 'spell':
                characterTitle.textContent = "나의 마법사";
                userPrompt = `A cute, simple apprentice wizard ${genderText} character, wearing simple, plain, drab brown clothes, looking like a brand new student. Full body, simple cartoon style, clean white background, facing forward.`;
                break;
            case 'drawing':
                characterTitle.textContent = "나의 마법학자";
                userPrompt = `A cute, simple apprentice magic scholar ${genderText} character, wearing simple, plain, drab brown clothes, holding a simple thin notebook. Full body, simple cartoon style, clean white background, facing forward.`;
                break;
            case 'potion':
                characterTitle.textContent = "나의 연금술사";
                userPrompt = `A cute, simple apprentice alchemist ${genderText} character, wearing a simple, plain, drab brown apron over simple clothes. Full body, simple cartoon style, clean white background, facing forward.`;
                break;
        }
        
        const payload = {
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { responseModalities: ['IMAGE'] },
        };
        const result = await callGenerativeApi('gemini-pro:generateContent', payload);
        baseCharacterData = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

        if (!baseCharacterData) throw new Error('API 응답에서 이미지 데이터를 찾을 수 없습니다.');
        const imageUrl = `data:image/png;base64,${baseCharacterData}`;
        characterImgActivity.src = imageUrl;
    } catch (error) {
        console.error("기본 캐릭터 생성 실패:", error);
         characterImgActivity.src = 'https://placehold.co/192x288/0c0a1a/f0f0f0?text=Error';
        
        // 사용자에게 더 친화적인 오류 메시지 표시
        if (error.message.includes("API 키")) {
            alert(`API 키 오류: ${error.message}`);
        } else {
            alert(`캐릭터 생성에 실패했습니다. 잠시 후 다시 시도해주세요.\n\n오류: ${error.message}`);
        }
    }
}

async function generateFinalCharacterImage(finalScore) {
    finalCharacterContainer.classList.remove('can-download');
    finalCharacterContainer.title = '';
    try {
        if (!baseCharacterData) throw new Error("기본 캐릭터 이미지가 없습니다.");

        const equipmentPrompts = {
            spell: [
                "wearing simple, plain, drab brown clothes.", // 0점
                "change the drab clothes to a simple but clean purple apprentice robe.", // 1점
                "wearing a clean purple robe and a pointy wizard hat.", // 2점
                "wearing a purple robe, a pointy hat, and holding a simple wooden magic wand.", // 3점
                "wearing an ornate purple robe with gold trim, a pointy hat, and holding a magic wand that is glowing brightly with yellow light.", // 4점
                "wearing a magnificent, ornate purple robe with gold trim, a pointy hat, holding a brightly glowing magic wand, with magical energy swirling around their feet and a magical wooden broom floating next to them." // 5점
            ],
            drawing: [
                "wearing simple, plain, drab brown clothes, holding a simple thin notebook.",
                "change the drab clothes to a simple but clean blue scholar's robe and upgrade the thin notebook to a proper book.",
                "wearing a clean blue robe and glasses, holding a proper book.",
                "wearing a blue scholar's robe and glasses, holding a thick, ancient-looking book.",
                "wearing an ornate blue scholar's robe, glasses, holding an ancient tome, with a magical quill floating in the air.",
                "wearing a magnificent, ornate blue robe, glasses, holding an ancient tome that is open and glowing, with a floating quill, and magical symbols hovering around them."
            ],
            potion: [
                "wearing a simple, plain, drab brown apron over simple clothes.",
                "change the drab apron to a clean, green alchemist's apron over a simple robe.",
                "wearing a green alchemist's apron and protective goggles on their forehead.",
                "wearing a green apron, protective goggles, and holding a single bubbling potion.",
                "wearing a sturdy leather apron with pockets, protective goggles, holding a glowing potion, with complex glassware bubbling in the background.",
                "wearing a magnificent leather apron with many tools, protective goggles, holding a brightly glowing potion, with complex glassware bubbling, and wisps of green magical smoke swirling around their feet."
            ]
        };

        const equipmentPrompt = `Using the provided image as a base, ${equipmentPrompts[currentGameType][finalScore] || ''} Maintain the original art style and character.`;
        const payload = {
            contents: [{
                parts: [
                    { text: equipmentPrompt },
                    { inlineData: { mimeType: "image/png", data: baseCharacterData } }
                ]
            }],
            generationConfig: { responseModalities: ['IMAGE'] },
        };
        
        const result = await callGenerativeApi('gemini-pro:generateContent', payload);
        const finalImageData = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
        if (!finalImageData) throw new Error('API 응답에서 최종 이미지 데이터를 찾을 수 없습니다.');

        const imageUrl = `data:image/png;base64,${finalImageData}`;
        characterImgResult.src = imageUrl;
        finalCharacterContainer.classList.add('can-download');
        finalCharacterContainer.title = '클릭해서 캐릭터 이미지 저장하기';

    } catch (error) {
        console.error("최종 캐릭터 생성 실패:", error);
        characterImgResult.src = characterImgActivity.src; // 실패 시 기본 이미지로 대체
    }
}

async function getPersonalizedFeedback(finalScore) {
    try {
        const incorrectProblems = questions.map((q, i) => ({ ...q, userAnswer: userAnswers[i] })).filter((q, i) => {
         if (currentGameType === 'drawing') {
             return userAnswers[i] && JSON.stringify(userAnswers[i]) !== JSON.stringify(q.answer);
         }
            return userAnswers[i] !== q.answer;
     });
     
     let promptContent;
     const baseInstruction = `
            You are a kind and encouraging elementary school teacher in Korea.
            A 4th-grade student named '${nickname}' has just finished a 5-question quiz.
        The student's final score is ${finalScore} out of 5.
            Based on the student's score and the specific problems they got wrong (if any), please provide personalized feedback.
            Your feedback must be in Korean.
        Your feedback should include:
            1. A title for the feedback using the format: '레벨 (칭호)'. For example: '상 (최고 마법사)', '중 (우수 마법사)', '하 (견습 마법사)'.
            2. A summary of their performance, addressing them by their nickname.
            3. An analysis of the types of mistakes they made (if any), explained simply.
            4. Specific, actionable advice on what to review or practice next.
            Please respond in a valid JSON format with two keys: "level" (string) and "feedback" (string).
     `;

     if (incorrectProblems.length === 0) {
         promptContent = `
                The student got a perfect score of 5 out of 5.
            Please provide a congratulatory message with the title '상 (최고 마법사)'.
            ${baseInstruction}
         `;
     } else {
            const problemType = {
                spell: "숫자 배열에서 규칙 찾기",
                drawing: "도형과 그림에서 규칙 찾기",
                potion: "양팔 저울을 이용해 식 만들기"
            }[currentGameType];
         promptContent = `
                The quiz was about '${problemType}'.
            Here are the problems the student got wrong:
                ${JSON.stringify(incorrectProblems.map(({ problem, userAnswer, answer, explanation }) => ({ problem, userAnswer, answer, explanation })), null, 2)}
            ${baseInstruction}
         `;
     }

     const payload = {
        contents: [{ parts: [{ text: promptContent }] }],
        generationConfig: {
            responseMimeType: "application/json",
            }
        };

        const result = await callGenerativeApi('gemini-pro:generateContent', payload);
        const jsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("개인화 피드백 생성 오류:", error);
        return { level: "분석 오류", feedback: "AI 선생님이 잠시 마법을 잃었어요. 해설을 보며 직접 확인해 주세요!" };
    }
}


// --- UI & GAME LOGIC ---
function getQuestionsForGame() {
    const gameQuestions = [];
    const types = Object.keys(questionBank[currentGameType]);
    const difficultyOrder = ['하', '중', '중', '중', '상'];

    // 각 타입별로 원하는 난이도의 문제를 하나씩 선택
    difficultyOrder.forEach((difficulty, index) => {
        const typeKey = types[index % types.length]; // 타입이 5개 미만일 경우 순환
        const typeQuestions = questionBank[currentGameType][typeKey];
        const pool = typeQuestions.filter(q => q.difficulty === difficulty);
        
            const usedIds = gameQuestions.map(q => q.id);
        let availablePool = pool.filter(q => !usedIds.includes(q.id));

        if (availablePool.length === 0) {
             availablePool = pool; // 이미 쓴 문제라도 다시 사용 (문제 부족 대비)
        }
        
        if (availablePool.length > 0) {
                const randomIndex = Math.floor(Math.random() * availablePool.length);
                gameQuestions.push(availablePool[randomIndex]);
        }
    });

    // 만약 5문제가 채워지지 않았다면, 중 난이도로 채움
    while (gameQuestions.length < 5) {
        const randomTypeKey = types[Math.floor(Math.random() * types.length)];
        const pool = questionBank[currentGameType][randomTypeKey].filter(q => q.difficulty === '중' && !gameQuestions.some(gq => gq.id === q.id));
        if (pool.length > 0) {
            gameQuestions.push(pool[Math.floor(Math.random() * pool.length)]);
        } else { // 그래도 없으면 아무거나 추가
             const allQuestions = Object.values(questionBank[currentGameType]).flat();
             const unusedQuestions = allQuestions.filter(q => !gameQuestions.some(gq => gq.id === q.id));
             if (unusedQuestions.length > 0) gameQuestions.push(unusedQuestions[0]);
             else break; // 더 이상 추가할 문제가 없음
        }
    }
    return gameQuestions.slice(0, 5); // 5개로 자르기
}


function createShapeElement(shapeData, sizeClass = 'w-16 h-16') {
    const shapeContainer = document.createElement('div');
    shapeContainer.className = `${sizeClass} flex items-center justify-center p-1`;
    if (!shapeData) return shapeContainer;

    const colorMap = { red: '#ef4444', blue: '#3b82f6', yellow: '#facc15', green: '#22c55e' };

    const createSingleShape = (s) => {
        const fillColor = colorMap[s.color] || '#9ca3af';
        const rotation = s.rotation || 0;
        let scaleX = 1;
        let scaleY = 1;
        if (s.reflection === 'horizontal') scaleX = -1;
        if (s.reflection === 'vertical') scaleY = -1;
        
        const transform = `rotate(${rotation}) scale(${scaleX}, ${scaleY})`;
        let svg = '';

        switch (s.shape) {
            case 'circle': svg = `<circle cx="50" cy="50" r="45" fill="${fillColor}" />`; break;
            case 'square': svg = `<rect x="5" y="5" width="90" height="90" fill="${fillColor}" />`; break;
            case 'triangle': svg = `<polygon points="50,5 95,95 5,95" fill="${fillColor}" />`; break;
            case 'star': svg = `<polygon points="50,5 61,40 98,40 68,62 79,96 50,75 21,96 32,62 2,40 39,40" fill="${fillColor}" />`; break;
            case 'L': svg = `<polygon points="10,10 40,10 40,90 10,90 10,60 10,10" fill="${fillColor}" />`; break;
            case 'F': svg = `<polygon points="10,10 90,10 90,30 40,30 40,50 70,50 70,70 40,70 40,90 10,90" fill="${fillColor}" />`; break;
            case 'R': svg = `<path d="M20 10 H 80 Q 100 10, 100 40 V 60 H 50 L 100 90 L 50 90 V 10 H 20 Z" fill="${fillColor}" />`; break;
            case 'arrow': svg = `<polygon points="50,5 95,50 65,50 65,95 35,95 35,50 5,50" fill="${fillColor}" />`; break;
            case 'square_with_circle':
                 svg = `<rect x="5" y="5" width="90" height="90" fill="${colorMap[s.outer_color]}" /><circle cx="50" cy="50" r="25" fill="${colorMap[s.inner_color]}" />`;
                 break;
            case 'circle_with_square':
                 svg = `<circle cx="50" cy="50" r="45" fill="${colorMap[s.outer_color]}" /><rect x="25" y="25" width="50" height="50" fill="${colorMap[s.inner_color]}" />`;
                 break;
            default: svg = `<text x="50" y="60" font-size="40" text-anchor="middle" fill="white">?</text>`; break;
        }
        return `<svg viewBox="0 0 100 100" style="transform-origin: center; transform: ${transform};">${svg}</svg>`;
    };
    
    let content = '';
    if (Array.isArray(shapeData)) {
        if (Array.isArray(shapeData[0])) { // 2D grid
            shapeData.forEach(row => {
                content += `<div class="flex">`;
                row.forEach(cell => {
                    content += `<div class="w-8 h-8">${createSingleShape(cell)}</div>`;
                });
                content += `</div>`;
            });
        } else { // 1D array
            content += `<div class="flex flex-wrap justify-center items-center gap-1">`;
            shapeData.forEach(s => {
                content += `<div class="w-8 h-8">${createSingleShape(s)}</div>`;
            });
            content += `</div>`;
         }
    } else { // Single object
        content = createSingleShape(shapeData);
    }
    shapeContainer.innerHTML = content;
    return shapeContainer;
}

function createScaleElement(leftItems, rightItems) {
    const scaleContainer = document.createElement('div');
    scaleContainer.className = 'w-full flex flex-col items-center';
    
    const createSide = (items) => {
        let content = '';
        items.forEach(item => {
            content += `<div class="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">${item}</div>`;
        });
        return `<div class="w-32 h-24 border-2 border-yellow-300 bg-black bg-opacity-30 rounded-lg flex flex-wrap items-center justify-center gap-2 p-2">${content}</div>`;
    };
    
    scaleContainer.innerHTML = `
        <div class="flex items-center justify-center gap-4">
            ${createSide(leftItems)}
            <div class="text-4xl font-bold text-yellow-300">=</div>
            ${createSide(rightItems)}
        </div>
        <div class="w-4/5 h-2 bg-yellow-600 mt-2"></div>
        <div class="w-2 h-8 bg-yellow-600"></div>
    `;
    return scaleContainer;
}

async function startGame(gameType) {
    if (!checkApiKey()) {
        const isVercel = window.location.hostname.includes('vercel.app');
        const errorMessage = isVercel 
            ? "API 키가 설정되지 않았습니다.\n\nVercel 배포 시:\n1. Vercel 대시보드 > Settings > Environment Variables\n2. GEMINI_API_KEY 추가\n3. Google AI Studio API 키 입력\n4. 재배포\n\n로컬 개발 시:\n1. https://aistudio.google.com/app/apikey 방문\n2. API 키 발급\n3. script.js 파일의 GEMINI_API_KEY 변수에 입력"
            : "API 키가 설정되지 않았습니다.\n\nAPI 키 발급 방법:\n1. https://aistudio.google.com/app/apikey 방문\n2. 'Create API Key' 클릭\n3. 발급받은 키를 script.js 파일의 GEMINI_API_KEY 변수에 입력\n\nAPI 키를 설정한 후 페이지를 새로고침해주세요.";
        alert(errorMessage);
        return;
    }
    playStardustAnimation();
    currentGameType = gameType;
    applyTheme(gameType);
    navigateTo('activity');
    
    const titles = { spell: '마법 주문 완성하기', drawing: '마법진 그리기', potion: '균형의 물약 만들기' };
    activityTitle.textContent = titles[gameType];
    
    await resetGame();

    questions = getQuestionsForGame();
    if (questions.length < 5) {
        console.error("문제 생성 실패:", questions);
        alert("문제를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
        navigateTo('selection');
        return;
    }
    
    console.log("생성된 문제들:", questions.map(q => ({ id: q.id, difficulty: q.difficulty })));
    renderQuestion();
}

async function resetGame() {
    questions = [];
    userAnswers = [];
    currentQuestionIndex = 0;
    score = 0;
    baseCharacterData = null;
    progressText.textContent = `1/5`;
    problemTextContainer.innerHTML = '';
    problemVisualContainer.innerHTML = '';
    optionsContainer.innerHTML = '';

    loadingText.textContent = '기본 마법사를 만들고 있어요...';
    loadingSpinner.classList.remove('hidden');
    await generateBaseCharacterImage();
    loadingSpinner.classList.add('hidden');
}

function renderQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    const q = questions[currentQuestionIndex];
    
    if (!q) {
        console.error("문제가 정의되지 않음:", currentQuestionIndex, questions);
        showResults();
        return;
    }
    
    progressText.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
    problemTextContainer.innerHTML = (q.problem || "").replace(/\n/g, '<br>');
    problemVisualContainer.innerHTML = '';
    optionsContainer.innerHTML = '';

    if (!q.options || !Array.isArray(q.options)) {
        console.error("문제 옵션이 없음:", q);
        showResults();
        return;
    }

    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

    if (currentGameType === 'spell' || currentGameType === 'potion') {
        if (q.left && q.right) {
            problemVisualContainer.appendChild(createScaleElement(q.left, q.right));
         }
         shuffledOptions.forEach(optionText => {
            const button = document.createElement('button');
            button.className = 'magic-button w-full py-3 px-4 text-xl';
            button.textContent = optionText;
            button.addEventListener('click', (e) => handleOptionSelect(optionText, e.currentTarget));
            optionsContainer.appendChild(button);
        });
    } else if (currentGameType === 'drawing') {
        const patternContainer = document.createElement('div');
        patternContainer.className = 'flex justify-center items-center gap-2 flex-wrap';
        if (q.pattern) {
             q.pattern.forEach(patternPart => {
                patternContainer.appendChild(createShapeElement(patternPart, 'w-12 h-12'));
             });
         }
        patternContainer.innerHTML += `<div class="w-12 h-12 flex items-center justify-center text-4xl magic-font">?</div>`;
        problemVisualContainer.appendChild(patternContainer);

        shuffledOptions.forEach(optionObj => {
            const button = document.createElement('button');
            button.className = 'drawing-option p-2 rounded-lg border-2 border-transparent hover:border-purple-400 transition-all bg-black bg-opacity-20';
            button.appendChild(createShapeElement(optionObj, 'w-20 h-20'));
            button.addEventListener('click', (e) => handleOptionSelect(optionObj, e.currentTarget));
            optionsContainer.appendChild(button);
        });
    }
}

function handleOptionSelect(selectedAnswer, selectedButton) {
    const q = questions[currentQuestionIndex];
    let isCorrect = false;

    if (currentGameType === 'drawing') {
        isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(q.answer);
    } else {
        isCorrect = selectedAnswer.toString() === q.answer.toString();
    }
    
    userAnswers.push(selectedAnswer);
    document.querySelectorAll('#options-container button').forEach(btn => btn.disabled = true);

    if (isCorrect) {
        score++;
        selectedButton.classList.add('correct-selection');
        } else {
        selectedButton.classList.add('wrong-selection');
    }

    setTimeout(() => {
        selectedButton.classList.remove('correct-selection', 'wrong-selection');
        currentQuestionIndex++;
        renderQuestion();
    }, 1500);
}

async function showResults() {
    playStardustAnimation();
    navigateTo('results');
    
    resultsTitle.textContent = `${nickname} 마법사의 결과 보고서`;
    resultsSummary.textContent = `총 ${questions.length}문제 중 ${score}문제 정답!`;
    
    characterLoaderResult.classList.remove('hidden');
    characterLoaderResult.classList.add('flex');
    feedbackLoader.style.display = 'block';
    evaluationText.textContent = 'AI 선생님이 학습 결과를 분석하고 있어요...';
    evaluationLevel.textContent = '분석 중...';

    const [_, feedbackResult] = await Promise.all([
        generateFinalCharacterImage(score),
        getPersonalizedFeedback(score)
    ]);
    
    characterLoaderResult.classList.add('hidden');
    characterLoaderResult.classList.remove('flex');
    feedbackLoader.style.display = 'none';

    evaluationLevel.textContent = feedbackResult.level;
    evaluationText.innerHTML = feedbackResult.feedback.replace(/\n/g, '<br>');
    
    renderResultDetails();
}

function renderResultDetails() {
    resultsDetails.innerHTML = '';
    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        let isCorrect = false;
        if (currentGameType === 'drawing') {
            isCorrect = userAnswer && JSON.stringify(userAnswer) === JSON.stringify(q.answer);
        } else {
            isCorrect = userAnswer === q.answer;
        }

        const detailElement = document.createElement('div');
        detailElement.className = `p-4 rounded-lg ${isCorrect ? 'correct-answer' : 'wrong-answer'}`;
        
        let problemDisplay = `<p class="mb-3 text-xl">${(q.problem || "").replace(/\n/g, '<br>')}</p>`;
            if (q.left && q.right) {
            problemDisplay += `<div class="flex justify-center my-2">${createScaleElement(q.left, q.right).innerHTML}</div>`;
        } else if (currentGameType === 'drawing' && q.pattern) {
            const patternDiv = document.createElement('div');
            patternDiv.className = 'flex flex-wrap gap-1 justify-center my-2';
            q.pattern.forEach(s => patternDiv.appendChild(createShapeElement(s, 'w-8 h-8')));
            problemDisplay += `<div class="flex justify-center items-center">${patternDiv.outerHTML} <div class="w-8 h-8 text-2xl">?</div></div>`;
        }

        const userAnswerDisplay = displayAnswer(userAnswer, currentGameType);
        const correctAnswerDisplay = displayAnswer(q.answer, currentGameType);
        
        const similarButton = isCorrect ? '' : `<button data-question-id="${q.id}" class="similar-question-button mt-2 text-sm text-yellow-400 underline">유사 문제 풀어보기</button>`;
        
        detailElement.innerHTML = `
            <p class="font-bold text-lg mb-2">📜 ${index + 1}번 문제</p>
            ${problemDisplay}
            <div class="text-base space-y-2 mt-3">
                <p><strong>나의 답:</strong> ${userAnswerDisplay || '입력 안 함'} <span class="font-bold text-xl ml-2">${isCorrect ? 'O' : 'X'}</span></p>
                ${!isCorrect ? `<p><strong>정답:</strong> ${correctAnswerDisplay}</p>` : ''}
                <details class="mt-2 cursor-pointer">
                    <summary class="font-bold text-yellow-300">자세한 풀이 보기</summary>
                    <p class="mt-2 p-3 bg-black bg-opacity-20 rounded">${q.explanation.replace(/\n/g, '<br>')}</p>
                </details>
                ${similarButton}
            </div>
        `;
        resultsDetails.appendChild(detailElement);
    });

    document.querySelectorAll('.similar-question-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const questionId = parseInt(e.target.dataset.questionId);
            showSimilarQuestion(questionId);
        });
    });
}

function displayAnswer(answer, gameType) {
    if (gameType === 'drawing') {
        const div = document.createElement('div');
        div.className = 'inline-block align-middle';
        if (answer) div.appendChild(createShapeElement(answer, 'w-8 h-8'));
        return div.outerHTML;
    }
    return answer;
}

function showSimilarQuestion(originalId) {
    const typeKey = `type${Math.floor(originalId / 100)}`;
    const originalQuestion = questionBank[currentGameType][typeKey].find(q => q.id === originalId);
    if (!originalQuestion) return;

    const allSimilar = questionBank[currentGameType][typeKey].filter(q => q.id !== originalId && q.difficulty === originalQuestion.difficulty);
    
    if (allSimilar.length === 0) {
        similarQuestionContainer.innerHTML = '<p>풀어볼 다른 유사 문제가 없어요.</p>';
    } else {
        const similarQuestion = allSimilar[Math.floor(Math.random() * allSimilar.length)];
        renderSimilarQuestion(similarQuestion);
    }
    similarQuestionModal.classList.remove('hidden');
}

function renderSimilarQuestion(q) {
    let problemDisplay, optionsDisplay;
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

    if (currentGameType === 'spell' || currentGameType === 'potion') {
        problemDisplay = `<div class="mb-4 text-lg">${(q.problem || "").replace(/\n/g, '<br>')}</div>`;
        if (q.left && q.right) {
            problemDisplay += `<div class="flex justify-center my-2">${createScaleElement(q.left, q.right).innerHTML}</div>`;
        }
        optionsDisplay = `<div class="grid grid-cols-2 gap-2 mt-4">${shuffledOptions.map(opt => `<button data-value="${opt}" class="magic-button py-2">${opt}</button>`).join('')}</div>`;
    } else { // drawing
        const patternDiv = document.createElement('div');
        patternDiv.className = 'flex flex-wrap gap-1 justify-center my-2';
        if (q.pattern) q.pattern.forEach(s => patternDiv.appendChild(createShapeElement(s, 'w-8 h-8')));
        problemDisplay = `<div class="mb-2 text-lg">${(q.problem || "").replace(/\n/g, '<br>')}</div><div class="flex justify-center items-center">${patternDiv.outerHTML} <div class="w-8 h-8 text-2xl">?</div></div>`;
        optionsDisplay = `<div class="grid grid-cols-3 gap-2 mt-4">${shuffledOptions.map(opt => `<button data-value='${JSON.stringify(opt)}' class="p-2 bg-black bg-opacity-20 rounded-lg">${createShapeElement(opt, 'w-16 h-16').innerHTML}</button>`).join('')}</div>`;
    }

    similarQuestionContainer.innerHTML = problemDisplay + optionsDisplay;
    similarQuestionContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            let selectedValue = (currentGameType === 'drawing') ? btn.dataset.value : btn.dataset.value;
            let correctAnswer = (currentGameType === 'drawing') ? JSON.stringify(q.answer) : q.answer;
            const isCorrect = selectedValue === correctAnswer;

            similarQuestionContainer.querySelectorAll('button').forEach(b => b.disabled = true);
            btn.style.background = isCorrect ? 'green' : 'red';
            
            setTimeout(() => {
                similarQuestionModal.classList.add('hidden');
            }, 1500);
        });
    });
}

// --- PDF EXPORT ---
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const content = document.getElementById('results-content');
    
    pdfButton.textContent = 'PDF 생성 중...';
    pdfButton.disabled = true;

    document.body.classList.add('pdf-export-mode');

    html2canvas(content, { 
        scale: 2,
        backgroundColor: '#0c0a1a', 
        onclone: (doc) => {
            doc.body.classList.add('pdf-export-mode');
            doc.querySelectorAll('details').forEach(detail => detail.open = true);
        }
    }).then(canvas => {
        document.body.classList.remove('pdf-export-mode');
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let heightLeft = imgHeight;
        let position = 15;
        
        const today = new Date();
        const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        pdf.setFontSize(10);
        pdf.text(`마법사: ${nickname} | 점수: ${score}/${questions.length} | 날짜: ${dateString}`, 15, 10);

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position = heightLeft - imgHeight + 15;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdf.internal.pageSize.getHeight();
        }
        
        pdf.save(`${nickname}_마법학교_결과보고서.pdf`);
    }).catch(err => {
        console.error("PDF 생성 오류:", err);
        alert("PDF를 생성하는 데 문제가 발생했습니다.");
    }).finally(() => {
        document.body.classList.remove('pdf-export-mode');
        pdfButton.textContent = '결과지 PDF로 저장하기';
        pdfButton.disabled = false;
    });
}


function validateStart() {
    const isNicknameValid = nicknameInput.value.trim().length > 0;
    const isGenderSelected = characterGender !== '';
    startButton.disabled = !(isNicknameValid && isGenderSelected);
}

// --- EVENT LISTENERS ---
function initializeEventListeners() {
nicknameInput.addEventListener('input', validateStart);

genderFemaleButton.addEventListener('click', () => {
    characterGender = 'female';
    genderFemaleButton.classList.add('selected');
    genderMaleButton.classList.remove('selected');
    validateStart();
});

genderMaleButton.addEventListener('click', () => {
    characterGender = 'male';
    genderMaleButton.classList.add('selected');
    genderFemaleButton.classList.remove('selected');
    validateStart();
});

startButton.addEventListener('click', () => {
    nickname = nicknameInput.value.trim();
    if (!startButton.disabled) {
        playStardustAnimation();
        welcomeMessage.textContent = `환영합니다, ${nickname} 마법사님!`;
        navigateTo('selection');
    }
});

nicknameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !startButton.disabled) {
        startButton.click();
    }
});

classSpellCard.addEventListener('click', () => startGame('spell'));
classDrawingCard.addEventListener('click', () => startGame('drawing'));
classPotionCard.addEventListener('click', () => startGame('potion'));

retryButton.addEventListener('click', () => {
    playStardustAnimation();
    navigateTo('selection');
});

pdfButton.addEventListener('click', generatePDF);
finalCharacterContainer.addEventListener('click', downloadCharacterImage);
closeModalButton.addEventListener('click', () => {
    similarQuestionModal.classList.add('hidden');
});
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
navigateTo('landing');
    applyTheme('spell'); // Default theme
    initializeEventListeners();
});