import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png";
import { getMyProfile } from "../../../Service/MyPageService";
import Moment from "moment"; //날짜 및 시간 표시 라이브러리
import styles from "../MyPage.module.css";
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi"; //성별 아이콘

const ProfileContainer = () => {
  const { id } = useParams;
  const [profile, setProfile] = useState({});

  useEffect(() => {
    getMyProfile(id)
      .then((response) => {
        setProfile(response);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  return (
    <div className={styles.profileContent}>
      {profile.imageUrl !== null ? (
        <img className={styles.profileImg} src={profile.imageUrl} />
      ) : (
        <img className={styles.profileImg} src={anonymous_profile} />
      )}
      <p className={styles.profileNickname}>{profile.nickname}</p>

      <div className={styles.profileInfo}>
        <p className={styles.profileName}>{profile.name}</p>
        {profile.sex === "MALE" ? (
          <PiGenderMaleBold className={styles.maleIcon} />
        ) : (
          <PiGenderFemaleBold className={styles.femaleIcon} />
        )}
        <p className={styles.profileBirthDate}>
          {Moment(profile.birthDate).format("YYYY.MM.DD")}
        </p>
      </div>
      <div className={styles.profilePoint}>
        나의 포인트 <span> {profile.point}P</span>
      </div>
      <div className={styles.profileMeetUpCount}>
        매칭 히스토리 : 총{" "}
        <span>
          {profile.meetUpCompletedCount + profile.meetUpCancelledCount}회 (성공{" "}
          {profile.meetUpCompletedCount}회 실패 {profile.meetUpCancelledCount}
          회)
        </span>
      </div>
    </div>
  );
};

export default ProfileContainer;
