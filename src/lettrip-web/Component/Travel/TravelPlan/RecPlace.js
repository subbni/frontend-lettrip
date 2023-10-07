/*global kakao*/
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recommendPlace } from "../../../Service/TravelService";

import { AiFillStar } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";

import styles from "./Rec.module.css";

const RecPlace = ({
  onPlaceSelect,
  containerIdx,
  courseIdx,
  recommendationResult,
  province,
  pageForm,
  setPageForm,
  planForm,
}) => {
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
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [searchResults, setSearchResults] = useState([]); //선택한 장소 결과

  const [courseResult, setCourseResult] = useState([]); //머신러닝 결과 받아오기
  const [isLoading, setIsLoading] = useState(true); //로딩중인지 아닌지

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
  }, []);

  useEffect(() => {
    if (searchResults.length > 0 || isPlaceSelected) {
      setMapVisible(true);
    } else {
      setMapVisible(false);
    }
  }, [searchResults, isPlaceSelected]);

  useEffect(() => {
    console.log(selectedPlace);
  }, [selectedPlace]);

  useEffect(() => {
    //결과 가져오기
    setCourseResult(recommendationResult);
    console.log(recommendationResult);
  }, [recommendationResult]);

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
              setSelectedPlace({
                address: resultPlace.address_name,
                name: resultPlace.place_name,
                xpoint: resultPlace.x,
                ypoint: resultPlace.y,
                categoryCode: resultPlace.category_group_code,
                categoryName: resultPlace.category_group_name,
                province: "일단",
                city: "아무거나",
              });
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
    onPlaceSelect(selectedPlace);
    setIsPlaceSelected(false); // 장소 선택 상태 초기화
  };

  const handleBackButtonClick = (e) => {
    e.preventDefault();
    setIsPlaceSelected(false); // 뒤로 가기 버튼을 누르면 장소 선택 상태 초기화
  };

  const placeRefreshBtn = (e) => {
    e.preventDefault(); //새로고침 버튼 누르기
    const newPageForm = { ...pageForm, page: pageForm.page + 1 };
    setPageForm(newPageForm);
    console.log(pageForm);
    recommendPlace(planForm, pageForm)
      .then((response) => {
        console.log(response);
        setCourseResult(response);
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
  };

  return (
    <div className={styles.container}>
      {isPlaceSelected ? (
        <div className={styles.selectResult}>
          <div className={styles.reviewBox}>
            <p className={styles.boxLabel01}>장소 선택</p>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultItemName}>{selectedPlace.name}</span>
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
              <button className={styles.btn02} onClick={handleBackButtonClick}>
                취소
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.box}>
            <div className={styles.reviewBox}>
              <p className={styles.boxLabel01}>장소 기반 추천</p>
            </div>
            <div className={styles.headerBox}>
              <p className={styles.headerLabel01}> {province} </p>
              <p className={styles.headerLabel02}> 추천 장소</p>
              <p className={styles.headerLabel03}> 사용자 평균 별점</p>
            </div>
            <div className={styles.contentResult}>
              {isLoading ? (
                // 로딩 중인 경우 "로딩 중" 메시지 표시
                <div className={styles.loading}>로딩 중...</div>
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
                      <AiFillStar className={styles.star} />
                      <span className={styles.itemRating}>
                        {result.pred_score}
                      </span>
                    </div>
                    <div className={styles.refreshBox}>
                      <MdRefresh
                        className={styles.icon01}
                        onClick={placeRefreshBtn}
                      />
                      <p className={styles.boxLabel02}>다시 추천 받기</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
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
  );
};

export default RecPlace;
