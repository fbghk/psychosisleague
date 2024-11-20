const puppeteer = require('puppeteer');
const fs = require('fs');

const teamMapping = [
    { name: "KIA", id: "HT" },
    { name: "삼성", id: "SS" },
    { name: "LG", id: "LG" },
    { name: "두산", id: "OB" },
    { name: "SSG", id: "SK" },
    { name: "KT", id: "KT" },
    { name: "롯데", id: "LT" },
    { name: "한화", id: "HH" },
    { name: "NC", id: "NC" },
    { name: "키움", id: "WO" }
];

async function crawlKBOPlayerRegistration() {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
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

        // 데이터 수집을 위해 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 2000));

        for (const team of teamMapping) {
            try {
                // 각 구단 링크를 찾아서 클릭
                const teamSelector = `li[data-id="${team.id}"] a`;
                await page.waitForSelector(teamSelector);
                await page.click(teamSelector);

                // 데이터 로딩 대기
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 구단 데이터 수집
                const data = await page.evaluate(() => {
                    const rows = document.querySelectorAll('#cphContents_cphContents_cphContents_udpRecord table tbody tr');
                    const result = [];
                    
                    rows.forEach(row => {
                        const columns = row.querySelectorAll('td');
                        const playerData = {
                            number: columns[0]?.textContent.trim(),
                            name: columns[1]?.textContent.trim(),
                            position: columns[2]?.textContent.trim(),
                            birth: columns[3]?.textContent.trim(),
                            status: columns[4]?.textContent.trim()
                        };
                        result.push(playerData);
                    });
                    
                    return result;
                });

                // 각 구단별로 JSON 파일로 저장
                const fileName = `${team.name}.json`;
                fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8');
                console.log(`${team.name} 구단의 데이터가 ${fileName}로 저장되었습니다.`);

            } catch (error) {
                console.error(`${team.name} 구단 데이터 수집 중 오류 발생:`, error);
                continue;
            }
        }

        await browser.close();
        console.log('크롤링이 완료되었습니다. 각 구단별 JSON 파일을 확인해주세요.');

    } catch (error) {
        console.error('크롤링 중 오류가 발생했습니다:', error);
    }
}

crawlKBOPlayerRegistration();