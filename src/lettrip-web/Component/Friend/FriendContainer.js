import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLoggedIn } from "../../Service/AuthService";
import { getMyProfile } from "../../Service/MyPageService";

import styles from "./Friend.module.css";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import { MdOutlineLocationOn, MdOutlineLocationOff } from "react-icons/md"; //gps on/off 아이콘
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi"; //성별 아이콘
import TestData from "./TestData";

function FriendContainer(pageForm) {
  const [friendMatchingList, setFriendMatchingList] = useState([]);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setFriendMatchingList(TestData);
  }, []);

  useEffect(() => {
    console.log(pageForm);
  }, [pageForm]);

  /*
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

  //return 부분에 넣기
  {profile.imageUrl !== null ? (
                    <img className={styles.profileImg} src={profile.imageUrl} />
                  ) : (
                    <img
                      className={styles.profileImg}
                      src={anonymous_profile}
                    />
                  )}
  */

  //날짜 형식 변경
  const formatDate = (date) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(date)
      .toLocaleDateString(undefined, options)
      .replace(/\.$/, "")
      .replace(/\s/g, "");
    return formattedDate;
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {friendMatchingList.map((friend, index) => (
          <div
            key={index}
            className={styles.boxItem}
            id={friend.id}
            onClick={() => navigate(`/friend/${friend.id}`)}
          >
            <div className={styles.friendInfo}>
              <p className={styles.infoContent01}>
                {friend.gps === 1 ? (
                  <>
                    <MdOutlineLocationOn className={styles.gpsIcon} /> GPS 정보
                    필요
                  </>
                ) : (
                  <>
                    <MdOutlineLocationOff className={styles.gpsIcon} /> GPS 정보
                    불필요
                  </>
                )}
              </p>
              <div className={styles.infoContent02}>
                <p className={styles.infoLabel01}>{friend.province}</p>
                <p className={styles.infoLabel02}>
                  {formatDate(friend.created_date)}
                </p>
              </div>
              <p className={styles.infoLabel03}>{friend.city}</p>
              <p className={styles.infoLabel04}>{friend.content}</p>
              <div className={styles.infoContent03}>
                <p className={styles.infoLabel05}>
                  {friend.gender === "남성" ? (
                    <PiGenderMaleBold className={styles.maleIcon} />
                  ) : (
                    <PiGenderFemaleBold className={styles.femaleIcon} />
                  )}
                </p>
                <p className={styles.infoLabel06}>{friend.birth_year}</p>
              </div>
              <div className={styles.infoContent04}>
                <p className={styles.infoLabel07}>
                  <img className={styles.profileImg} src={anonymous_profile} />
                </p>
                <div className={styles.infoContent05}>
                  <p className={styles.infoLabel08}>{friend.nickname}</p>
                  <p className={styles.infoLabel09}>
                    {friend.registration_date}
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

export default FriendContainer;
