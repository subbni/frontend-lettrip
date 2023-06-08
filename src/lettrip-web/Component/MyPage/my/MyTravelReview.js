import { useEffect, useState } from "react";
import MyTravelItem from "./MyTravelItem";
import { getMyTravel } from "../../../Service/MyPageService";
const MyTravelReview = () => {
  const [reviewList, setReviewList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,DESC",
  });

  useEffect(() => {
    getMyTravel(true, pageForm)
      .then((response) => {
        setReviewList(response.content);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  return (
    <div>
      {reviewList.length > 0 ? (
        <div>
          {reviewList.map((travel) => (
            <MyTravelItem
              travel={travel}
              clickPath='/travel/course/review/'
              key={travel.id}
            />
          ))}
        </div>
      ) : (
        <div className='travel_info'>아직 등록된 여행 기록이 없습니다.</div>
      )}
    </div>
  );
};

export default MyTravelReview;
