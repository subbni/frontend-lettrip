import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Moment from "moment"; //날짜 및 시간 표시 라이브러리
import styles from "./MeetUp.module.css";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import { MdOutlineLocationOn, MdOutlineLocationOff } from "react-icons/md"; //gps on/off 아이콘
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi"; //성별 아이콘

function MeetUpContainer({ meetUpPostList }) {
  const [friendMatchingList, setFriendMatchingList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFriendMatchingList(meetUpPostList);
    console.log(friendMatchingList);
  }, [meetUpPostList]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {friendMatchingList &&
          friendMatchingList.map((post, index) => (
            <div
              key={index}
              className={styles.boxItem}
              id={post.id}
              onClick={() => navigate(`/friend/${post.id}`)}
            >
              <div>
                <p className={styles.infoContent01}>
                  {post.isGPSEnabled === true ? (
                    <>
                      <MdOutlineLocationOn className={styles.gpsIcon} /> GPS
                      정보 필요
                    </>
                  ) : (
                    <>
                      <MdOutlineLocationOff className={styles.gpsIcon} /> GPS
                      정보 불필요
                    </>
                  )}
                </p>
                <div className={styles.infoContent02}>
                  <p className={styles.contentProvince}>{post.province}</p>
                  <p className={styles.contentMeetUpDate}>
                    {Moment(post.meetUpDate).format("YY.MM.DD")}
                  </p>
                </div>
                <p className={styles.contentCity}>{post.city}</p>
                <p className={styles.contentTitle}>{post.title}</p>
                <div className={styles.infoContent03}>
                  <p className={styles.contentSex}>
                    {post.userDto.sex === "남성" ? (
                      <PiGenderMaleBold className={styles.maleIcon} />
                    ) : (
                      <PiGenderFemaleBold className={styles.femaleIcon} />
                    )}
                  </p>
                  <p className={styles.contentBirthDate}>
                    {Moment(post.userDto.birthDate).format("YYYY.MM.DD")}
                  </p>
                </div>
                <div className={styles.infoContent04}>
                  <p className={styles.contentProfile}>
                    <img
                      className={styles.profileImg}
                      src={anonymous_profile}
                    />
                  </p>
                  <div className={styles.infoContent05}>
                    <p className={styles.contentNickname}>
                      {post.userDto.nickname}
                    </p>
                    <p className={styles.contentCreatedDate}>
                      {Moment(post.createdDate).format("YYYY.MM.DD")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MeetUpContainer;
