import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../Constant/backendAPI";
import "./Top.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    if (storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchCheckLogin = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
    }
  };

  useEffect(() => {
    fetchCheckLogin();
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
    <div className='header'>
      <div className='header-container'>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className='auth-button'>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to='/login' className='auth-button'>
              로그인
            </Link>
            <Link to='/signup' className='auth-button'>
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
