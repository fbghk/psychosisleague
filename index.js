const fs = require('fs');
const puppeteer = require('puppeteer');

async function getStartingPitchers() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // KBO 경기 정보 페이지로 이동
    await page.goto('https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx');

    // 페이지에서 선발 투수 정보 가져오기
    const data = await page.evaluate(() => {
      const results = [];
  
      // 경기 날짜를 가져옴
      const gameDate = document.querySelector('#lblGameDate').innerText.trim();
  
      // 각 팀 정보를 가진 div 요소들을 선택
      document.querySelectorAll('.team.away, .team.home').forEach((teamElement) => {
          // 팀 이름을 'alt' 속성에서 가져옴
          const teamName = teamElement.querySelector('.emb img').getAttribute('alt').trim();
  
          // 투수 이름에서 'before' 클래스를 제외한 나머지 텍스트만 추출
          const pitcherElement = teamElement.querySelector('.today-pitcher p');
          const pitcherName = pitcherElement.childNodes[1].nodeValue.trim();
  
          // 팀과 투수 이름, 경기 날짜를 객체로 배열에 추가
          results.push({ team: teamName, pitcher: pitcherName });
      });
  
      return { date: gameDate, starting : results };
  });
  
  console.log(data); // 경기 날짜, 팀, 선발 투수 정보 출력

  await browser.close();

  //! 데이터를 JSON 파일로 저장
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');

} 

getStartingPitchers();