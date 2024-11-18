const fs = require('fs');

// 데이터 파일 읽기
const data = fs.readFileSync('../data.json', 'utf-8');

// 정규식으로 공백과 특수 문자 제거 후 배열로 추출
const playersData = data.match(/[가-힣]+|\d+cm, \d+kg|\d{4}-\d{2}-\d{2}|우투|좌투|우타|좌타/g) || [];

// "투수"와 "포수" 사이의 데이터 필터링
const startIdx = playersData.indexOf("투수");
const endIdx = playersData.indexOf("포수");
const pitcherData = playersData.slice(startIdx + 1, endIdx);

// 각 선수의 이름만 추출하여 배열에 저장
const pitcherNames = [];
for (let i = 0; i < pitcherData.length; i += 5) {
  pitcherNames.push(pitcherData[i + 1]); // 선수 이름은 항상 두 번째 위치에 있다고 가정
}

// 이름 목록을 JSON 파일로 저장
fs.writeFileSync('filtered_pitcher_names.json', JSON.stringify(pitcherNames, null, 2), 'utf-8');

console.log("투수 이름 목록이 JSON 파일로 저장되었습니다.");