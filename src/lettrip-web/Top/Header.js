import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { Checklogin } from "../Service/AuthService";
import { ACCESS_TOKEN } from "../Constant/backendAPI";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const navigate = useNavigate();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchChecklogin = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN); // 로컬 스토리지에서 토큰 가져오기
    if (accessToken) {
      Checklogin(accessToken)
        .then(() => {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
        })
        .catch((e) => {
          console.log(e);
          setIsLoggedIn(false);
          localStorage.setItem("isLoggedIn", "false");
        });
    } else {
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
    }
  };

  useEffect(() => {
    fetchChecklogin();
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
