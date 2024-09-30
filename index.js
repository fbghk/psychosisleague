const puppeteer = require('puppeteer');

async function getStartingPitchers() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // KBO 경기 정보 페이지로 이동
    await page.goto('https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx');

    // 페이지에서 선발 투수 정보 가져오기
    const pitchers = await page.evaluate(() => {
      const data = [];
      // .today-pitcher 클래스를 가진 요소들을 모두 선택
      document.querySelectorAll('.today-pitcher').forEach((el) => {
          // .today-pitcher 안의 p 태그 내 텍스트 (투수 이름) 추출
          const pitcherName = el.querySelector('p').innerText.trim();
          data.push({ pitcher: pitcherName });
      });
      return data;
  });
  
  console.log(pitchers); // 선발 투수 정보 출력

  await browser.close();
}

getStartingPitchers();