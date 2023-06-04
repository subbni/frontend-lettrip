import LikedContainer from "./liked/LikedContainer";
import MyTravelContainer from "./my/MyTravelContainer";
import "./MyPage.css";
import AccountContainer from "./account/AccountContainer";
import ProfileContainer from "./profile/ProfileContainer";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "../../Constant/backendAPI";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  return (
    <div className='mypage'>
      <div className='mypage_title'>MyPage</div>
      <ProfileContainer />
      <div className='mypage_container_title'>계정</div>
      <AccountContainer />
      <div className='mypage_container_title'>여행</div>
      <MyTravelContainer />
      <div className='mypage_container_title'>좋아요</div>
      <LikedContainer />
    </div>
  );
};

export default MyPage;
