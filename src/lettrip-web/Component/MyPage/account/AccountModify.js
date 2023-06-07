import { useEffect, useState } from "react";
import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png";
import { getMyProfile, modifyMyProfile } from "../../../Service/MyPageService";
import { AiOutlineEdit } from "react-icons/ai";

import "../MyPage.css";

const AccountModify = () => {
  const [accountForm, setAccountForm] = useState({
    password: "",
    name: "",
  });
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
    const changingField = e.target.name;
    setAccountForm({
      ...accountForm,
      [changingField]: e.target.value,
    });
  };
  //정보 수정 요청하기
  const onSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("정보를 수정하시겠습니까?")) {
      modifyMyProfile(accountForm)
        .then((response) => {
          console.log(response);
          window.alert("정보 수정이 완료되었습니다.");
        })
        .catch((e) => {
          console.log(e);
          window.alert("정보 수정에 실패하였습니다. 다시 시도해주세요.");
        });
    }
  };

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

      <div className='profile_nickname'>{profile.nickname}</div>
      <p className='nickname-modify-button'>
        <AiOutlineEdit />
      </p>
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
            value={accountForm.password}
            onChange={onFormChange}
          />
        </div>

        <div className='profile-modify-box'>
          <p className='profile-modify-text'>이름</p>
          <input
            className='profile-name'
            type='text'
            id='name'
            name='name'
            required
            placeholder={profile.name}
            value={accountForm.name}
            onChange={onFormChange}
          />
        </div>
      </div>
      <button
        className='profile-modify-submit'
        type='submit'
        onClick={onSubmit}
      >
        수정 완료
      </button>
    </div>
  );
};

export default AccountModify;
