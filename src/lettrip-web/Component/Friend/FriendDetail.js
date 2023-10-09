import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getMyProfile } from "../../Service/MyPageService";

import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import { MdOutlineLocationOn, MdOutlineLocationOff } from "react-icons/md"; //gps on/off 아이콘
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi"; //성별 아이콘
import { TbMap2 } from "react-icons/tb";
import styles from "./Detail.module.css";

import TestData2 from "./TestData2";

function FriendDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    // TestData2 배열에서 특정 ID에 해당하는 게시물을 찾아서 post 상태에 저장
    const selectedPost = TestData2.find((item) => item.id === parseInt(id));
    setPost(selectedPost);
  }, [id]);

  useEffect(() => {
    //게시글 작성자와 로그인 사용자 동일 여부 확인하기
    const storedEmail = localStorage.getItem("email");
    if (post.writerEmail === storedEmail) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [post]);

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
  return (
    <div className={styles.page}>
      {post && (
        <div className={styles.header} key={post.id}>
          {/*제목 부분 내용*/}
          <p className={styles.headerContent01}>
            {post.gps === 1 ? (
              <>
                <MdOutlineLocationOn className={styles.gpsIcon} /> GPS 정보 필요
              </>
            ) : (
              <>
                <MdOutlineLocationOff className={styles.gpsIcon} /> GPS 정보
                불필요
              </>
            )}
          </p>
          <div className={styles.headerContent02}>
            <p className={styles.headerLabel01}>{post.province}</p>
            <p className={styles.headerLabel02}>{post.city}</p>
          </div>
          <h1 className={styles.headerContent03}>{post.title}</h1>
          <div className={styles.headerContent04}>
            <p className={styles.headerLabel03}>
              {post.gender === "남성" ? (
                <PiGenderMaleBold className={styles.maleIcon} />
              ) : (
                <PiGenderFemaleBold className={styles.femaleIcon} />
              )}
            </p>
            <p className={styles.headerLabel04}>{post.birth_year}</p>
          </div>
          <div className={styles.headerContent05}>
            <p className={styles.headerLabel05}>
              <img className={styles.profileImg} src={anonymous_profile} />
            </p>
            <div className={styles.headerContent06}>
              <p className={styles.headerLabel06}>{post.writerName}</p>
              <p className={styles.headerLabel07}>{post.created_date}</p>
            </div>
            <div className={styles.headerContent07}>
              <p className={styles.postBtn01}>수정</p>
              <p className={styles.postBtn02}>삭제</p>
            </div>
          </div>
          <hr className={styles.hr} />
          {/*본문 내용*/}
          <div className={styles.container}>
            <div className={styles.placeContent01}>
              <TbMap2 className={styles.mapIcon} />
              <p className={styles.placeLabel01}>{post.place_name}</p>
              <p className={styles.placeLabel02}>{post.address}</p>
            </div>
            <p className={styles.placeContent02}>{post.plan_date}</p>
            <p className={styles.placeContent03}>{post.content}</p>
          </div>
          <div className={styles.footer}>여기에 여행계획 그거 넣기</div>
          <div>이거는 쿡 찌르기</div>
        </div>
      )}
    </div>
  );
}

export default FriendDetail;
