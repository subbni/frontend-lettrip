import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../Constant/backendAPI";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const navigate = useNavigate();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
      console.log();
    } else {
      setIsLoggedIn(false);
      console.log();
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
      navigate("/");
    }
  };

  return (
    <div className='Header'>
      <div className='Header_Container'>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className='Header_Button'>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to='/login' className='Header_Button'>
              로그인
            </Link>
            <Link to='/signup' className='Header_Button'>
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
