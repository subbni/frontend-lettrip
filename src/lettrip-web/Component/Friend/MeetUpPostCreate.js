import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; //overlay 라이브러리 사용하기
import Moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";
import { createMeetUpPost } from "../../Service/MeetUpPostService";
import { Citys, Provinces } from "../Travel/TravelData";
import styles from "./Post.module.css";
import { TbMap2 } from "react-icons/tb";
import { MdAddCircleOutline } from "react-icons/md";
import MapSearch from "./MapSearch";
import MeetUpPlan from "./MeetUpPlan";

function MeetUpPostCreate() {
  const navigate = useNavigate();
  const [meetUpPostForm, setMeetUpPostForm] = useState({
    title: "",
    isGpsEnabled: true,
    meetUpDate: "",
    province: "",
    city: "",
    content: "",
    placeId: null,
    travelId: null,
  });
  const [matchedCitys, setMatchedCitys] = useState([]);
  // 행정구역
  const provinces = Provinces;
  const provincesOptions = provinces.map((province, idx) => (
    <option key={idx}>{province}</option>
  ));
  // 지역명
  const citys = Citys;
  const [isPlaceSearch, setIsPlaceSearched] = useState(false); //modal 장소 검색
  const [placeName, setPlaceName] = useState("");
  const [isPlanSearch, setIsPlanSearched] = useState(false); //modal 장소 검색
  const [planName, setPlanName] = useState("");

  // 행정구역 선택에 따른 지역 option 동적 처리
  useEffect(() => {
    const selectedProvinceObject = citys.find(
      (object) => object.province === meetUpPostForm.province
    );
    if (selectedProvinceObject) {
      setMatchedCitys(selectedProvinceObject.citys);
      setMeetUpPostForm((meetUpPostForm) => ({
        ...meetUpPostForm,
        city: "",
      }));
      document.getElementById("city").value = "default";
    }
  }, [meetUpPostForm.province]);

  //////// event 핸들링
  const handlePostChange = (e) => {
    const changingField = e.target.name;
    setMeetUpPostForm((meetUpPostForm) => ({
      ...meetUpPostForm,
      [changingField]: e.target.value,
    }));
  };
  //장소 검색 Modal 켜고 끄기
  const handlePlaceOpen = () => {
    setIsPlaceSearched(true);
  };
  const closePlaceSearch = () => {
    setIsPlaceSearched(false);
  };
  const handlePlanOpen = () => {
    setIsPlanSearched(true);
  };
  const closePlanSearch = () => {
    setIsPlanSearched(false);
  };

  // MapForm에 전달할 place 선택 함수
  const onPlaceSelect = useCallback(
    (placeInfo) => {
      const newPlace = {
        name: placeInfo.name,
        categoryCode: placeInfo.categoryCode,
        categoryName: placeInfo.categoryName,
        xpoint: placeInfo.xpoint,
        ypoint: placeInfo.ypoint,
        province: placeInfo.province,
        city: placeInfo.city,
        address: placeInfo.address,
        placeId: placeInfo.place_id,
      };
      setMeetUpPostForm((meetUpPostForm) => ({
        ...meetUpPostForm,
        placeId: newPlace.placeId,
      }));
      setPlaceName(newPlace.name);
    },
    [meetUpPostForm]
  );
  const onPlanSelect = (planTitle, selectedTravelId) => {
    console.log(selectedTravelId);
    setPlanName(planTitle);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const formattedMeetUpDate = Moment(meetUpPostForm.meetUpDate).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    if (window.confirm("친구 매칭글을 작성하시겠습니까?")) {
      createMeetUpPost({
        ...meetUpPostForm,
        meetUpDate: formattedMeetUpDate,
      })
        .then((response) => {
          console.log(response);
          window.alert("게시글 작성이 완료되었습니다.");
          navigate("/friend");
        })
        .catch((e) => {
          console.log(e);
          window.alert(
            "게시글 작성에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
        });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>매칭 글 작성 </h2>
        <p className={styles.headerSubTitle}>*필수 항목</p>
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <p className={styles.contentOpt}>제목</p>
            <p className={styles.optRequired}>*</p>
          </div>
          <input
            className={styles.contentTitle}
            type='text'
            name='title'
            id='title'
            value={meetUpPostForm.title}
            onChange={handlePostChange}
            placeholder='제목을 입력하세요.'
            required
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <p className={styles.contentOpt}>GPS</p>
            <p className={styles.optRequired}>*</p>
          </div>
          <div className={styles.contentBox01}>
            <label className={styles.contentGps}>
              <input
                type='radio'
                name='isGpsEnabled'
                value='true'
                defaultChecked={meetUpPostForm.isGpsEnabled === true}
                onChange={handlePostChange}
              />
              반영
            </label>
            <label className={styles.contentGps}>
              <input
                type='radio'
                name='isGpsEnabled'
                value='false'
                defaultChecked={meetUpPostForm.isGpsEnabled === false}
                onChange={handlePostChange}
              />
              미반영
            </label>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <p className={styles.contentOpt}>매칭 날짜</p>
            <p className={styles.optRequired}>*</p>
          </div>
          <input
            className={styles.contentMeetUpDate}
            type='datetime-local'
            aria-required='true'
            data-placeholder='날짜 선택'
            name='meetUpDate'
            id='meetUpDate'
            value={meetUpPostForm.departDate}
            onChange={handlePostChange}
            required
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <p className={styles.contentOpt}>지역</p>
            <p className={styles.optRequired}>*</p>
          </div>
          <div className={styles.contentBox02}>
            <div className={styles.contentPlaceBox}>
              <select
                className={styles.contentProvince}
                name='province'
                id='province'
                value={meetUpPostForm.province}
                onChange={handlePostChange}
                required
              >
                <option value='' disabled>
                  시/도
                </option>
                {provincesOptions}
              </select>
              <select
                className={styles.contentCity}
                name='city'
                id='city'
                value={meetUpPostForm.city}
                onChange={handlePostChange}
                required
              >
                <option value='' disabled>
                  지역
                </option>
                {matchedCitys.map((city, idx) => (
                  <option key={idx}>{city}</option>
                ))}
              </select>
            </div>
            <div className={styles.contentPlace}>
              <TbMap2 className={styles.mapIcon} onClick={handlePlaceOpen} />
              <input
                className={styles.contentPlaceInput}
                type='text'
                name='placeId'
                id='placeId'
                value={placeName}
                onChange={handlePostChange}
                placeholder='장소 검색하기 (선택)'
                required
              />
              <Modal
                isOpen={isPlaceSearch}
                onRequestClose={closePlaceSearch}
                style={{
                  content: {
                    maxWidth: "650px",
                    maxHeight: "520px",
                    margin: "auto",
                    padding: "10px",
                  },
                }}
              >
                <MapSearch
                  onPlaceSelect={onPlaceSelect}
                  onConfirm={closePlaceSearch}
                />
              </Modal>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <p className={styles.contentOpt}>설명</p>
            <p className={styles.optRequired}>*</p>
          </div>
          <textarea
            className={styles.contentPostContent}
            name='content'
            onChange={handlePostChange}
            placeholder='매칭에 대한 정확한 내용 등을 입력해주세요.'
            value={meetUpPostForm.content}
            required
          ></textarea>
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <p className={styles.contentOpt}>계획연동</p>
          </div>
          <div className={styles.contentPlan}>
            <MdAddCircleOutline
              className={styles.planIcon}
              onClick={handlePlanOpen}
            />
            <input
              className={styles.contentPlanInput}
              type='text'
              name='travelId'
              id='travelId'
              value={planName}
              onChange={handlePostChange}
              placeholder='계획 선택'
              disabled
            />
            <Modal
              isOpen={isPlanSearch}
              onRequestClose={closePlanSearch}
              style={{
                content: {
                  maxWidth: "700px",
                  margin: "auto",
                  padding: "30px 35px",
                },
              }}
            >
              <MeetUpPlan
                onPlanSelect={onPlanSelect}
                onConfirm={closePlanSearch}
              />
            </Modal>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <button className={styles.cancelBtn}>취소</button>
        <button className={styles.submitBtn} onClick={handlePostSubmit}>
          등록
        </button>
      </div>
    </div>
  );
}

export default MeetUpPostCreate;
