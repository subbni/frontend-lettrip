import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLoggedIn } from "../../Service/AuthService";

import styles from "./Friend.module.css";
import { RiToggleFill, RiToggleLine } from "react-icons/ri";
import FriendContainer from "./FriendContainer";

import Pagination from "react-js-pagination";

function FriendTemplate() {
  const navigate = useNavigate();
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 8,
    sort: "id,DESC",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isRegionBtnOn, setIsRegionBtnOn] = useState(false); // "지역" 버튼 상태

  /*
  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    }
  }, []); */

  const regionIcon = isRegionBtnOn ? <RiToggleFill /> : <RiToggleLine />; // 아이콘 설정
  const handleRegionBtnClick = () => {
    // "지역" 버튼을 클릭할 때 상태 토글
    setIsRegionBtnOn(!isRegionBtnOn);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPageForm({
      ...pageForm,
      page: pageNumber - 1,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h3 className={styles.pageTitle}>친구매칭 글 목록</h3>
        <div className={styles.pageBtn01} onClick={handleRegionBtnClick}>
          <p className={styles.btnText}>지역</p>
          <p className={styles.btnIcon}>{regionIcon}</p>
        </div>
      </div>
      <FriendContainer pageForm={pageForm} />
      <button className={styles.pageBtn02}>글쓰기</button>
      <Pagination
        activePage={currentPage}
        itemsCountPerPage={pageForm.size}
        totalItemsCount={totalElements}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
    </div>
  );
}

export default FriendTemplate;
