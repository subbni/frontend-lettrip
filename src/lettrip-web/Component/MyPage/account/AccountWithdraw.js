/* 정보 수정 전, 비밀번호 확인창 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png";
import { getMyProfile } from "../../../Service/MyPageService";
import { confirmPassword, deleteAccount } from "../../../Service/AuthService";

import "../MyPage.css";

const AccountConfirm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      confirmPassword(password)
        .then((response) => {
          console.log(response);
          deleteAccount(id)
            .then((response) => {
              console.log(response);
              window.alert("회원 탈퇴가 완료되었습니다.");
              navigate("/");
            })
            .catch((e) => {
              console.log(e);
              window.alert("회원 탈퇴에 실패하였습니다. 다시 시도해주세요.");
            });
        })
        .catch((e) => {
          console.log(e);
          window.alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
        });
    }
  };*/

  return (
    <div className='account-modify-container'>
      <div className='account-modify-title'>회원 탈퇴</div>
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
      <div className='withdraw-confirm'>
        <p>(정말로 탈퇴하시겠습니까?)</p>
        <p>(맞으면 비밀번호를 입력해주세요)</p>
      </div>
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
        /*onClick={onSubmit}*/
      >
        탈퇴하기
      </button>
    </div>
  );
};

export default AccountConfirm;
