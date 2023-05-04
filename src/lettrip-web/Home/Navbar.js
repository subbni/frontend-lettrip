import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { AiOutlineUser, AiOutlineSearch, AiFillHeart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowSubMenu(false);
    }
  }

  function handleEscape(e) {
    if (e.key === "Escape") {
      setShowSubMenu(false);
    }
  }

  function handleClick() {
    setShowSubMenu(false);
    navigate("/");
  }

  function handleTravel() {
    setShowSubMenu(!showSubMenu);
  }

  function handleTravelSearch() {
    navigate("/Travel/search");
  }

  function handleTravelCreate() {
    navigate("/Travel/create");
  }

  function handleCommunity() {
    navigate("/Articles");
  }

  return (
    <div className='Navbar'>
      <Link to='/'>
        <img
          onClick={handleClick}
          className='Logo_Image'
          src='logo.png'
          alt='Logo'
        ></img>
      </Link>

      <div className='Navbar_Container'>
        <div className='Navbar_Service'>
          <span className='Navbar_Travel' onClick={handleTravel}>
            {" "}
            여행코스
            {showSubMenu && (
              <div className='Navbar_SubMenu'>
                <span
                  className='Navbar_SubMenuItem'
                  onClick={handleTravelSearch}
                >
                  여행코스 검색
                </span>
                <span
                  className='Navbar_SubMenuItem'
                  onClick={handleTravelCreate}
                >
                  여행코스 등록
                </span>
              </div>
            )}
          </span>
          <span className='Navbar_Friend'> 친구매칭</span>
          <span className='Navbar_Mission'> 미션</span>
          <span className='Navbar_Community' onClick={handleCommunity}>
            {" "}
            커뮤니티
          </span>
        </div>
        <div className='Navbar_Option'>
          <AiOutlineUser className='Navbar_UserIcon' />
          <AiOutlineSearch className='Navbar_SearchIcon' />
          <AiFillHeart className='Navbar_HeartIcon' />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
