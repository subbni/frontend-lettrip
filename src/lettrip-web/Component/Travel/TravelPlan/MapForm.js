/*global kakao*/
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

import styles from "./Map.module.css";

const MapForm = ({ onPlaceSelect, containerIdx, courseIdx }) => {
  const [mapId, setMapId] = useState(containerIdx + "map" + courseIdx);
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
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
  const [searchResults, setSearchResults] = useState([]);

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
    console.log(selectedPlace);
  }, [selectedPlace]);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() === "") return;
    if (map) {
      const ps = new kakao.maps.services.Places(map);
      const searchOption = {
        size: 10, // 한 번에 10개까지 보여주기
      };
      ps.keywordSearch(keyword, placesSearchCB, searchOption);
    }
    setSearchResults([]);
    setIsPlaceSelected(false);
  };

  const placesSearchCB = (data, status, pagination) => {
    if (status === kakao.maps.services.Status.OK) {
      setSearchResults(data);
      displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
    }
  };

  const displayPlaces = (places) => {
    removeAllMarkers();
    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers = [];
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      const position = new kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(position, i);
      kakao.maps.event.addListener(marker, "click", function () {
        // 마커 클릭하면 selectedPlace로 설정
        console.log(place);
        const position = new kakao.maps.LatLng(place.y, place.x);
        map.panTo(position); // 해당 위치로 지도 이동

        // address를 동까지만 자르기
        const addressParts = place.address_name.split(" ");
        const address = `${addressParts[0]} ${addressParts[1]} ${addressParts[2]}`;
        console.log(address);

        setSelectedPlace({
          address,
          name: place.place_name,
          xpoint: place.x,
          ypoint: place.y,
          categoryCode: place.category_group_code,
          categoryName: place.category_group_name,
          province: "일단",
          city: "아무거나",
        });
        setIsPlaceSelected(true);
        setSelectedUrl(place.place_url);
      });
      newMarkers.push(marker);
      bounds.extend(position);
    }

    setMarkers(newMarkers);
    map.setBounds(bounds);
  };
  // 검색 결과 항목 클릭 핸들러 추가
  const SearchResultClick = (place) => {
    const position = new kakao.maps.LatLng(place.y, place.x);
    map.panTo(position); // 해당 위치로 지도 이동

    // address를 동까지만 자르기
    const addressParts = place.address_name.split(" ");
    const address = `${addressParts[0]} ${addressParts[1]} ${addressParts[2]}`;
    console.log(address);

    setSelectedPlace({
      address,
      name: place.place_name,
      xpoint: place.x,
      ypoint: place.y,
      categoryCode: place.category_group_code,
      categoryName: place.category_group_name,
      province: "일단",
      city: "아무거나",
    });
    setIsPlaceSelected(true);
    setSelectedUrl(place.place_url);
  };

  const addMarker = (position, idx) => {
    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
    const imageSize = new kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691),
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
      offset: new kakao.maps.Point(13, 37),
    };
    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions
    );
    const marker = new kakao.maps.Marker({
      position,
      image: markerImage,
    });

    marker.setMap(map);
    return marker;
  };

  const removeAllMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const handlePlaceConfirmClick = () => {
    onPlaceSelect(selectedPlace);
    setKeyword(""); // 검색어 초기화
    setSearchResults([]); //검색 목록 초기화
    setIsPlaceSelected(false); // 장소 선택 상태 초기화
    removeAllMarkers(); //마커 초기화
  };

  const handleBackButtonClick = () => {
    handleSearch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.searchForm}>
          <input
            type='text'
            placeholder='장소를 입력해주세요.'
            value={keyword}
            onChange={handleKeywordChange}
          />
          <button className={styles.btn01} onClick={handleSearch}>
            <AiOutlineSearch className={styles.icon01} />
          </button>
        </div>
        {isPlaceSelected ? (
          <div className={styles.contentResult}>
            <div className={styles.contentItem}>
              <span className={styles.itemName}>{selectedPlace.name}</span>
              <span className={styles.itemAddress}>
                {selectedPlace.address}
              </span>
              <Link
                to={selectedUrl}
                target='_blank'
                className={styles.itemLink}
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
        ) : (
          <div>
            <div className={styles.contentResult}>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className={styles.contentItem}
                  onClick={() => SearchResultClick(result)}
                >
                  <span className={styles.itemName}>{result.place_name}</span>
                  <span className={styles.itemAddress}>
                    {result.address_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div
        className={styles.map}
        id={`${containerIdx}map${courseIdx}`}
        style={{ width: "580px", height: "720px" }}
      />
    </div>
  );
};

export default MapForm;
