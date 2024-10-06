import PitcherList from '../components/PitcherList';

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/pitchers');
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  return (
    <div>
      <h1>KBO 선발 투수 정보</h1>
      <PitcherList data={data} />
    </div>
  );
}
