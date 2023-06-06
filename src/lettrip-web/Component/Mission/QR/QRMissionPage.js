/*global kakao*/

import { useEffect, useState } from "react";
import { getLocation } from "./getLocation";
import { useSearchParams } from "react-router-dom";
import { saveMission } from "../../../Service/MissionService";
import mission_image from "../../../../image/mission/qr_mission_image.png";
import fail_image from "../../../../image/mission/fail-image.png";
import qr_wait_image from "../../../../image/mission/qr-wait.png";
import qr_complete_image from "../../../../image/mission/qr_complete_image.png";

import "./QR.css";

const QRMissionPage = () => {
  const radius = 0.5; // 반경 500m = 0.5km
  const [userLocation, setUserLocation] = useState(window.location.search);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [isMissionSuccess, setIsMissionSuccess] = useState(false);
  const [isMissionFailed, setIsMissionFailed] = useState(false);
  const [isMissionCompleted, setIsMissionCompleted] = useState(null);
  const [missionForm, setMissionForm] = useState({
    email: "",
    xpoint: null,
    ypoint: null,
    accomplishedDate: "",
  });
  const [result, setResult] = useState({
    placeName: "",
    distance: "",
  });
  // x=128.75311307212075&y=35.83218123950425&place=영남대학교 천마아트센터
  // x=128.545283364225&y=35.8237433070314&place=월촌역교차로
  // x=129.159854668484&y=35.1585232170784&place=해운대해수욕장

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

  //// 미션 검증

  const getDistance = (lat1, lon1, lat2, lon2) => {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371; // 지구 반지름 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 두 지점 간 거리 (km)
    return distance;
  };

  const verifyLocation = () => {
    const xpoint = parseFloat(searchParams.get("x"));
    const ypoint = parseFloat(searchParams.get("y"));
    const placeName = decodeURI(searchParams.get("place"));
    console.log(`xpoint=${xpoint} ypoint=${ypoint}`);
    const distance = getDistance(
      ypoint,
      xpoint,
      userLocation.latitude,
      userLocation.longitude
    );

    setResult({
      placeName: placeName,
      distance: distance.toFixed(0),
    });

    if (distance <= radius) {
      console.log(distance);
      alert(`${placeName} 미션 인증 완료!`);
      setIsMissionSuccess(true);
      setMissionForm({
        ...missionForm,
        xpoint: xpoint,
        ypoint: ypoint,
        accomplishedDate: getFormattedDate(new Date()),
      });
    } else {
      setIsMissionFailed(true);
      console.log(distance);
      alert(
        `미션 인증 실패 !
        GPS가 ${placeName}의 반경 500m내에 존재하지 않습니다.
        현재 ${placeName}와(과)의 거리는 ${distance}km입니다.`
      );
    }
  };

  //// 검증 성공 후 처리

  const handleMissionComplete = () => {
    console.log(missionForm);
    saveMission(missionForm)
      .then((response) => {
        if (response.success) {
          alert("미션 성공");
          setIsMissionCompleted(true);
        } else {
          alert("미션 실패. 원인:" + response.message);
        }
      })
      .catch((e) => {
        alert("오류 발생");
        console.log(e);
      });
  };

  const getFormattedDate = (date) => {
    let formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 9
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      (date.getDate() < 9 ? "0" + date.getDate() : date.getDate());
    return formattedDate;
  };

  //// event 처리
  const onConfirmBtnClick = (e) => {
    e.preventDefault();
    handleMissionComplete();
  };

  const onMissionFormChange = (e) => {
    setMissionForm((missionForm) => ({
      ...missionForm,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='qr_mission_page'>
      {isLocationFetched ? (
        <div>
          {isMissionSuccess ? (
            <div>
              {isMissionCompleted ? (
                <div className='qr_complete_container'>
                  <img className='mission_img' src={qr_complete_image} />
                  <h1>적립 완료!</h1>
                  <div className='qr_text'>
                    <span>{missionForm.email}</span>로 <span>500p</span>가
                    적립되었습니다
                  </div>
                </div>
              ) : (
                <div>
                  <img className='mission_success_img' src={mission_image} />
                  <h1 className='qr_h1'> 미션 성공!</h1>
                  <div className='qr_text'>
                    포인트 적립을 위해 가입된 이메일을 입력해주세요.
                  </div>
                  <div>
                    <form onSubmit={onConfirmBtnClick}>
                      <input
                        className='qr_email_input'
                        type='email'
                        name='email'
                        placeholder='이메일 입력해서 적립받기'
                        onChange={onMissionFormChange}
                      ></input>
                      <button className='qr_confirm_btn' type='submit'>
                        확인
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {isMissionFailed ? (
                <div className='qr_fail_container'>
                  <img className='mission_img' src={fail_image} />
                  <h1>미션 실패</h1>
                  <div className='qr_text'>
                    현재 GPS가 <span>{result.placeName}</span>의 반경
                    <span>500m</span>내에 존재하지 않습니다
                  </div>
                  <div className='qr_text'>
                    현재 <span>{result.placeName}</span>와(과)의 거리는
                    <span>{result.distance}km</span>
                    입니다
                  </div>
                </div>
              ) : (
                <div>
                  <div className='qr_text'>현재 위치 파악 완료!</div>
                  <button className='qr_mission_btn' onClick={verifyLocation}>
                    미션 완료 요청하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <img className='mission_img' src={qr_wait_image} />
        </div>
      )}
    </div>
  );
};

export default QRMissionPage;
