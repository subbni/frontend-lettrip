import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkIfLoggedIn } from "../Service/AuthService"; //로그인 여부 확인
import logo_image from "../../image/logo.png"; //로고 이미지
import { FaUser } from "react-icons/fa"; //유저 아이콘
import { HiSearch } from "react-icons/hi"; //돋보기 아이콘
import { HiHeart } from "react-icons/hi2"; //하트 아이콘
import styles from "./Top.module.css";

function Navbar() {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [showSubMenu, setShowSubMenu] = useState(false);

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
  function handleShowMenu() {
    setShowSubMenu(!showSubMenu);
  }

  function handleLogoClick() {
    navigate("/");
  }

  const handlemypage = (e) => {
    e.preventDefault();
    if (!checkIfLoggedIn()) {
      navigate("/login");
      return;
    } else {
      navigate("/mypage");
    }
  };

  const handlefriend = (e) => {
    e.preventDefault();
    if (!checkIfLoggedIn()) {
      navigate("/login");
      return;
    } else {
      navigate("/friend");
    }
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarContent01}>
          <div ref={menuRef}>
            <span className={styles.navbarTitle} onClick={handleShowMenu}>
              여행코스
            </span>
            {showSubMenu && (
              <div className={styles.navbarMenu}>
                <Link to='/travel/search' className={styles.navbarMenuTitle}>
                  여행코스 검색
                </Link>
                <Link
                  to='/travel/course/create'
                  className={styles.navbarMenuTitle}
                >
                  여행코스 계획 등록
                </Link>
                <Link
                  to='/travel/review/create'
                  className={styles.navbarMenuTitle}
                >
                  여행코스 후기 등록
                </Link>
              </div>
            )}
          </div>
          <div className={styles.navbarTitle} onClick={handlefriend}>
            친구매칭
          </div>
          <Link to='/mission' className={styles.navbarTitle}>
            미션
          </Link>
          <Link to='/articles' className={styles.navbarTitle}>
            커뮤니티
          </Link>
        </div>
        <Link to='/'>
          <img
            onClick={handleLogoClick}
            className={styles.logo_img}
            src={logo_image}
            alt='Logo'
          ></img>
        </Link>
        <div className={styles.navbarContent02}>
          <div className={styles.navbar_icon} onClick={handlemypage}>
            <FaUser />
          </div>
          <Link to='/place' className={styles.navbar_icon}>
            <HiSearch />
          </Link>
          <Link to='/' className={styles.navbar_icon}>
            <HiHeart />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
