const fs = require('fs');

// 상위 디렉토리에 있는 JSON 데이터 파일 불러오기
const data = fs.readFileSync('../data.json', 'utf-8');

// 공백 및 불필요한 부분 제거
const cleanedData = data.replace(/[\t\n]+/g, ' ').replace(/\\|(\s)+/g, ' ');

// 키와 몸무게 패턴을 유지하면서 단어 리스트를 추출
const elements = cleanedData.match(/\d+cm, \d+kg|[가-힣\w]+/g) || [];

// DataFrame 형식으로 변환
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

// "투수"와 "포수" 범위의 데이터만 추출
const startIdx = df.findIndex(row => row['이름'] === '투수');
const endIdx = df.findIndex(row => row['이름'] === '포수');
const filteredNames = df
  .slice(startIdx + 1, endIdx)
  .filter(row => row['이름'] && !row['이름'].includes('감독')) // 이름이 비어있지 않고 '감독'이 포함되지 않은 경우만 필터링
  .map(row => row['이름']);

// 이름 목록을 JSON 파일로 저장
fs.writeFileSync('filtered_pitcher_names.json', JSON.stringify(filteredNames, null, 2), 'utf-8');

console.log("투수 이름 목록이 JSON 파일로 저장되었습니다.");

