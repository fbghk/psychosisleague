const puppeteer = require('puppeteer');
const fs = require('fs');

//! 시간 체크 함수: 20시부터 02시까지 크롤링
function isCrawlingTime() {
    const now = new Date();
    const hour = now.getHours();
  
    //! 20시(8PM) ~ 23시(11PM) 또는 0시(12AM) ~ 2시(2AM) 사이인 경우
    return (hour >= 19 || hour < 2);
}

async function checkPitcherInfo() {

    //! 시간 체크 함수 사용
    if (!isCrawlingTime()) {
        console.log('현재는 크롤링 가능 시간이 아닙니다. 크롤링을 종료합니다.');
        return; // 크롤링 중단
        }

    const browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // 1. KBO 메인 페이지 접속
        await page.goto('https://www.koreabaseball.com/Default.aspx', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // 2. 모달창 처리
        try {
            await page.waitForSelector('img[alt="KBO 홈페이지 바로가기"]', {
                timeout: 5000,
                visible: true
            });
            
            await page.click('img[alt="KBO 홈페이지 바로가기"]');
            await new Promise(resolve => setTimeout(resolve, 2000)); // waitForTimeout 대신 setTimeout 사용
            
        } catch (modalError) {
            console.log("모달창이 없거나 이미 닫혀있습니다:", modalError.message);
        }

        // 3. lnkNext (내일 경기) 버튼이 로드될 때까지 대기
        try {
            await page.waitForSelector('#lnkNext', { timeout: 5000 });
            await page.click('#lnkNext');
            await new Promise(resolve => setTimeout(resolve, 3000)); // waitForTimeout 대신 setTimeout 사용
        } catch (nextButtonError) {
            console.log("내일 경기 버튼을 찾을 수 없습니다:", nextButtonError.message);
            throw new Error("내일 경기 버튼 클릭 실패");
        }

        // 4. 선발 투수 정보 확인
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

        const currentTime = new Date().toLocaleString();

        // 5. 정보가 없으면 콘솔에 로그 출력
        if (!pitcherInfo || pitcherInfo.length === 0) {
            console.log(`[${currentTime}] 투수 정보가 없습니다.`);
        } else {
            // 6. 선발 투수 정보가 있으면 팀명과 투수 이름, 크롤링된 시간을 출력
            pitcherInfo.forEach((info) => {
                console.log(`[${currentTime}] 소속팀: ${info.team}, 선발투수: ${info.pitcher}`);
            });
            
            // 정보를 파일로 저장
            fs.writeFileSync('pitcher_info.json', JSON.stringify({
                time: currentTime,
                pitchers: pitcherInfo
            }, null, 2), 'utf-8');
        }

    } catch (error) {
        console.error('에러 발생:', error);
    } finally {
        await browser.close();
    }
}

// 즉시 첫 실행 후 15분 주기로 실행
checkPitcherInfo().catch(console.error);

setInterval(() => {
    console.log("투수 정보 업데이트 확인 중...");
    checkPitcherInfo().catch(console.error);
}, 15 * 60 * 1000);