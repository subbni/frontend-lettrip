import { useEffect, useState } from "react";
import { getRanking } from "../../Service/MissionService";

const RankingItem = ({ rankingName, rankingType, from, to }) => {
  const [rankingForm, setRankingForm] = useState({
    rankingType: rankingType,
    from: from,
    to: to,
  });
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    console.log(rankingForm);
    getRanking(rankingForm)
      .then((response) => {
        setRanking(response);
        console.log(response);
      })
      .catch((e) => {
        alert("오류 발생");
        console.log(e);
      });
  }, []);

  return (
    <div className='ranking_item'>
      <div className='ranking_name'>{rankingName}</div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div className='ranking_ranker' key={index}>
          <div className='ranking_ranker_number'>{index + 1}</div>
          {ranking.length > index ? (
            <div>
              <div className='ranking_ranker_nickname'>
                {ranking[index].userNickname}
              </div>
              <div className='ranking_ranker_info'>
                {ranking[index].count}회
              </div>
            </div>
          ) : (
            <div className='ranking_ranker_none'>없음</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RankingItem;
