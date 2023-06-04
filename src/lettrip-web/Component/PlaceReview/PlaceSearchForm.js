import { useEffect, useState } from "react";
import SearchMapForm from "./SearchMapForm";
import { RiArrowGoBackLine } from "react-icons/ri";
import { getPlace, getReviewPage } from "../../Service/PlaceReviewService";
const PlaceSearchForm = ({ onGetResults }) => {
  const [place, setPlace] = useState({
    name: "",
    xpoint: "",
    ypoint: "",
    categoryName: "",
    province: "",
    city: "",
  });
  const [totalRating, setTotalRating] = useState(-1);

  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);

  useEffect(() => {
    if (place.xpoint.trim()) {
      checkPlace();
    }
  }, [place]);

  const onPlaceSelect = (selectedPlace) => {
    setPlace(selectedPlace);
    setIsPlaceSelected(true);
  };

  const checkPlace = () => {
    console.log(place);
    getPlace(place.xpoint, place.ypoint)
      .then((response) => {
        console.log(response);
        if (response.errorCode) {
        } else {
          setTotalRating(response.totalRating);
          getResult(response.id);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getResult = (placeId) => {
    getReviewPage(placeId, pageForm)
      .then((response) => {
        console.log(response);
        onGetResults(response.content);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onReSearchBtnClick = () => {
    setIsPlaceSelected(false);
    setPlace({
      name: "",
      xpoint: "",
      ypoint: "",
      categoryName: "",
      province: "",
      city: "",
    });
  };

  return (
    <div className='place_searchForm'>
      {isPlaceSelected ? (
        <div>
          <div className='place_name'>{place.name}</div>
          <div className='place_category'>{place.categoryName}</div>
          <div>{totalRating}점</div>
          <div className='place_research_btn'>
            <RiArrowGoBackLine onClick={onReSearchBtnClick} />
            <span className='place_research_msg'>다시 검색</span>
          </div>
        </div>
      ) : (
        <SearchMapForm onPlaceSelect={onPlaceSelect} />
      )}
    </div>
  );
};

export default PlaceSearchForm;
