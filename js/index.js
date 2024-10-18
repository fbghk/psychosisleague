const fs = require('fs');
const puppeteer = require('puppeteer');

async function getStartingPitchers() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // KBO 경기 정보 페이지로 이동
    await page.goto('https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx');

    //! 오늘 날짜 가져오기 (형식: yyyy.MM.dd(요일))
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);  // 월을 두 자릿수로 변환
    const day = ('0' + today.getDate()).slice(-2);  // 일을 두 자릿수로 변환
    const formattedToday = `${year}.${month}.${day}`;

    // 페이지에서 선발 투수 정보 가져오기
    const data = await page.evaluate(() => {
      const results = [];
      // 경기 날짜를 가져옴
      const gameDateElement = document.querySelector('#lblGameDate');

      // 날짜 요소가 있는지 확인
      const gameDate = gameDateElement ? gameDateElement.innerText.trim() : '날짜를 찾을 수 없습니다.';
  
      // 각 팀 정보를 가진 div 요소들을 선택
      document.querySelectorAll('.team.away, .team.home').forEach((teamElement) => {
          // 팀 이름을 'alt' 속성에서 가져옴
          const teamName = teamElement.querySelector('.emb img').getAttribute('alt').trim() || '팀명을 찾을 수 없습니다.';
  
          // 투수 이름에서 'before' 클래스를 제외한 나머지 텍스트만 추출
          const pitcherElement = teamElement.querySelector('.today-pitcher p');
          let pitcherName = '투수 정보를 찾을 수 없습니다.';
          
          // 투수 요소가 존재하는 경우에만 텍스트 추출
          if (pitcherElement && pitcherElement.childNodes.length > 1){
            pitcherName = pitcherElement.childNodes[1].nodeValue.trim();
          }
  
          // 팀과 투수 이름, 경기 날짜를 객체로 배열에 추가
          results.push({ team: teamName, pitcher: pitcherName });
      });
  
      return { date: gameDate, starting : results };
  });

  await browser.close();

  //! 크롤링한 경기 날짜가 오늘 날짜와 일치하는지 확인
  if (data.date && data.date.startsWith(formattedToday)) {
    console.log(data); // 경기 정보 출력
  } else {
    console.log("금일 진행 예정인 경기가 없습니다."); // 날짜가 맞지 않으면 메시지만 출력
  }


  // 데이터를 JSON 파일로 저장
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');

} 

getStartingPitchers();