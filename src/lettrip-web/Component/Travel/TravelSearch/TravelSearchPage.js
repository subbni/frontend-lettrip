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
      <SearchForm onGetResult={onGetResult} />
      <SearchResultContainer resultTravels={resultTravels} />
    </div>
  );
};

export default TravelSearchPage;
