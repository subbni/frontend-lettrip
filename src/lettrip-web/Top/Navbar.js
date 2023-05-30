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

  function handleTravelCourseSearch() {
    navigate("/travel/search");
  }

  function handleTravelCreate() {
    setShowSubMenu(false);
  }

  function handleTravelPlan() {
    navigate("/travel/course/create");
  }

  function handleTravelReview() {
    navigate("/travel/review/create");
  }

  function handleMission() {
    navigate("/mission");
  }

  function handleCommunity() {
    navigate("/articles");
  }

  return (
    <div className="Navbar">
      <Link to="/">
        <img
          onClick={handleClick}
          className="Logo_Image"
          src="logo.png"
          alt="Logo"
        ></img>
      </Link>

      <div className="Navbar_Container">
        <div className="Navbar_Service">
          <div className="Navbar_Dropdown" ref={menuRef}>
            <span className="Navbar_Travel" onClick={handleTravel}>
              여행코스
            </span>
            {showSubMenu && (
              <div className="Navbar_DropdownContent">
                <span
                  className="Navbar_DropdownItem"
                  onClick={handleTravelCourseSearch}
                >
                  여행코스 검색
                </span>
                <span
                  className="Navbar_DropdownItem"
                  onClick={handleTravelCreate}
                >
                  여행코스 등록
                </span>
                <span
                  className="Navbar_DropdownItem"
                  onClick={handleTravelPlan}
                >
                  여행코스 계획 등록
                </span>
                <span
                  className="Navbar_DropdownItem"
                  onClick={handleTravelReview}
                >
                  여행코스 후기 등록
                </span>
              </div>
            )}
          </div>
          <span className="Navbar_Friend"> 친구매칭</span>
          <span className="Navbar_Mission" onClick={handleMission}>
            {" "}
            미션
          </span>
          <span className="Navbar_Community" onClick={handleCommunity}>
            커뮤니티
          </span>
        </div>
        <div className="Navbar_Option">
          <AiOutlineUser className="Navbar_UserIcon" />
          <AiOutlineSearch className="Navbar_SearchIcon" />
          <AiFillHeart className="Navbar_HeartIcon" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
