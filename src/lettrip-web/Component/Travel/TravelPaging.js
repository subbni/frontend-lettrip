import Pagination from "react-js-pagination";
import "./TravelPaging.css";
export const TravelPaging = ({ currentPage, totalCount, onPageChange }) => {
  return (
    <Pagination
      activePage={currentPage}
      itemsCountPerPage={9}
      totalItemsCount={totalCount}
      pageRangeDisplayed={5}
      prevPageText={"<"}
      nextPageText={">"}
      onChange={onPageChange}
    />
  );
};
