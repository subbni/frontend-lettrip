import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import no_image from "../../../../image/travel/no_image.png";

import { getMyProfile } from "../../../Service/MyPageService";
import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png"; //프로필 이미지

import styles from "./Search.module.css";

const ResultItem = ({ travel, onClick }) => {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    //프로필 사진 가져오기
    getMyProfile()
      .then((response) => {
        setProfile(response);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  const formatDate = (date) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(date)
      .toLocaleDateString(undefined, options)
      .replace(/\s/g, "");
    return formattedDate;
  };

  return (
    <div
      className={styles.searchResult_item}
      id={travel.id}
      onClick={() => navigate(`/travel/course/review/${travel.id}`)}
    >
      <div className={styles.writerInfo}>
        {profile.imageUrl !== null ? (
          <img className={styles.writerImage} src={profile.imageUrl} />
        ) : (
          <img className={styles.writerImage} src={anonymous_profile} />
        )}

        <div className={styles.writerNickname}>{travel.writerNickname}</div>
      </div>
      <div className={styles.dateInfo}>
        {formatDate(travel.departDate)} ~ {formatDate(travel.lastDate)}
      </div>
      {travel.mainImageUrl === null ? (
        <img className={styles.mainImage} src={no_image} />
      ) : (
        <img className={styles.mainImage} src={travel.mainImageUrl} />
      )}
      <div className={styles.travelInfo_container}>
        <div className={styles.travelInfo_title}>{travel.title}</div>
        <div className={styles.travelInfo_place}>
          <div className={styles.travel_place_main}>
            {travel.city}
            <span className={styles.travel_place_sub}> {travel.province}</span>
          </div>
        </div>
      </div>

      <div className={styles.travelInfo}>
        <div>{travel.numberOfCourses}개</div>
        <div>#{travel.travelTheme}</div>
        <div>{travel.totalCost}원 / 인</div>
      </div>
    </div>
  );
};

export default ResultItem;
