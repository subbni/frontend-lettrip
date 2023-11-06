import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Moment from "moment"; //날짜 및 시간 표시 라이브러리
import { getMyMeetUpPost } from "../../../Service/MyPageService";
import Pagination from "react-js-pagination";
import styles from "./Poke.module.css";
import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import { MdOutlineLocationOn, MdOutlineLocationOff } from "react-icons/md"; //gps on/off 아이콘
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi"; //성별 아이콘

const MyPostList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); //페이지네이션 설정
  const [totalElements, setTotalElements] = useState(0); //페이지네이션 설정
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 4,
    sort: "id,DESC",
  });
  const [post, setPost] = useState([]);

  useEffect(() => {
    fetchMyMeetUpPost();
  }, [pageForm.page]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPageForm({
      ...pageForm,
      page: pageNumber - 1,
    });
  };

  //meetUpPost 전체 조회
  const fetchMyMeetUpPost = () => {
    getMyMeetUpPost(pageForm)
      .then((response) => {
        console.log(response.content);
        setPost(response.content);
        setTotalElements(response.totalElements);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.headerText}>내가 쓴 매칭글</h3>
      <div className={styles.content}>
        {post &&
          post.map((post, index) => (
            <div
              key={index}
              className={styles.item}
              id={post.id}
              onClick={() => navigate(`/friend/${post.id}`)}
            >
              <div>
                <p className={styles.infoContent01}>
                  {post.isGPSEnabled === true ? (
                    <>
                      <MdOutlineLocationOn className={styles.gpsIcon} /> GPS
                      정보 필요
                    </>
                  ) : (
                    <>
                      <MdOutlineLocationOff className={styles.gpsIcon} /> GPS
                      정보 불필요
                    </>
                  )}
                </p>
                <div className={styles.infoContent02}>
                  <p className={styles.contentProvince}>{post.province}</p>
                  <p className={styles.contentMeetUpDate}>
                    {Moment(post.meetUpDate).format("YY.MM.DD")}
                  </p>
                </div>
                <p className={styles.contentCity}>{post.city}</p>
                <p className={styles.contentTitle}>{post.title}</p>
                <div className={styles.infoContent03}>
                  <p className={styles.contentSex}>
                    {post.userProfile.sex === "남성" ? (
                      <PiGenderMaleBold className={styles.maleIcon} />
                    ) : (
                      <PiGenderFemaleBold className={styles.femaleIcon} />
                    )}
                  </p>
                  <p className={styles.contentBirthDate}>
                    {Moment(post.userProfile.birthDate).format("YYYY.MM.DD")}
                  </p>
                </div>
                <div className={styles.infoContent04}>
                  <p className={styles.contentProfile}>
                    <img
                      className={styles.profileImg}
                      src={anonymous_profile}
                    />
                  </p>
                  <div className={styles.infoContent05}>
                    <p className={styles.contentNickname}>
                      {post.userProfile.nickname}
                    </p>
                    <p className={styles.contentCreatedDate}>
                      {Moment(post.createdDate).format("YYYY.MM.DD")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Pagination
        activePage={currentPage}
        itemsCountPerPage={pageForm.size}
        totalItemsCount={totalElements}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default MyPostList;
