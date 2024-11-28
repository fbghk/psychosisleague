//! make test 중 #2
const fs = require('fs');

// JSON 데이터 읽기
const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// 첫 번째 객체의 "content" 값 추출
const data = jsonData[0].content;

// 공백 및 불필요한 부분 제거하고 리스트로 변환
const cleanedData = data.replace(/[\t\n]+/g, ' ');

// 키와 몸무게 패턴을 유지하면서 단어 리스트를 추출
const elements = cleanedData.match(/\d+cm, \d+kg|[^\s]+/g);

// 5열로 변환 (원하는 대로 설정 가능)
const numColumns = 5;
const rows = [];
for (let i = 0; i < elements.length; i += numColumns) {
    rows.push(elements.slice(i, i + numColumns));
}

// DataFrame 대신 배열of 객체로 변환
const df = rows.map(row => ({
    '등번호': row[0],
    '이름': row[1],
    '투타유형': row[2],
    '생년월일': row[3],
    '체격': row[4]
}));

// 시작과 끝 위치 탐색
const startIndex = df.findIndex(row => row['이름'] === '투수');
const endIndex = df.findIndex(row => row['이름'] === '포수');

// 시작 부분 포함, 끝 부분 제외하여 추출
const filteredDf = df.slice(startIndex, endIndex);

// JSON 파일로 저장
fs.writeFileSync('filtered_result.json', JSON.stringify(filteredDf, null, 2), 'utf8');

console.log("필터링된 JSON 파일로 저장되었습니다.");