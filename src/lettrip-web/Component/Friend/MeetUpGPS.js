import React, { useState, useEffect } from "react";
import GPS_SPinner from "../../../image/GPS_Spinner.gif";
import styles from "./MeetUp.module.css";

const MeetUpGPS = ({ onAddressUpdate }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("로딩 중..."); // 초기값을 "로딩 중..."으로 설정
  const [isFetching, setIsFetching] = useState(true); // 검색 중 여부

  const convertCoordinatesToAddress = (latitude, longitude) => {
    const apiUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`;
    const apiKey = "7563f733b3d43e647478b5e1d7817a15"; // REST API 키

    fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.documents && data.documents.length > 0) {
          const addressParts =
            data.documents[0].road_address.address_name.split(" ");
          const address = `${addressParts[0]} ${addressParts[1]}`;
          setAddress(address); // 주소를 상태에 업데이트
          onAddressUpdate(address); //Template로 address 정보 보내기
        } else {
          console.error("주소 정보를 찾을 수 없습니다.");
        }
      })
      .catch((error) => {
        console.error("주소 정보를 가져오는데 실패했습니다.", error);
      })
      .finally(() => {
        setIsFetching(false); // 검색이 완료되면 검색 중 상태를 false로 변경
      });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          //위도와 경도
          setLatitude(lat);
          setLongitude(lon);
          // 검색 중 상태를 true로 설정
          setIsFetching(true);
          // 좌표를 주소로 변환하는 함수 호출
          convertCoordinatesToAddress(lat, lon);
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다.", error);
        }
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  return (
    <div className={styles.gpsBox}>
      {isFetching ? (
        <img
          src={GPS_SPinner}
          alt='로딩'
          width='22px'
          className={styles.gpsSpinner}
        />
      ) : (
        <p className={styles.gpsText}>GPS</p>
      )}
    </div>
  );
};

export default MeetUpGPS;
