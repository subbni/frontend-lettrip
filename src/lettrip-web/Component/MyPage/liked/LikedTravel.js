import { useEffect, useState } from "react";
import { getMyLikedTravel } from "../../../Service/MyPageService";
import LikedTravelItem from "./LikedTravelItem";

const LikedTravel = () => {
  const [travelList, setTravelList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,DESC",
  });

  useEffect(() => {
    getMyLikedTravel(pageForm)
      .then((response) => {
        console.log(response);
        setTravelList(response.content);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  return (
    <div>
      {travelList.length > 0 ? (
        <div>
          {travelList.map((travel) => (
            <LikedTravelItem travel={travel} key={travel.id} />
          ))}
        </div>
      ) : (
        <div>아직 좋아요한 여행 코스가 없습니다.</div>
      )}
    </div>
  );
};

export default LikedTravel;
