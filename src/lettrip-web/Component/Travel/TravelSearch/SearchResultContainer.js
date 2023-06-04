import { useEffect, useState } from "react";
import ResultItem from "./ResultItem";
import "./Search.css";
import { useNavigate } from "react-router-dom";

const TravelSearchResult = ({ resultTravels }) => {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (resultTravels.length > 0) {
      setMsg(`검색 결과 ${resultTravels.length}건`);
    }
  }, [resultTravels]);

  return (
    <div>
      <div>{msg}</div>
      <div className='SearchResultContainer'>
        {resultTravels.map((travel) => (
          <ResultItem key={travel.id} travel={travel} />
        ))}
      </div>
    </div>
  );
};

export default TravelSearchResult;
