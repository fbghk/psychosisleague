const fs = require('fs');

// 데이터 파일 불러오기
const data = fs.readFileSync('data.json', 'utf-8');

// 공백 및 불필요한 부분 제거하고 리스트로 변환
const cleanedData = data.replace(/[\t\n]+/g, ' ');

// 키와 몸무게 패턴을 유지하면서 단어 리스트를 추출
const elements = cleanedData.match(/\d+cm, \d+kg|[^\s]+/g) || [];

// 5열로 변환 (원하는 대로 설정 가능)
const numColumns = 5;
const rows = [];
for (let i = 0; i < elements.length; i += numColumns) {
  rows.push(elements.slice(i, i + numColumns));
}

// DataFrame 생성
const df = rows.map(row => ({
  '등번호': row[0],
  '이름': row[1],
  '투타유형': row[2],
  '생년월일': row[3],
  '체격': row[4]
}));

// 데이터 예시 (df는 이미 전처리된 데이터프레임이라고 가정)
const startIdx = df.findIndex(row => row['이름'] === '투수');
const endIdx = df.findIndex(row => row['이름'] === '포수');

// 시작과 끝 부분 모두 제외하여 "이름" 열만 추출
const filteredNames = df.slice(startIdx + 1, endIdx).map(row => row['이름']);

// 이름 목록을 JSON 파일로 저장
fs.writeFileSync('filtered_names.json', JSON.stringify(filteredNames, null, 2), 'utf-8');

console.log("이름 목록이 JSON 파일로 저장되었습니다.");