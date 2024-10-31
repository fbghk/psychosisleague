const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });
        
        const page = await browser.newPage();

        // KBO 홈페이지 선수 등록 현황 페이지로 이동
        await page.goto('https://www.koreabaseball.com/Player/Register.aspx', {
            waitUntil: 'networkidle2'
        });

        // '선수 등록 현황' 메뉴 클릭
        await page.waitForSelector('#lnbPlayerRegister');
        await page.click('#lnbPlayerRegister');
        
        // '한화' 구단 클릭
        await page.waitForSelector('img[alt="한화"]');
        await page.click('img[alt="한화"]');

        // 날짜 선택 캘린더 아이콘 클릭
        await page.waitForSelector('img[title="..."]');
        await page.click('img[title="..."]');
        
        // 이전 달 이동 및 날짜 선택
        await page.waitForSelector('.ui-icon.ui-icon-circle-triangle-w');
        await page.click('.ui-icon.ui-icon-circle-triangle-w');
        
        await page.waitForSelector('a.ui-state-default');
        await page.evaluate(() => {
            document.querySelectorAll('a.ui-state-default').forEach(element => {
                if (element.textContent === '3') {
                    element.click();
                }
            });
        });

        // 정보가 담긴 `.row` 태그의 모든 정보 크롤링
        await page.waitForSelector('.row');
        const playerData = await page.evaluate(() => {
            const rows = document.querySelectorAll('.row');
            const data = [];
            
            rows.forEach(row => {
                const playerInfo = {};
                
                // 각 요소에서 필요한 데이터 추출
                playerInfo.name = row.querySelector('.player-name-selector')?.textContent.trim() || '정보 없음';
                playerInfo.position = row.querySelector('.position-selector')?.textContent.trim() || '정보 없음';
                playerInfo.team = '한화';
                
                data.push(playerInfo);
            });

            return data;
        });

        // data.json 파일에 저장
        fs.writeFileSync('data.json', JSON.stringify(playerData, null, 2), 'utf-8');
        console.log('data.json 파일로 저장이 완료되었습니다.');
        
    } catch (error) {
        console.error("에러 발생:", error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
