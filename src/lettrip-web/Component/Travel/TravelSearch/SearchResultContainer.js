import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TravelPaging } from "../TravelPaging";

import ResultItem from "./ResultItem";
import "./Search.css";
import styles from "./Search.module.css";

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
      setMsg(`${totalElements}건`);
    }
  }, [resultTravels]);

  const onPageClick = (e) => {
    setCurrentPage(() => e);
    handlePageChanged(e);
  };

  return (
    <div>
      <div className={styles.searchResult_info}>
        <span>검색 결과</span>
        <span className={styles.searchResult_info2}>{msg}</span>
      </div>
      <div className={styles.searchResult_container}>
        {resultTravels.map((travel, idx) => (
          <div className={styles.searchResult} key={idx}>
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
