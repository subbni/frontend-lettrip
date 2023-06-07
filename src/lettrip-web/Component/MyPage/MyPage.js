import LikedContainer from "./liked/LikedContainer";
import MyTravelContainer from "./my/MyTravelContainer";
import "./MyPage.css";
import AccountContainer from "./account/AccountContainer";
import ProfileContainer from "./profile/ProfileContainer";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../../Constant/backendAPI";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkIfLoggedIn } from "../../Service/AuthService";

const MyPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      {isLoggedIn ? (
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
      ) : null}
    </div>
  );
};

export default MyPage;
