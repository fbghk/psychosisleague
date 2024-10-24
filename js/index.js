const fs = require('fs');
const puppeteer = require('puppeteer');

async function getStartingPitchers() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // KBO 경기 정보 페이지로 이동
    await page.goto('https://www.koreabaseball.com/Default.aspx');

    // 오늘 날짜 가져오기 (형식: yyyy.MM.dd(요일))
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);  // 월을 두 자릿수로 변환
    const day = ('0' + today.getDate()).slice(-2);  // 일을 두 자릿수로 변환
    const formattedToday = `${year}.${month}.${day}`;

    // 경기 날짜를 먼저 확인
    const gameDate = await page.evaluate(() => {
        const gameDateElement = document.querySelector('#lblGameDate');
        return gameDateElement ? gameDateElement.innerText.trim() : null;
    });

    // 경기 날짜가 오늘 날짜와 일치하지 않으면 크롤링 중단하고 메시지를 출력
    if (!gameDate || !gameDate.startsWith(formattedToday)) {
        const noGameData = { message: "금일 진행 예정인 경기가 없습니다." };
        fs.writeFileSync('data.json', JSON.stringify(noGameData, null, 2), 'utf-8');
        await browser.close();
        return;  // 크롤링 중단
    }

    // 경기 취소 여부 확인 (우천취소, 폭염취소, 그라운드 사정으로 취소)
    const isGameCanceled = await page.evaluate(() => {
        const cancelButton = document.querySelector('#btnGame');
        if (cancelButton) {
            // 실제 버튼의 텍스트를 콘솔에 출력하여 확인
            console.log('버튼 텍스트:', cancelButton.innerText.trim());

            const buttonText = cancelButton.innerText.trim();

            if (buttonText.includes('우천취소')) {
                return '우천으로 인해 경기가 취소되었습니다.';
                
            } else if (buttonText.includes('폭염취소')) {
                return '폭염으로 인해 경기가 취소되었습니다.';
                
            } else if (buttonText.includes('그라운드사정')) { // 그라운드 사정으로 인한 취소 추가
                return '그라운드사정으로 인해 경기가 취소되었습니다.';
            }
        }
        return null;  // 취소되지 않음
    });

    // 경기 취소 메시지가 있으면 취소 정보만 JSON에 저장하고 크롤링 중단
    if (isGameCanceled) {
        const cancelData = { message: isGameCanceled };
        fs.writeFileSync('data.json', JSON.stringify(cancelData, null, 2), 'utf-8');
        await browser.close();
        return;  // 크롤링 중단
    }

    // 취소되지 않은 경우 선발 투수 정보 크롤링 진행
    const data = await page.evaluate((gameDate) => {
        const results = [];

        // 각 팀 정보를 가진 div 요소들을 선택
        document.querySelectorAll('.team.away, .team.home').forEach((teamElement) => {
            // 팀 이름을 'alt' 속성에서 가져옴
            const teamName = teamElement.querySelector('.emb img').getAttribute('alt').trim() || '팀명을 찾을 수 없습니다.';

            // 투수 이름에서 'before' 클래스를 제외한 나머지 텍스트만 추출
            const pitcherElement = teamElement.querySelector('.today-pitcher p');
            let pitcherName = '투수 정보를 찾을 수 없습니다.';

            // 투수 요소가 존재하는 경우에만 텍스트 추출
            if (pitcherElement && pitcherElement.childNodes.length > 1) {
                pitcherName = pitcherElement.childNodes[1].nodeValue.trim();
            }

            // 팀과 투수 이름을 객체로 배열에 추가
            results.push({ team: teamName, pitcher: pitcherName });
        });

        return { date: gameDate, starting: results };
    },gameDate);

    // 크롤링한 데이터를 JSON 파일로 저장
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');

    await browser.close();
}

getStartingPitchers();
