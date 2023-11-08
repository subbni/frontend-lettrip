/*global kakao*/
import React, { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { recommendItem } from "../../../Service/TravelService";
import { MdRefresh } from "react-icons/md";
import loading from "../../../../image/Plan_Spinner.gif";
import styles from "./Rec.module.css";

const RecItem = ({
  onCourseInsert,
  onDeleteBtnClick,
  dayCount,
  containerIdx,
  courseIdx,
  recommendationType,
  province,
  pageForm,
  setPageForm,
  planForm,
  recommendationResult,
}) => {
  const [course, setCourse] = useState({
    id: courseIdx,
    arrivedTime: "",
    cost: "",
    dayCount: dayCount,
    place: {
      name: "",
      categoryCode: "",
      categoryName: "",
      xpoint: "",
      ypoint: "",
      province: "",
      city: "",
    },
  });

  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [btnMessage, setBtnMessage] = useState("등록");

  const [showContents, setShowContents] = useState(false); //내용 숨기기 및 보여주기
  const [mapVisible, setMapVisible] = useState(false);

  const [mapId, setMapId] = useState(containerIdx + "map" + courseIdx);
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState({
    name: "",
    xpoint: "",
    ypoint: "",
    categoryCode: "",
    categoryName: "",
    province: "",
    city: "",
    address: "",
  });
  const [selectedUrl, setSelectedUrl] = useState("");
  const [courseResult, setCourseResult] = useState([]); //머신러닝 결과 받아오기
  const [isLoading, setIsLoading] = useState(true); //로딩중인지 아닌지
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    //카카오 맵 API 초기화
    kakao.maps.load(() => {
      const container = document.getElementById(mapId);
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978), // 초기 중심 좌표 설정
        level: 5, // 초기 확대 수준 설정
      };
      const mapInstance = new kakao.maps.Map(container, options);
      setMap(mapInstance);
      setInfowindow(new kakao.maps.InfoWindow({ zIndex: 1 }));
    });
  }, [mapId]);

  useEffect(() => {
    fetchItemResult();
  }, []);

  useEffect(() => {
    if (isPlaceSelected || isClick) {
      setMapVisible(true);
    } else {
      setMapVisible(false);
    }
    if (isPlaceSelected && isClick) {
      setMapVisible(false);
    }
  }, [courseResult, isPlaceSelected, isClick]);

  useEffect(() => {
    console.log(selectedPlace);
  }, [selectedPlace]);

  const fetchItemResult = () => {
    console.log(courseResult);
    recommendItem(planForm, pageForm)
      .then((response) => {
        console.log(response);
        setCourseResult(response);
        if (response) {
          setIsLoading(false);
        }
        console.log(courseResult);
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
  };

  const SearchResultClick = (place) => {
    if (map) {
      const ps = new kakao.maps.services.Places(map);
      const searchOption = {
        size: 1, // 1개의 결과만 가져오도록 설정
      };
      // 장소 이름으로 검색 수행
      ps.keywordSearch(
        place.place_name,
        (data, status) => {
          if (status === kakao.maps.services.Status.OK) {
            if (data.length > 0) {
              const resultPlace = data[0]; // 첫 번째 검색 결과 사용
              const position = new kakao.maps.LatLng(
                resultPlace.y,
                resultPlace.x
              );
              map.panTo(position); // 검색된 장소의 위치로 지도 이동

              const address = place.address_name; // 주소를 그대로 설정
              console.log(address);
              const newPlace = {
                address,
                name: resultPlace.place_name,
                xpoint: resultPlace.x,
                ypoint: resultPlace.y,
                categoryCode: resultPlace.category_group_code,
                categoryName: resultPlace.category_group_name,
                province: "일단",
                city: "아무거나",
              };
              console.log(newPlace);
              setCourse({
                ...course,
                place: newPlace,
              });
              setIsPlaceSelected((isPlaceSelected) => !isPlaceSelected);
              setIsPlaceSelected(true);
              setSelectedUrl(resultPlace.place_url);
            }
          } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert("검색 결과가 존재하지 않습니다.");
          } else if (status === kakao.maps.services.Status.ERROR) {
            alert("검색 결과 중 오류가 발생했습니다.");
          }
        },
        searchOption
      );
    }
  };

  const handlePlaceConfirmClick = (e) => {
    e.preventDefault();
    console.log(selectedPlace);
    setCourseResult([]); // 기존 결과 초기화
    setIsPlaceSelected(true);
    setIsClick(true);
    setMapVisible(false);
  };

  const handleBackButtonClick = (e) => {
    e.preventDefault();
    setIsPlaceSelected(false); // 뒤로 가기 버튼을 누르면 장소 선택 상태 초기화
  };

  const itemRefreshBtn = () => {
    setCourseResult([]); // 기존 결과 초기화
    const newPageForm = { ...pageForm, page: pageForm.page + 1 };
    setPageForm(newPageForm);
    console.log(pageForm);
    recommendItem(planForm, pageForm)
      .then((response) => {
        console.log(response);
        setCourseResult(response);
        if (response) {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
  };

  const onChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const onBtnClick = (e) => {
    if (!course.arrivedTime.trim() || !course.cost.trim()) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    setShowContents(showContents); //내용 보이게 하기
    //TravelPlanForm의 courses에 course 등록
    if (confirm) {
      e.preventDefault();
      setBtnMessage("등록");
      setShowContents(!showContents); //내용 보이게 하기
    } else {
      e.preventDefault();
      onCourseInsert(course, course.place);
      setBtnMessage("수정");
      setShowContents(!showContents); //내용 보이게 하기
    }
    setConfirm((confirm) => !confirm);
  };

  const onDeleteClick = (e) => {
    e.preventDefault();
    onDeleteBtnClick(course);
  };

  //계획 내용 보는 버튼
  const showContentBtn = (e) => {
    e.preventDefault();
    setShowContents(!showContents); //내용 보이게 하기
  };

  return (
    <div className={styles.itemContainer}>
      {isPlaceSelected ? (
        <div className={styles.itemContentBox}>
          <div className={styles.itemTitle}>
            <label className={styles.titleLabel01}>장소</label>
            <p onClick={showContentBtn} className={styles.titleLabel02}>
              {course.place.name}
            </p>
          </div>
          {!showContents ? (
            <div className={styles.itemShowContent}>
              <div className={styles.itemContent}>
                <label className={styles.contentLabel02}>예상 도착시간</label>
                <input
                  className={styles.content04}
                  type='time'
                  itemContent
                  name='arrivedTime'
                  onChange={onChange}
                  disabled={confirm}
                  required
                  value={course.arrivedTime}
                />
              </div>
              <div className={styles.itemContent}>
                <label className={styles.contentLabel02}>예상 비용</label>
                <input
                  className={styles.content04}
                  type='number'
                  name='cost'
                  onChange={onChange}
                  disabled={confirm}
                  required
                  value={course.cost}
                />
              </div>
            </div>
          ) : (
            <div className={styles.container}>
              {isPlaceSelected ? (
                !isClick ? (
                  <div className={styles.selectResult}>
                    <div className={styles.reviewBox}>
                      <p className={styles.boxLabel01}>장소 선택</p>
                    </div>
                    <div className={styles.resultItem}>
                      <span className={styles.resultItemName}>
                        {selectedPlace.name}
                      </span>
                      <span className={styles.resultItemAddress}>
                        {selectedPlace.address}
                      </span>
                      <Link
                        to={selectedUrl}
                        target='_blank'
                        className={styles.resultItemLink}
                      >
                        Kakao Map으로 보기
                      </Link>
                      <div className={styles.btnContainer}>
                        <button
                          className={styles.btn02}
                          onClick={handlePlaceConfirmClick}
                        >
                          확인
                        </button>
                        <button
                          className={styles.btn02}
                          onClick={handleBackButtonClick}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null
              ) : (
                recommendationResult && (
                  <div>
                    <div className={styles.box}>
                      <div className={styles.reviewBox}>
                        <p className={styles.boxLabel01}>리뷰 기반 추천</p>
                      </div>
                      <div className={styles.headerBox}>
                        <p className={styles.headerLabel01}> {province} </p>
                        <p className={styles.headerLabel02}> 추천 장소</p>
                        <p className={styles.headerLabel03}> 추천 점수</p>
                      </div>
                      <div className={styles.contentResult}>
                        {courseResult.length === 0 ? (
                          // 로딩 중인 경우 "로딩 중" 메시지 표시
                          <img
                            src={loading}
                            alt='로딩'
                            width='100px'
                            className={styles.Spinner}
                          />
                        ) : (
                          courseResult.map((result, index) => (
                            <div
                              key={index}
                              className={styles.contentItem}
                              onClick={() => SearchResultClick(result)}
                            >
                              <div className={styles.itemHeader01}>
                                <span className={styles.itemName}>
                                  {result.place_name}
                                </span>
                                <span className={styles.itemCategory}>
                                  {result.category}
                                </span>
                              </div>
                              <div className={styles.itemHeader02}>
                                <span className={styles.itemAddress}>
                                  {result.address}
                                </span>
                                <span className={styles.itemScore}>
                                  {result.percentage_score}% 일치
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                        <div className={styles.refreshBox}>
                          <MdRefresh
                            className={styles.icon01}
                            onClick={itemRefreshBtn}
                          />
                          <p className={styles.boxLabel02}>다시 추천 받기</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
              <div
                className={styles.map}
                id={`${containerIdx}map${courseIdx}`}
                style={{
                  display: mapVisible ? "block" : "none",
                  width: "887px",
                  height: "420px",
                }}
              />
            </div>
          )}
          <div className={styles.itembtnContainer}>
            <button onClick={onBtnClick} className={styles.btn06}>
              {btnMessage}
            </button>
            <button onClick={onDeleteClick} className={styles.btn06}>
              삭제
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RecItem;
