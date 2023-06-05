import { useEffect, useState } from "react";
import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png";
import { getMyProfile } from "../../../Service/MyPageService";

const ProfileContainer = () => {
  const [profile, setProfile] = useState({});
  useEffect(() => {
    getMyProfile()
      .then((response) => {
        setProfile(response);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  return (
    <div>
      {profile.imageUrl !== null ? (
        <img className='mypage_profile_image' src={profile.imageUrl} />
      ) : (
        <img className='mypage_profile_image' src={anonymous_profile} />
      )}

      <div className='profile_nickname'>{profile.nickname}</div>
      <div className='profile_email'>{profile.email}</div>
      <div className='profile_point'>
        나의 포인트 <span> {profile.point}P</span>
      </div>
    </div>
  );
};

export default ProfileContainer;
