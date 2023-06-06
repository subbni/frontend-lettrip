import "../MyPage.css";
import MyTravelPlan from "./MyTravelPlan";
import MyTravelReview from "./MyTravelReview";
const MyTravelContainer = () => {
  return (
    <div className='mypage_container'>
      <div className='travel_container_title'>여행 플랜</div>
      <MyTravelPlan />
      <div className='hr'></div>
      <div className='travel_container_title'>여행 기록</div>
      <MyTravelReview />
    </div>
  );
};

export default MyTravelContainer;
