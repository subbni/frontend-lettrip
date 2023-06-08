import "../MyPage.css";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";

const AccountContainer = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    if (storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      setIsLoggedIn(false);
      localStorage.removeItem(ACCESS_TOKEN);
      window.alert("로그아웃 되었습니다.");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className='mypage_container'>
      <Link to='/mypage/confirm' className='account_text'>
        정보 수정
      </Link>
      <div className='hr'></div>
      <div className='account_text' onClick={handleLogout}>
        로그아웃
      </div>
      <div className='hr'></div>
      <Link to='/mypage/withdraw' className='account_text'>
        회원 탈퇴
      </Link>
    </div>
  );
};

export default AccountContainer;
