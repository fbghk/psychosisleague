// KBO 선발 투수 정보를 가져오는 함수
async function fetchStartingPitchers() {
  try {
      // 실제 구현에서는 이 URL을 실제 API 엔드포인트로 변경해야 합니다
      const response = await fetch('https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx');
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('선발 투수 정보를 가져오는 데 실패했습니다:', error);
      return null;
  }
}

// 선발 투수 정보를 화면에 표시하는 함수
function displayStartingPitchers(pitchers) {
  const container = document.getElementById('starting-pitchers');
  container.innerHTML = ''; // 기존 내용 초기화

  if (!pitchers || pitchers.length === 0) {
      container.innerHTML = '<p>오늘의 선발 투수 정보가 없습니다.</p>';
      return;
  }

  const list = document.createElement('ul');
  pitchers.forEach(pitcher => {
      const item = document.createElement('li');
      item.textContent = `${pitcher.team}: ${pitcher.name}`;
      list.appendChild(item);
  });

  container.appendChild(list);
}

// 페이지 로드 시 선발 투수 정보 가져오기 및 표시
document.addEventListener('DOMContentLoaded', async () => {
  const pitchers = await fetchStartingPitchers();
  displayStartingPitchers(pitchers);
});