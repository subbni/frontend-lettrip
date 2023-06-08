import { useEffect, useState } from "react";
import ResultItem from "./ResultItem";
import "./Search.css";
import { useNavigate } from "react-router-dom";
import { TravelPaging } from "../TravelPaging";

const TravelSearchResult = ({
  resultTravels,
  totalElements,
  handlePageChanged,
}) => {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (resultTravels.length > 0) {
      setMsg(`검색 결과 ${totalElements}건`);
    }
  }, [resultTravels]);

  const onPageClick = (e) => {
    setCurrentPage(() => e);
    handlePageChanged(e);
  };

  return (
    <div>
      <div className='searchResult_info'>{msg}</div>
      <div className='SearchResultContainer'>
        {resultTravels.map((travel, idx) => (
          <div className='SerarchResult' key={idx}>
            <ResultItem travel={travel} />
          </div>
        ))}
      </div>
      <TravelPaging
        currentPage={currentPage}
        totalCount={totalElements}
        onPageChange={onPageClick}
      />
    </div>
  );
};

export default TravelSearchResult;
