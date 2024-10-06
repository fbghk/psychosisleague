const PitcherList = ({ data }) => {
  return (
    <div>
      <h2>경기 날짜: {data.date}</h2>
      <ul>
        {data.starting.map((team, index) => (
          <li key={index}>
            팀: {team.team} <br />
            선발 투수: {team.pitcher}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PitcherList;
