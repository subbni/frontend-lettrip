/* 정보 수정 전, 비밀번호 확인창 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png";
import { getMyProfile } from "../../../Service/MyPageService";
import { confirmPassword } from "../../../Service/AuthService";

import "../MyPage.css";

const AccountConfirm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
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

  //정보 입력
  const onFormChange = (e) => {
    const { name, value } = e.target;
    setPassword(value);
  };

  //비밀번호 확인 요청하기
  /*const onSubmit = (e) => {
    e.preventDefault();
      confirmPassword(password)
        .then((response) => {
          console.log(response);
          window.alert("본인 확인이 완료되었습니다.");
          navigate("/mypage/modify");
        })
        .catch((e) => {
          console.log(e);
          window.alert("본인 확인에 실패하였습니다. 다시 시도해주세요.");
        });
    }
  };*/

  return (
    <div className='account-modify-container'>
      <div className='account-modify-title'>정보 수정</div>
      {profile.imageUrl !== null ? (
        <img
          className='mypage_profile_image'
          src={profile.imageUrl}
          alt='프로필 이미지'
        />
      ) : (
        <img
          className='mypage_profile_image'
          src={anonymous_profile}
          alt='익명 프로필 이미지'
        />
      )}

      <p className='profile_nickname'>{profile.nickname}</p>

      <div className='profile_email'>{profile.email}</div>
      <div className='profile-modify-input'>
        <div className='profile-modify-box'>
          <p className='profile-modify-text'>비밀번호</p>
          <input
            className='profile-password'
            type='password'
            id='password'
            name='password'
            required
            placeholder=''
            value={password}
            onChange={onFormChange}
          />
        </div>
      </div>
      <button
        className='profile-modify-submit'
        type='submit'
        /* onClick={onSubmit} */
      >
        확인
      </button>
    </div>
  );
};

export default AccountConfirm;
