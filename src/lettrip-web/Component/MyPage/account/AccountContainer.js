import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";
import styles from "../MyPage.module.css";

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

  // 정보 수정 페이지로 이동
  const handleModifyClick = () => {
    navigate("/mypage/modify");
  };

  return (
    <div className={styles.accountBtnContainer}>
      <button className={styles.accountBtn} onClick={handleModifyClick}>
        프로필 수정
      </button>
    </div>
  );
};

export default AccountContainer;
