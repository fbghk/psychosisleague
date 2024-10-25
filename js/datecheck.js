const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

async function checkNextGame() {
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
        
        // 3. 웹페이지에 표시된 날짜 가져오기
        const displayedDate = await page.evaluate(() => {
            const dateElement = document.querySelector('#lblGameDate');
            return dateElement ? dateElement.textContent : null;
        });

        // 현재 날짜와 시간 구하기
        const today = new Date();
        const currentDate = today.getFullYear() + '.' + 
                          String(today.getMonth() + 1).padStart(2, '0') + '.' + 
                          String(today.getDate()).padStart(2, '0');

        const currentTime = String(today.getHours()).padStart(2, '0') + 
                          ':' + String(today.getMinutes()).padStart(2, '0') + 
                          ':' + String(today.getSeconds()).padStart(2, '0');

        // 웹페이지 날짜 형식 처리
        const webpageDate = displayedDate ? displayedDate.split('(')[0] : null;

        console.log('='.repeat(50));
        console.log(`실행 시각: ${currentTime}`);
        console.log('웹페이지 날짜:', webpageDate);
        console.log('현재 날짜:', currentDate);


        // 날짜 비교 및 메시지 출력
        if (webpageDate === currentDate) {
            console.log(`당일 경기 일정입니다. (확인 시간: ${currentTime})`);
        } else {
            console.log(`다음날 경기 일정입니다. (확인 시간: ${currentTime})`);
        }
        
        // 4. 다음 경기 버튼 대기 및 클릭
        await page.waitForSelector('#lnkNext', { 
            timeout: 5000,
            visible: true
        });
        
        const nextButton = await page.$('#lnkNext');
        if (!nextButton) {
            throw new Error("내일 경기 버튼을 찾을 수 없습니다.");
        }
        
        // 5. 클릭 실행
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            nextButton.click()
        ]).catch(e => {
            throw new Error(`클릭 또는 페이지 전환 중 오류 발생: ${e.message}`);
        });
        
        // 6. 클릭 후 날짜 다시 확인
        const newDisplayedDate = await page.evaluate(() => {
            const dateElement = document.querySelector('#lblGameDate');
            return dateElement ? dateElement.textContent : null;
        });

        const newWebpageDate = newDisplayedDate ? newDisplayedDate.split('(')[0] : null;

        console.log('새로운 웹페이지 날짜:', newWebpageDate);
        console.log('현재 날짜:', currentDate);

        if (newWebpageDate === currentDate) {
            console.log(`당일 경기 일정입니다. (확인 시간: ${currentTime})`);
        } else {
            console.log(`다음날 경기 일정입니다. (확인 시간: ${currentTime})`);
        }
        console.log('='.repeat(50));
        
        // 디버깅용 스크린샷
        await page.screenshot({ 
            path: `kbo-result-${currentDate}-${currentTime.replace(/:/g, '-')}.png`,
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