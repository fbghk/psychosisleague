import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx');

    const data = await page.evaluate(() => {
      const results = [];
      const gameDateElement = document.querySelector('#lblGameDate');
      
      // 날짜 요소가 있는지 확인
      const gameDate = gameDateElement ? gameDateElement.innerText.trim() : '날짜를 찾을 수 없습니다';
  
      document.querySelectorAll('.team.away, .team.home').forEach((teamElement) => {
          // 팀 이름을 'alt' 속성에서 가져옴
          const teamName = teamElement.querySelector('.emb img')?.getAttribute('alt')?.trim() || '팀명을 찾을 수 없습니다';
  
          // 투수 요소가 있는지 확인
          const pitcherElement = teamElement.querySelector('.today-pitcher p');
          let pitcherName = '투수 정보를 찾을 수 없습니다';
          
          // 투수 요소가 존재하는 경우에만 텍스트 추출
          if (pitcherElement && pitcherElement.childNodes.length > 1) {
              pitcherName = pitcherElement.childNodes[1].nodeValue.trim();
          }
  
          results.push({ team: teamName, pitcher: pitcherName });
      });
  
      return { date: gameDate, starting: results };
  });  

    await browser.close();

    res.status(200).json(data);
}
