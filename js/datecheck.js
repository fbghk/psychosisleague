const puppeteer = require('puppeteer');

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

        // 현재 날짜 구하기
        const today = new Date();
        const currentDate = today.getFullYear() + '.' + 
                          String(today.getMonth() + 1).padStart(2, '0') + '.' + 
                          String(today.getDate()).padStart(2, '0');

        // 현재 시간 구하기 (HH:MM:SS 형식)
        const currentTime = String(today.getHours()).padStart(2, '0') + 
                          ':' + String(today.getMinutes()).padStart(2, '0') + 
                          ':' + String(today.getSeconds()).padStart(2, '0');

        // 웹페이지 날짜 형식 처리 (예: "2024.10.25(금)" -> "2024.10.25")
        const webpageDate = displayedDate ? displayedDate.split('(')[0] : null;

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
        
    } catch (error) {
        console.error("에러 발생:", error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 함수 실행
checkNextGame();