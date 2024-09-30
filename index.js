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
          
          // 투수 이름에서 'before' 클래스의 텍스트는 제외하고 나머지 텍스트만 추출.
          const pitcherelement = el.querySelector('.today-pitcher p');

          // 'before' 클래스를 제외한 나머지 텍스트만 가져오기
          const pitcherName = pitcherelement.childNodes[1].nodeValue.trim();

          // 팀과 투수 이름을 객체로 배열에 추가
          data.push({ team: teamName, pitcher: pitcherName });
      });
      
      return data;
  });
  
  console.log(pitchers); // 팀과 선발 투수 정보 출력

  await browser.close();
}

getStartingPitchers();

