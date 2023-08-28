import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { getTravelDetail } from "../../../Service/TravelService";
import CourseDetail from "./CourseDetail";

import styles from "./PageDetail.module.css";
import "./PageDetail.css";

import { checkIfLoggedIn } from "../../../Service/AuthService";
import {
  checkIfLiked,
  deleteLiked,
  pushLiked,
} from "../../../Service/LikedService";
const TravelDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const likedType = "TRAVEL_LIKE";
  const likedForm = {
    targetId: id,
    likedType: likedType,
  };
  const [travel, setTravel] = useState({
    writerNickname: "",
    writerEmail: "",
    title: "",
    travelTheme: "",
    province: "",
    city: "",
    isVisited: "",
    departDate: "",
    lastDate: "",
    totalCost: "",
    numberOfCourses: "",
    courses: [],
  });
  const [liked, setLiked] = useState(false);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    getTravelDetail(id)
      .then((response) => {
        console.log(response);
        setTravel(response);
        setCourseList(() =>
          response.courses.sort((a, b) => {
            const timeA = new Date(a.arrivedTime);
            const timeB = new Date(b.arrivedTime);
            return timeA - timeB;
          })
        );
        checkLiked();
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
  }, []);
  const checkLiked = () => {
    checkIfLiked(likedType, id)
      .then((response) => {
        if (response.liked) {
          console.log(response);
          setLiked(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // 좋아요 관리
  const handleLikeClick = () => {
    if (liked) {
      onDeleteLiked();
    } else {
      onPushLiked();
    }
  };
  const onPushLiked = () => {
    pushLiked(likedForm)
      .then((response) => {
        console.log(response);
        if (response.success) {
          setLiked(true);
        }
      })
      .catch((e) => {
        console.log(e);
        alert("좋아요 실패");
      });
  };
  const onDeleteLiked = () => {
    deleteLiked(likedForm)
      .then((response) => {
        console.log(response);
        if (response.success) {
          setLiked(false);
        }
      })
      .catch((e) => {
        console.log(e);
        alert("좋아요 취소 실패");
      });
  };
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.travelCourse_title}>
            '{travel.title}' 코스 보기
          </div>
          <button className={styles.button} onClick={handleLikeClick}>
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        </div>

        <div className={styles.travelCourse_thenumberOf}>
          {travel.numberOfCourses}개
        </div>
        <div className={styles.travelCourse_theme}>#{travel.travelTheme}</div>
        <div className={styles.travelCourse_totalcost}>
          {travel.totalCost}원 / 인
        </div>
      </div>
      <div className={styles.courseDetail_container}>
        {courseList.map((course, idx) => (
          <div className={styles.courseDetail} key={idx}>
            <CourseDetail course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default TravelDetailPage;
