const puppeteer = require('puppeteer');

async function getStartingPitchers() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // KBO 경기 정보 페이지로 이동
    await page.goto('https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx');

    // 페이지에서 선발 투수 정보 가져오기
    const pitchers = await page.evaluate(() => {
      const data = [];
      
      // 각 팀 정보를 가진 div 요소들을 선택
      document.querySelectorAll('.team.away, .team.home').forEach((el) => {
          // 팀 이름은 'alt' 속성에 들어있는 값을 가져옴
          const teamName = el.querySelector('.emb img').getAttribute('alt').trim();
          
          // 해당 팀의 선발 투수 이름을 'today-pitcher' 안에서 추출
          const pitcherName = el.querySelector('.today-pitcher p').innerText.trim();
          
          // 팀과 투수 이름을 객체로 배열에 추가
          data.push({ team: teamName, pitcher: pitcherName });
      });
      
      return data;
  });
  
  console.log(pitchers); // 팀과 선발 투수 정보 출력

  await browser.close();
}

getStartingPitchers();

