import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkIfLoggedIn } from "../../../Service/AuthService";
import Moment from "moment";
import {
  getMyProfile,
  modifyMyImage,
  modifyMyNickname,
  modifyMyProfile,
} from "../../../Service/MyPageService";
import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png";
import { AiOutlineEdit } from "react-icons/ai";
import { IoIosCamera } from "react-icons/io";
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";
import { MdOutlineArrowBackIos } from "react-icons/md";
import styles from "./Account.module.css";

const AccountUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileForm, setProfileForm] = useState({
    nickname: "",
    sex: "",
    birthDate: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [showFileInput, setShowFileInput] = useState(false);

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
  }, [id]);

  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const handleWithdrawClick = () => {
    navigate("/mypage/withdraw");
  };

  const modifyImage = () => {
    setShowFileInput(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileForm({
        ...profileForm,
        image: reader.result,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onModifySubmit = (e) => {
    e.preventDefault();
    if (window.confirm("정보를 수정하시겠습니까?")) {
      if (profileForm.nickname !== profile.nickname) {
        const newNickname = {
          nickname: profileForm.nickname,
        };
        modifyMyNickname(newNickname)
          .then((response) => {
            console.log(response);
            console.log(newNickname);
            alert("닉네임 수정이 완료되었습니다.");
            navigate("/mypage");
          })
          .catch((e) => {
            console.log(e);
            console.log(newNickname);
            alert("닉네임 수정에 실패하였습니다. 다시 시도해주세요.");
          });
      }
      modifyMyProfile(profileForm)
        .then((response) => {
          console.log("프로필 정보 업데이트 성공", response);
          alert("프로필 정보가 성공적으로 업데이트되었습니다.");
          navigate("/mypage");
        })
        .catch((error) => {
          console.error("프로필 정보 업데이트 실패", error);
          alert("프로필 정보 업데이트 중 오류가 발생했습니다.");
        });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <MdOutlineArrowBackIos className={styles.backIcon} />
        <h3 className={styles.headerText}>프로필</h3>
      </div>
      <hr className={styles.hr01} />
      <div className={styles.profileContainer}>
        <div className={styles.profileImageContainer}>
          {profile.imageUrl !== null ? (
            <img
              className={styles.profileImg}
              src={profile.imageUrl}
              alt='프로필 이미지'
            />
          ) : (
            <img
              className={styles.profileImg}
              src={anonymous_profile}
              alt='익명 프로필 이미지'
            />
          )}
          <IoIosCamera className={styles.cameraIcon} onClick={modifyImage} />
        </div>
        {showFileInput && (
          <input
            className={styles.profileImageUpload}
            type='file'
            id='upload-image'
            accept='image/*'
            onChange={handleFileSelect}
          />
        )}
        <div className={styles.profileInputContainer}>
          <input
            className={styles.profileNickname}
            type='text'
            id='nickname'
            name='nickname'
            value={profileForm.nickname}
            placeholder={profile.nickname}
            onChange={(e) => {
              setProfileForm({
                ...profileForm,
                nickname: e.target.value,
              });
            }}
          />
          <AiOutlineEdit className={styles.editIcon} onClick={modifyImage} />
        </div>
        <p className={styles.profileEmail}>{profile.email}</p>
        <div className={styles.profileDetail}>
          <div className={styles.profileInfo}>
            <span className={styles.profileText}>이름</span>
            <span className={styles.profileName}>{profile.name}</span>
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileText}>비밀번호</span>
            <input
              className={styles.profilePassword}
              type='password'
              id='password'
              name='password'
              required
              value={profileForm.password}
              onChange={(e) => {
                setProfileForm({
                  ...profileForm,
                  password: e.target.value,
                });
              }}
            />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileText}>성별</span>
            <div className={styles.profileSexContainer}>
              <input
                type='radio'
                id='male'
                name='sex'
                value='MALE'
                placeholder={profile.sex}
                checked={profileForm.sex === "MALE"}
                onChange={(e) => {
                  setProfileForm({
                    ...profileForm,
                    sex: e.target.value,
                  });
                }}
              />
              <label className={styles.profileMale} htmlFor='male'>
                남성 <PiGenderMaleBold className={styles.maleIcon} />
              </label>
              <input
                type='radio'
                id='female'
                name='sex'
                value='FEMALE'
                placeholder={profile.sex}
                checked={profileForm.sex === "FEMALE"}
                onChange={(e) => {
                  setProfileForm({
                    ...profileForm,
                    sex: e.target.value,
                  });
                }}
              />
              <label className={styles.profileFemale} htmlFor='female'>
                여성 <PiGenderFemaleBold className={styles.femaleIcon} />
              </label>
            </div>
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileText}>생년월일</span>
            <input
              className={styles.profileBirthDate}
              type='date'
              id='birthDate'
              name='birthDate'
              required
              placeholder={profile.birthDate}
              value={profileForm.birthDate}
              onChange={(e) => {
                setProfileForm({
                  ...profileForm,
                  birthDate: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <button className={styles.profileModifyButton} onClick={onModifySubmit}>
          수정 완료
        </button>
      </div>
    </div>
  );
};

export default AccountUpdate;
