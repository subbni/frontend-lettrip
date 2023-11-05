import { useEffect, useState } from "react";
import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png";
import { getMyProfile } from "../../../Service/MyPageService";
import styles from "../MyPage.module.css";

const ProfileContainer = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    getMyProfile()
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

      <div className={styles.profileNickname}>{profile.nickname}</div>
      <div className={styles.profileName}>{profile.nickname}</div>
      <div className={styles.profileEmail}>{profile.email}</div>
      <div className={styles.profilePoint}>
        나의 포인트 <span> {profile.point}P</span>
      </div>
      <div className={styles.profilePoint}>
        매칭 히스토리 : 총
        <span>
          더하기 회 (성공 {profile.meetUpCompletedCount}회 실패
          {profile.meetUpCancelledCount}회)
        </span>
      </div>
    </div>
  );
};

export default ProfileContainer;
