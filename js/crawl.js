const puppeteer = require('puppeteer');

async function crawlKBOGameSchedule() {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });
        const page = await browser.newPage();

        // 웹사이트 접속
        await page.goto('https://www.koreabaseball.com/Default.aspx');
        
        // KBO 정규시즌 탭 클릭
        await page.waitForSelector('#leagueRegular');
        await page.click('#leagueRegular');
        
        // 달력 버튼 클릭
        await page.waitForSelector('.ui-datepicker-trigger');
        await page.click('.ui-datepicker-trigger');
        
        // 월 선택 드롭다운 클릭 및 6월 선택
        await page.waitForSelector('.ui-datepicker-month');
        await page.select('.ui-datepicker-month', '5'); // 6월은 value가 5
        
        // 5일 클릭
        await page.waitForSelector('a.ui-state-default');
        const dateElements = await page.$$('a.ui-state-default');
        for (const element of dateElements) {
            const text = await page.evaluate(el => el.textContent, element);
            if (text === '5') {
                await element.click();
                break;
            }
        }

        // 데이터가 로드될 때까지 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 경기 정보 수집
        const games = await page.evaluate(() => {
            const gameWraps = document.querySelectorAll('.wrap');
            if (!gameWraps) return [];

            const games = [];

            gameWraps.forEach(wrap => {
                // 경기장과 시간 정보
                const topInfo = wrap.querySelector('.top ul');
                const stadium = topInfo ? topInfo.querySelector('li:first-child').textContent.trim() : '정보없음';
                const time = topInfo ? topInfo.querySelector('li:last-child').textContent.trim() : '정보없음';

                //! // 경기 상태
                // const status = wrap.querySelector('.middle .staus') ? 
                //     wrap.querySelector('.middle .staus').textContent.trim() : '정보없음';

                // 팀 정보
                const info = wrap.querySelector('.info');
                
                // 원정팀 정보
                const awayTeam = info.querySelector('.team.away .emb img').getAttribute('alt');

                const awayPitcherElement = info.querySelector('.team.away .today-pitcher p');
                const awayPitcher = awayPitcherElement ? {
                    name: awayPitcherElement.textContent.replace(/승|패|세/g, '').trim(),
                    result: awayPitcherElement.querySelector('span') ? 
                        awayPitcherElement.querySelector('span').textContent.trim() : ''
                } : { name: '정보없음', result: '' };

                // 홈팀 정보
                const homeTeam = info.querySelector('.team.home .emb img').getAttribute('alt');

                const homePitcherElements = info.querySelectorAll('.team.home .today-pitcher p');
                const homePitchers = Array.from(homePitcherElements).map(p => ({
                    name: p.textContent.replace(/승|패|세/g, '').trim(),
                    result: p.querySelector('span') ? 
                        p.querySelector('span').textContent.trim() : ''
                }));

                const gameInfo = {
                    stadium,
                    time,

                    awayTeam,

                    awayPitcher,
                    homeTeam,

                    homePitchers
                };

                games.push(gameInfo);
            });

            return games;
        });

        // 결과를 JSON 파일로 저장
        const fs = require('fs');
        fs.writeFileSync('kbo_games.json', JSON.stringify(games, null, 2), 'utf-8');

        console.log('크롤링된 경기 정보:', games);
        console.log('크롤링이 완료되었습니다. kbo_games.json 파일을 확인해주세요.');

        // 브라우저 종료
        await browser.close();

    } catch (error) {
        console.error('크롤링 중 오류가 발생했습니다:', error);
    }
}

// 크롤링 실행
crawlKBOGameSchedule();