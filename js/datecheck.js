const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');

//! 디렉토리 확인 및 생성 함수
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
  }
}

//! 시간 체크 함수: 20시부터 02시까지 크롤링
function isCrawlingTime() {
  const now = new Date();
  const hour = now.getHours();

  //! 20시(8PM) ~ 23시(11PM) 또는 0시(12AM) ~ 2시(2AM) 사이인 경우
  return (hour >= 19 || hour < 2);
}



async function checkNextGame() {
    //! 시간 체크 함수 사용
    if (!isCrawlingTime()) {
      console.log('현재는 크롤링 가능 시간이 아닙니다. 크롤링을 종료합니다.');
      return; // 크롤링 중단
    }

  
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: null
        });
        
        const page = await browser.newPage();
        
        // 1. KBO 메인 페이지 접속
        await page.goto('https://www.koreabaseball.com/Default.aspx', {
            waitUntil: 'networkidle0'
        });

        // 2. 모달창 처리
        try {
            await page.waitForSelector('img[alt="KBO 홈페이지 바로가기"]', {
                timeout: 5000,
                visible: true
            });
            
            await page.click('img[alt="KBO 홈페이지 바로가기"]');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (modalError) {
            console.log("모달창이 없거나 이미 닫혀있습니다:", modalError.message);
        }
        
        // 3. 웹페이지에 표시된 날짜 가져오기 (클릭 전은 생략)
        const today = new Date();
        const currentDate = today.getFullYear() + '.' + 
                          String(today.getMonth() + 1).padStart(2, '0') + '.' + 
                          String(today.getDate()).padStart(2, '0');

        const currentTime = String(today.getHours()).padStart(2, '0') + 
                          ':' + String(today.getMinutes()).padStart(2, '0') + 
                          ':' + String(today.getSeconds()).padStart(2, '0');

        console.log('='.repeat(50));
        console.log(`실행 시각: ${currentTime}`);
        
        // // 4. 다음 경기 버튼 대기 및 클릭
        // await page.waitForSelector('#lnkNext', { 
        //     timeout: 5000,
        //     visible: true
        // });
        
        // const nextButton = await page.$('#lnkNext');
        // if (!nextButton) {
        //     throw new Error("내일 경기 버튼을 찾을 수 없습니다.");
        // }
        
        // // 5. 클릭 실행
        // await Promise.all([
        //     page.waitForNavigation({ waitUntil: 'networkidle0' }),
        //     nextButton.click()
        // ]).catch(e => {
        //     throw new Error(`클릭 또는 페이지 전환 중 오류 발생: ${e.message}`);
        // });
        
        // 6. 날짜 다시 확인
        const DisplayedDate = await page.evaluate(() => {
            const dateElement = document.querySelector('#lblGameDate');
            return dateElement ? dateElement.textContent : null;
        });

        const WebpageDate = DisplayedDate ? DisplayedDate.split('(')[0] : null;

        console.log('웹페이지 날짜:', WebpageDate);
        console.log('현재 날짜:', currentDate);

        if (WebpageDate === currentDate) {
            console.log(`당일 경기 일정입니다. (확인 시간: ${currentTime})`);
        } else {
            console.log(`다음날 경기 일정입니다. (확인 시간: ${currentTime})`);
        }

        // 7. 선발 투수 정보 확인
        const pitcherInfo = await page.evaluate(() => {
            const teamElements = document.querySelectorAll('.team.away, .team.home');
            if (!teamElements.length) return null;

            const results = [];
            teamElements.forEach((teamElement) => {
                const teamNameElement = teamElement.querySelector('.emb img');
                const teamName = teamNameElement ? teamNameElement.getAttribute('alt').trim() : '팀명 없음';
                
                const pitcherElement = teamElement.querySelector('.today-pitcher p');
                let pitcherName = '투수 정보를 찾을 수 없습니다.';
                
                if (pitcherElement && pitcherElement.childNodes.length > 1) {
                    pitcherName = pitcherElement.childNodes[1].nodeValue.trim();
                }
                
                results.push({ team: teamName, pitcher: pitcherName });
            });
            
            return results;
        });

        // 8. 정보가 없으면 콘솔에 로그 출력
        if (!pitcherInfo || pitcherInfo.length === 0) {
            console.log(`[${currentTime}] 투수 정보가 없습니다.`);
        } else {
            // 9. 선발 투수 정보가 있으면 팀명과 투수 이름, 크롤링된 시간을 출력
            pitcherInfo.forEach((info) => {
                console.log(`[${currentTime}] 소속팀: ${info.team}, 선발투수: ${info.pitcher}`);
            });
            
            //! JSON 파일 저장 경로
            const jsonDir = path.join(__dirname, 'json');
            ensureDirectoryExists(jsonDir);
            
            //! 현재 시간별로 JSON 파일 저장
            fs.writeFileSync(path.join(jsonDir, `pitcher_info_${currentDate}_${currentTime.replace(/:/g, '-')}.json`), JSON.stringify({
              time: currentTime,
              pitchers: pitcherInfo
            }, null, 2), 'utf-8');
        }

        console.log('='.repeat(50));

        //! 10. 스크린샷 저장 경로
        const screenshotDir = path.join(__dirname, 'screenshot');
        ensureDirectoryExists(screenshotDir);

        // 디버깅용 스크린샷
        await page.screenshot({ 
            path: path.join(screenshotDir, `kbo-result-${currentDate}-${currentTime.replace(/:/g, '-')}.png`),
            fullPage: true
        });
        
    } catch (error) {
        console.error("에러 발생:", error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 스케줄러 설정
function startScheduler() {
    // 프로그램 시작 시 즉시 한 번 실행
    checkNextGame();
    
    // 매 15분마다 실행 (0, 15, 30, 45분)
    const job = schedule.scheduleJob('*/15 * * * *', function() {
        console.log('\n새로운 체크 시작...');
        checkNextGame();
    });
    
    console.log('스케줄러가 시작되었습니다. 15분마다 실행됩니다.');
    console.log('프로그램을 종료하려면 Ctrl+C를 누르세요.');
}

// 스케줄러 시작
startScheduler();

// 프로세스 종료 처리
process.on('SIGINT', function() {
    console.log('프로그램을 종료합니다...');
    process.exit();
});
