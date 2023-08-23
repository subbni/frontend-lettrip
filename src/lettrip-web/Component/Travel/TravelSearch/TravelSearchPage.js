import { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import SearchResultContainer from "./SearchResultContainer";
import { searchTravelList } from "../../../Service/TravelService";

const TravelSearchPage = () => {
  const [searchForm, setSearchForm] = useState({});
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 6,
    sort: "id,DESC",
  });
  const [resultTravels, setResultTravels] = useState([]);
  const [totalElements, setTotalElements] = useState(1);

  const onGetResult = (resultList, totalElements) => {
    setResultTravels(resultList);
    console.log(totalElements);
    setTotalElements(totalElements);
  };

  const handlePageChanged = (e) => {
    setPageForm({
      ...pageForm,
      page: e - 1,
    });
  };

  return (
    <div className='searchPage'>
      <SearchForm onGetResult={onGetResult} pageForm={pageForm} />
      <SearchResultContainer
        resultTravels={resultTravels}
        handlePageChanged={handlePageChanged}
        totalElements={totalElements}
      />
    </div>
  );
};

export default TravelSearchPage;
