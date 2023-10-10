import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; //overlay 라이브러리 사용하기
import TapData from "./TapData"; // TapData 가져오기

import styles from "./Detail.module.css";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import {
  PiGenderFemaleBold,
  PiGenderMaleBold,
  PiHandTap,
} from "react-icons/pi"; //성별 아이콘, 클릭 아이콘

function FriendTap() {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]); //찌른 사람들 정보 가져오기
  const [peopleImg, setPeopleImg] = useState([]); //찌른 사람들 3명까지 정보가져오기
  const [showTapPeople, setShowTapPeople] = useState(false); //찌른 사람들 정보 보기

  useEffect(() => {
    setPeople(TapData);
    // TapData 배열에서 최대 3명까지의 사진을 가져와서 설정
    const maxPeopleToShow = 3;
    setPeopleImg(TapData.slice(0, maxPeopleToShow));
  }, []);

  //나이 계산하기
  function calculateAge(birthDate) {
    const birthYear = parseInt(birthDate.split(".")[0]);
    const birthMonth = parseInt(birthDate.split(".")[1]);
    const birthDay = parseInt(birthDate.split(".")[2]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    let age = currentYear - birthYear;

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthDay)
    ) {
      age--;
    }

    return age;
  }

  const onClickTap = (e) => {
    e.preventDefault();
    console.log("쿡 찌름");
  };

  const onClickTapPeople = (e) => {
    e.preventDefault();
    setShowTapPeople(true);
    console.log("정보 보기");
  };

  return (
    <div className={styles.tapContainer}>
      <PiHandTap className={styles.tapIcon} onClick={onClickTap} />
      <div className={styles.tapImgContainer}>
        <img
          className={styles.tapProfileImg01}
          src={peopleImg[0]?.profile_picture || anonymous_profile}
          alt='Profile 0'
        />
        <img
          className={styles.tapProfileImg02}
          src={peopleImg[1]?.profile_picture || anonymous_profile}
          alt='Profile 1'
        />
        <img
          className={styles.tapProfileImg03}
          src={peopleImg[2]?.profile_picture || anonymous_profile}
          alt='Profile 2'
        />
      </div>
      <p className={styles.tapLabel01} onClick={onClickTapPeople}>
        {people.length}명이 쿡 찔렀습니다.
      </p>
      <Modal
        isOpen={showTapPeople}
        onRequestClose={() => setShowTapPeople(false)}
        style={{
          content: {
            maxWidth: "630px", // Modal의 최대 너비 설정
            margin: "auto", // 가운데 정렬
            padding: "30px 35px", // 내용 패딩
          },
        }}
      >
        <div>
          <button
            className={styles.tapCloseBtn}
            onClick={() => setShowTapPeople(false)}
          >
            x
          </button>
          <h2 className={styles.tapPeopleCount}>
            {people.length}명이 쿡 찔렀습니다.
          </h2>

          <div className={styles.tapPeopleList}>
            {people.map((person, index) => (
              <div key={person.id} className={styles.peopleContainer}>
                <div className={styles.tapPeopleHeader}>
                  <img
                    className={styles.tapPeopleInfoImg}
                    src={person.profile_picture || anonymous_profile}
                    alt={`Profile ${index}`}
                  />
                  <div className={styles.tapPeopleInfo}>
                    <p className={styles.tapInfoContent01}>
                      {person.writerName} ({person.nickname})
                    </p>
                    <div className={styles.tapInfoContent02}>
                      <p className={styles.tapInfoLable01}>
                        {calculateAge(person.birth_year)}세
                      </p>
                      <p className={styles.tapInfoLable02}>
                        {person.gender === "남성" ? (
                          <PiGenderMaleBold className={styles.maleIcon} />
                        ) : (
                          <PiGenderFemaleBold className={styles.femaleIcon} />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <p className={styles.tapInfoContent03}>{person.content}</p>
                <button className={styles.tapInfoBtn}> 수락 </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FriendTap;
