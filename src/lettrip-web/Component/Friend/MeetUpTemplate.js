import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLoggedIn } from "../../Service/AuthService";
import {
  showMeetUpPostList,
  showMeetUpPostOption,
} from "../../Service/MeetUpPostService";
import Pagination from "react-js-pagination";
import styles from "./MeetUp.module.css";
import { RiToggleFill, RiToggleLine } from "react-icons/ri"; // 지역 on/off 아이콘
import { Provinces, Citys } from "../Travel/TravelData";
import MeetUpContainer from "./MeetUpContainer";
import MeetUpGPS from "./MeetUpGPS";

function MeetUpTemplate() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); //페이지네이션 설정
  const [totalElements, setTotalElements] = useState(0); //페이지네이션 설정
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 8,
    sort: "id,DESC",
  });
  const [searchAllForm, setSearchAllForm] = useState({
    province: "all",
    city: "all",
    isGpsEnabled: false,
  }); //친구 매칭 전체 글 불러오기 조회 리스트
  const [searchOptionForm, setSearchOptionForm] = useState({
    province: "all",
    city: "all",
    meetUpPostStatus: "UNSCHEDULED",
    isGpsEnabled: false,
  });

  const [meetUpPostList, setMeetUpPostList] = useState([]); //매칭 글 리스트 저장할 곳
  const [isRegionBtnOn, setIsRegionBtnOn] = useState(false); // "지역" 버튼 상태
  const [address, setAddress] = useState(null);
  const [matchedCitys, setMatchedCitys] = useState([]);
  // 행정구역
  const provinces = Provinces;
  const provincesOptions = provinces.map((province, idx) => (
    <option key={idx}>{province}</option>
  ));
  // 지역명
  const citys = Citys;

  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    }
  }, []);

  // 행정구역 선택에 따른 지역 option 동적 처리
  useEffect(() => {
    const selectedProvinceObject = citys.find(
      (object) => object.province === searchOptionForm.province
    );
    if (selectedProvinceObject) {
      setMatchedCitys(selectedProvinceObject.citys);
    }
  }, [searchOptionForm.province]);

  useEffect(() => {
    searchAllPosts();
  }, [pageForm.page]);

  //////// event 핸들링
  const handlePostChange = (e) => {
    const changingField = e.target.name;
    setSearchOptionForm((searchOptionForm) => ({
      ...searchOptionForm,
      [changingField]: e.target.value,
    }));
  };

  const onSearchBtnClick = (e) => {
    e.preventDefault();
    console.log(searchOptionForm);
    searchOptionPosts();
  };

  const searchAllPosts = () => {
    showMeetUpPostList(searchAllForm, pageForm)
      .then((response) => {
        setMeetUpPostList(response.content);
        setTotalElements(response.totalElements);
        console.log(response);
        console.log(searchAllForm);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const searchOptionPosts = () => {
    showMeetUpPostOption(searchOptionForm, pageForm)
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
    setAddress(null);
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

  //GPS 지역 가져오기 -> 가져오면 자동으로 지역 및 도시 입력 완료 (수정불가))
  const handleAddressUpdate = (newAddress) => {
    setAddress(newAddress);
    const addressPart = newAddress.split(" ");
    const gpsProvince = `${addressPart[0]}`;
    const gpsCity = `${addressPart[1]}`;
    setSearchOptionForm((prevSearchForm) => ({
      ...prevSearchForm,
      province: gpsProvince,
      city: gpsCity,
      isGpsEnabled: true,
    }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h3 className={styles.pageTitle}>친구매칭 글 목록</h3>
        <div className={styles.isScheduledBtnBox}>
          <select
            className={styles.searchOpt}
            name='meetUpPostStatus'
            id='meetUpPostStatus'
            value={searchOptionForm.meetUpPostStatus}
            onChange={handlePostChange}
            defaultValue='default'
          >
            <option value='default' disabled>
              매칭여부
            </option>
            <option value='UNSCHEDULED'>매칭전</option>
            <option value='SCHEDULED'>매칭완료</option>
          </select>
        </div>
        <div className={styles.provinceBtnBox}>
          <select
            className={styles.searchOpt}
            name='province'
            id='province'
            value={searchOptionForm.province}
            onChange={handlePostChange}
            disabled={address !== null}
          >
            <option value='' disabled>
              시/도 선택
            </option>
            {provincesOptions}
          </select>
        </div>
        <div className={styles.cityBtnBox}>
          <select
            className={styles.searchOpt}
            name='city'
            id='city'
            value={searchOptionForm.city}
            onChange={handlePostChange}
            disabled={address !== null}
          >
            <option value='' disabled>
              지역
            </option>
            {matchedCitys.map((city, idx) => (
              <option key={idx}>{city}</option>
            ))}
          </select>
        </div>
        <div className={styles.gpsBtnBox} onClick={handleRegionBtnClick}>
          {!isRegionBtnOn ? <p className={styles.gpsText}>GPS</p> : null}
          {isRegionBtnOn && <MeetUpGPS onAddressUpdate={handleAddressUpdate} />}
          <p className={styles.gpsBtn}>{regionIcon}</p>
        </div>
        <button className={styles.searchForm_button} onClick={onSearchBtnClick}>
          검색
        </button>
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
