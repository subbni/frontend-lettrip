import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { Checklogin } from "../Service/AuthService";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const navigate = useNavigate();

  useEffect(() => {
    fetchChecklogin();
  }, []);

  const fetchChecklogin = () => {
    Checklogin()
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((e) => {
        console.log(e);
        setIsLoggedIn(false);
      });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className='Header'>
      <div className='Header_Container'>
        {isLoggedIn ? (
          <>
            <Link to='/' />
            <button onClick={handleLogout} className='Header_Button'>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to='/Login' className='Header_Button'>
              로그인
            </Link>
            <Link to='/Sign-up' className='Header_Button'>
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
