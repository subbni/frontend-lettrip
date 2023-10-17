import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ACCESS_TOKEN } from "../Constant/backendAPI";
import styles from "./Top.module.css";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    setIsLoggedIn(!!storedToken);
  }, []);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      setIsLoggedIn(false);
      localStorage.removeItem(ACCESS_TOKEN);
      window.alert("로그아웃 되었습니다.");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContanier}>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className={styles.headerBtn01}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to='/login' className={styles.headerBtn02}>
              로그인
            </Link>
            <Link to='/signup' className={styles.headerBtn03}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
