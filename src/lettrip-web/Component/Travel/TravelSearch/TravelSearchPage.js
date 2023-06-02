import { useState } from "react";
import SearchForm from "./SearchForm";
import SearchResultContainer from "./SearchResultContainer";

const TravelSearchPage = () => {
  const [resultTravels, setResultTravels] = useState([]);

  const onGetResult = (resultList) => {
    setResultTravels(resultList);
  };

  return (
    <div className='searchPage'>
      <div className='title'>여행 코스 검색</div>
      <SearchForm onGetResult={onGetResult} />
      <SearchResultContainer resultTravels={resultTravels} />
    </div>
  );
};

export default TravelSearchPage;
