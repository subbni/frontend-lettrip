import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLoggedIn } from "../../Service/AuthService";
import { showMeetUpPostList } from "../../Service/MeetUpPostService";
import MeetUpContainer from "./MeetUpContainer";
import styles from "./MeetUp.module.css";
import { RiToggleFill, RiToggleLine } from "react-icons/ri"; // 지역 on/off 아이콘
import Pagination from "react-js-pagination";

import { Citys, Provinces } from "../Travel/TravelData";

function MeetUpTemplate() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); //페이지네이션 설정
  const [totalElements, setTotalElements] = useState(0); //페이지네이션 설정
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 8,
    sort: "id,DESC",
  }); //친구 매칭 전체 글 불러오기 조회 리스트
  const [meetUpPostList, setMeetUpPostList] = useState([]); //매칭 글 리스트 저장할 곳
  const [isRegionBtnOn, setIsRegionBtnOn] = useState(false); // "지역" 버튼 상태

  const [searchForm, setSearchForm] = useState({
    province: "",
    isMatched: "",
  });

  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [pageForm.page]);

  //////// event 핸들링
  const handlePostChange = (e) => {
    const changingField = e.target.name;
    setSearchForm((searchForm) => ({
      ...searchForm,
      [changingField]: e.target.value,
    }));
  };

  const fetchPosts = () => {
    showMeetUpPostList(pageForm)
      .then((response) => {
        setMeetUpPostList(response.content);
        setTotalElements(response.totalElements);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const regionIcon = isRegionBtnOn ? <RiToggleFill /> : <RiToggleLine />; // 아이콘 설정
  const handleRegionBtnClick = (e) => {
    e.preventDefault();
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

  const handleCreatePage = (e) => {
    e.preventDefault();
    navigate("/friend/create");
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h3 className={styles.pageTitle}>친구매칭 글 목록</h3>
        <div className={styles.isScheduledBtnBox}>
          <select
            className={styles.searchOpt}
            name='isMatched'
            id='isMatched'
            value={searchForm.isMatched}
            onChange={handlePostChange}
            required
          >
            <option value='' disabled>
              매칭여부
            </option>
            <option value='false'>매칭전</option>
            <option value='true'>매칭완료</option>
          </select>
        </div>
        <div className={styles.provinceBtnBox}>
          <select
            className={styles.searchOpt}
            name='province'
            id='province'
            value={searchForm.province}
            onChange={handlePostChange}
            required
          >
            <option value='' disabled>
              지역
            </option>
            {Provinces.map((province, idx) => (
              <option key={idx} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.gpsBtnBox} onClick={handleRegionBtnClick}>
          <p className={styles.gpsText}>GPS</p>
          <p className={styles.gpsBtn}>{regionIcon}</p>
        </div>
      </div>
      <MeetUpContainer meetUpPostList={meetUpPostList} />
      <button className={styles.createBtn} onClick={handleCreatePage}>
        글쓰기
      </button>
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

export default MeetUpTemplate;
