const puppeteer = require('puppeteer');

async function getStartingPitchers() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // KBO 경기 정보 페이지로 이동
    await page.goto('https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx');

    // 페이지에서 선발 투수 정보 가져오기
    const pitchers = await page.evaluate(() => {
        const data = [];
        // DOM 요소에서 선발 투수 정보를 추출
        document.querySelectorAll('.starting-pitcher').forEach((el) => {
            const team = el.querySelector('.team-name').innerText.trim();
            const pitcher = el.querySelector('.pitcher-name').innerText.trim();
            data.push({ team, pitcher });
        });
        return data;
    });

    console.log(pitchers); // 선발 투수 정보 출력

    await browser.close();
}

getStartingPitchers();
