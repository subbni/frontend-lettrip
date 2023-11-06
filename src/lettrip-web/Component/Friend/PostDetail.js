import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Moment from "moment"; //날짜 및 시간 표시 라이브러리
import {
  deleteMeetUpPost,
  showMeetUpPost,
} from "../../Service/MeetUpPostService";
import { showPlaceById } from "../../Service/PlaceReviewService";
import styles from "./PostDetail.module.css";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import { MdOutlineLocationOn, MdOutlineLocationOff } from "react-icons/md"; //gps on/off 아이콘
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi"; //성별 아이콘
import { TbMap2 } from "react-icons/tb"; //지도 아이콘
import PostTravelDetail from "./PostTravelDetail";
import Poke from "./Poke";

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [post, setPost] = useState([]);
  const [place, setPlace] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);

  useEffect(() => {
    fetchMeetUpPost(); // 게시글 불러오기
  }, []);

  // 게시글 불러오기 완료 후 실행
  useEffect(() => {
    // 게시글 작성자와 로그인 사용자 동일 여부 확인하기
    const storedEmail = localStorage.getItem("email");
    if (post.userProfile && post.userProfile.email === storedEmail) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [post]);

  //장소 id를 이용해서 불러오기
  useEffect(() => {
    if (place) {
      showPlaceById(place)
        .then((response) => {
          setPlaceInfo(response.name);
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
          window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
          navigate("/friend");
        });
    }
  }, [place]);

  //게시글 불러오기
  const fetchMeetUpPost = () => {
    showMeetUpPost(id)
      .then((response) => {
        setPost(response);
        setPlace(response.placeId);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
        navigate("/friend");
      });
  };

  //게시글 삭제
  const handleDelete = () => {
    if (window.confirm("친구매칭글을 삭제하시겠습니까?")) {
      deleteMeetUpPost(id)
        .then(() => {
          alert("친구매칭글이 삭제되었습니다.");
          navigate("/friend");
        })
        .catch((e) => {
          console.log(e);
          alert("친구매칭글 삭제에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  //게시글 수정
  const handleModify = () => {
    navigate(`/friend/modify/${post.id}`);
  };

  //날짜 및 시간 표시 방법 수정
  const formattedMeetUpDate = Moment(post.meetUpDate).format("YY.MM.DD HH:mm");
  const formattedcreatedDate = Moment(post.createdDate).format("YYYY.MM.DD");
  const formattedbirthDate = post.userProfilev
    ? Moment(post.userProfile.birthDate).format("YYYY.MM.DD")
    : ""; // userProfile가 유효한 경우에만 Moment를 사용하도록 수정

  return (
    <div className={styles.page}>
      {post && post.userProfile ? (
        <div className={styles.container} key={post.id}>
          {/*제목 부분 내용*/}
          <p className={styles.content01}>
            {post.isGPSEnabled === true ? (
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
          <div className={styles.content02}>
            <p className={styles.postProvince}>{post.province}</p>
            <p className={styles.postCity}>{post.city}</p>
          </div>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <div className={styles.content03}>
            <p className={styles.postSex}>
              {post.userProfile.sex === "male" ? (
                <PiGenderMaleBold className={styles.maleIcon} />
              ) : (
                <PiGenderFemaleBold className={styles.femaleIcon} />
              )}
            </p>
            <p className={styles.postBirthDate}>{formattedbirthDate}</p>
          </div>
          <div className={styles.content04}>
            <p className={styles.postProfile}>
              <img className={styles.profileImg} src={anonymous_profile} />
            </p>
            <div className={styles.content05}>
              <p className={styles.postNickname}>{post.userProfile.nickname}</p>
              <p className={styles.postCreatedDate}>{formattedcreatedDate}</p>
            </div>
            <div className={styles.contentBtnBox}>
              {isEditable && (
                <p className={styles.modifyBtn} onClick={handleModify}>
                  수정
                </p>
              )}
              {isEditable && (
                <p className={styles.deleteBtn} onClick={handleDelete}>
                  삭제
                </p>
              )}
            </div>
          </div>
          <hr className={styles.hr} />
          {/*본문 내용*/}
          <div className={styles.contentBox}>
            <div className={styles.content06}>
              <TbMap2 className={styles.mapIcon} />
              <p className={styles.postPlaceName}>{placeInfo}</p>
            </div>
            <p className={styles.postMeetUpDate}>{formattedMeetUpDate}</p>
            <p className={styles.postContent}>{post.content}</p>
          </div>
          <div className={styles.planDetail}>
            <PostTravelDetail
              writer={post.userProfile.nickname}
              travelId={post.travelId}
            />
          </div>
          <div className={styles.Poke}>
            <Poke
              id={id}
              isEditable={isEditable}
              writerUserId={post.userProfile.id}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PostDetail;
