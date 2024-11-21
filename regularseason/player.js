const puppeteer = require('puppeteer');

async function crawlKBOPlayerRegistration() {
    try {
        // 브라우저 실행
        const browser = await puppeteer.launch({
            headless: false  // 브라우저 동작을 확인하기 위해 headless: false로 설정
        });
        const page = await browser.newPage();

        // 웹사이트 접속
        await page.goto('https://www.koreabaseball.com/Player/Register.aspx');
        
        // 한화 이글스 엠블럼 클릭
        await page.waitForSelector('img[alt="한화"]');
        await page.click('img[alt="한화"]');
        
        // 달력 버튼 클릭
        await page.waitForSelector('.ui-datepicker-trigger');
        await page.click('.ui-datepicker-trigger');
        
        // 이전 달 버튼 클릭
        await page.waitForSelector('.ui-icon-circle-triangle-w');
        await page.click('.ui-icon-circle-triangle-w');
        
        // 3일 클릭
        await page.waitForSelector('a.ui-state-default');
        const dateElements = await page.$$('a.ui-state-default');
        for (const element of dateElements) {
            const text = await page.evaluate(el => el.textContent, element);
            if (text === '3') {
                await element.click();
                break;
            }
        }
        
        //! 데이터 수집을 위해 잠시 대기 (setTimeout 사용)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // .row div 안의 모든 데이터 수집
        const data = await page.evaluate(() => {
            const rows = document.querySelectorAll('.row');
            const result = [];
            
            rows.forEach(row => {
                const rowData = {
                    content: row.textContent.trim(),
                    html: row.innerHTML
                };
                result.push(rowData);
            });
            
            return result;
        });
        
        // JSON 파일로 저장
        const fs = require('fs');
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
        
        // 브라우저 종료
        await browser.close();
        
        console.log('크롤링이 완료되었습니다. data.json 파일을 확인해주세요.');
        
    } catch (error) {
        console.error('크롤링 중 오류가 발생했습니다:', error);
    }
}

// 크롤링 실행
crawlKBOPlayerRegistration();