import "../MyPage.css";
import LikedTravel from "./LikedTravel.js";

const LikedContainer = () => {
  return (
    <div className='mypage_container'>
      <div className='mypage_element_title'>좋아요한 여행 코스</div>
      <LikedTravel />
    </div>
  );
};

export default LikedContainer;
