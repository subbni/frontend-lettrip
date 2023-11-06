import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkIfLoggedIn } from "../Service/AuthService"; //로그인 여부 확인
import logo_image from "../../image/logo.png"; //로고 이미지
import { FaUser } from "react-icons/fa"; //유저 아이콘
import { HiSearch } from "react-icons/hi"; //돋보기 아이콘
import { BsFillChatFill } from "react-icons/bs";

import Modal from "react-modal";
//overlay 라이브러리 사용하기

import styles from "./Top.module.css";
import ChatTemplate from "../Component/Chat/ChatTemplate";
import ChatContainer from "../Component/Chat/ChatContainer";
function Navbar() {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showChatTemplate, setShowChatTemplate] = useState(false); // ChatTemplate 보이기 여부를 관리

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

  const handleChat = (e) => {
    e.preventDefault();
    setShowChatTemplate(true); // 채팅 아이콘 클릭 시 ChatTemplate 보이기
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarContent01}>
          <div ref={menuRef}>
            <span className={styles.navbarLink} onClick={handleShowMenu}>
              여행코스
            </span>
            {showSubMenu && (
              <div className={styles.navbarMenu}>
                <Link to='/travel/search' className={styles.navbarMenuLink}>
                  여행 코스 검색
                </Link>
                <Link
                  to='/travel/course/create'
                  className={styles.navbarMenuLink}
                >
                  여행 코스 계획
                </Link>
                <Link
                  to='/travel/review/create'
                  className={styles.navbarMenuLink}
                >
                  여행 코스 후기
                </Link>
              </div>
            )}
          </div>
          <Link to='/friend' className={styles.navbarLink}>
            친구매칭
          </Link>
          <Link to='/mission' className={styles.navbarLink}>
            미션
          </Link>
          <Link to='/articles' className={styles.navbarLink}>
            커뮤니티
          </Link>
        </div>
        <Link to='/'>
          <img
            onClick={handleLogoClick}
            className={styles.img_01}
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
          <div className={styles.navbar_icon} onClick={handleChat}>
            <BsFillChatFill />
          </div>
          <Modal
            isOpen={showChatTemplate} // 모달의 열림/닫힘 상태를 제어
            onRequestClose={() => setShowChatTemplate(false)} // 모달을 닫기 위한 함수 설정
            style={{
              content: {
                maxWidth: "800px", // Modal의 최대 너비 설정
                margin: "auto", // 가운데 정렬
                padding: "0", // 내용 패딩
              },
            }}
          >
            <ChatTemplate />
            {/* <ChatContainer /> */}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
