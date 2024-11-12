const puppeteer = require('puppeteer');
const fs = require('fs');

const teams = [
    "KIA", "삼성", "LG", "두산", "SSG",
    "KT", "롯데", "한화", "NC", "키움"
];

async function crawlKBOPlayerRegistration() {
    try {
        // 브라우저 실행
        const browser = await puppeteer.launch({
            headless: false  // 브라우저 동작을 확인하기 위해 headless: false로 설정
        });
        const page = await browser.newPage();

        // 웹사이트 접속
        await page.goto('https://www.koreabaseball.com/Player/Register.aspx');
        
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

        for (const team of teams) {
            // 각 구단 엠블럼 클릭
            await page.waitForSelector(`img[alt="${team}"]`);
            await page.click(`img[alt="${team}"]`);
            
            // 구단 데이터 수집
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

            // 각 구단별로 JSON 파일로 저장
            const fileName = `${team}.json`;
            fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8');
            console.log(`${team} 구단의 데이터가 ${fileName}로 저장되었습니다.`);
            
            // 구단 목록 페이지로 돌아가기
            await page.goto('https://www.koreabaseball.com/Player/Register.aspx');
            
            // 달력 클릭 후 다시 날짜 선택
            await page.waitForSelector('.ui-datepicker-trigger');
            await page.click('.ui-datepicker-trigger');
            await page.click('.ui-icon-circle-triangle-w');
            const dateElements2 = await page.$$('a.ui-state-default');
            for (const element of dateElements2) {
                const text = await page.evaluate(el => el.textContent, element);
                if (text === '3') {
                    await element.click();
                    break;
                }
            }
            
            // 잠시 대기 (구단마다 데이터가 다르므로)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // 브라우저 종료
        await browser.close();
        
        console.log('크롤링이 완료되었습니다. 각 구단별 JSON 파일을 확인해주세요.');
        
    } catch (error) {
        console.error('크롤링 중 오류가 발생했습니다:', error);
    }
}

// 크롤링 실행
crawlKBOPlayerRegistration();
