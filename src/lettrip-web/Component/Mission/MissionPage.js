/*global kakao*/

import { useEffect, useState } from "react";
import { getLocation } from "./getLocation";
import { useSearchParams } from "react-router-dom";

const MissionPage = () => {
  const radius = 500; // 반경 500m
  const [userLocation, setUserLocation] = useState(window.location.search);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  useEffect(() => {
    async function fetchLocation() {
      const location = await getLocation();
      console.log(location);
      setUserLocation(location);
      setIsLocationFetched(true);
    }
    fetchLocation();
    console.log(window.location.search);
  }, []);
  // x=128.75311307212075&y=35.83218123950425&place=영남대학교 천마아트센터
  const verifyLocation = () => {
    const xpoint = parseInt(searchParams.get("x"));
    const ypoint = parseInt(searchParams.get("y"));
    const placeName = decodeURI(searchParams.get("place"));

    const distance = getDistance(
      xpoint,
      ypoint,
      userLocation.latitude,
      userLocation.longitude
    );
    if (distance < radius) {
      console.log(`${placeName} 미션 인증 완료!`);
    } else {
      console.log(
        `${placeName} 미션 인증 실패. GPS가 미션 장소의 반경 500m내에 존재하지 않습니다.`
      );
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    let R = 6371; // 지구 반지름 in km
    let dLat = (lat1 - lat2) * (Math.PI / 180);
    let dLon = (lon1 - lon2) * (Math.PI / 180);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // 거리차 in km
    return d * 1000; // m 단위로 변경
  };
  return (
    <div>
      {isLocationFetched ? (
        <div>
          <p>현재 위치 파악 완료</p>
          <button onClick={verifyLocation}>미션 완료 요청하기</button>
        </div>
      ) : (
        <div>GPS 사용을 허용해주세요.</div>
      )}
    </div>
  );
};

export default MissionPage;
