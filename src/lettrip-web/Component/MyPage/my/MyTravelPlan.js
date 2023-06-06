import { useEffect, useState } from "react";
import MyTravelItem from "./MyTravelItem";
import { getMyTravel } from "../../../Service/MyPageService";

const MyTravelPlan = () => {
  const [planList, setPlanList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,DESC",
  });

  useEffect(() => {
    getMyTravel(false, pageForm)
      .then((response) => {
        setPlanList(response.content);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  return (
    <div>
      {planList.length > 0 ? (
        <div>
          {planList.map((travel) => (
            <MyTravelItem travel={travel} key={travel.id} />
          ))}
        </div>
      ) : (
        <div>아직 등록된 여행 플랜이 없습니다.</div>
      )}
    </div>
  );
};

export default MyTravelPlan;
