import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { checkIfLoggedIn } from "../../../Service/AuthService";
import {
  getTravelDetail,
  deleteTravelDetail,
} from "../../../Service/TravelService";
import {
  checkIfLiked,
  deleteLiked,
  pushLiked,
} from "../../../Service/LikedService";
import CourseDetail from "./CourseDetail";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFillTrash3Fill } from "react-icons/bs";
import styles from "./PageDetail.module.css";

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
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    //여행 코스 작성자와 로그인 사용자 동일 여부 확인하기
    const storedEmail = localStorage.getItem("email");
    if (travel.writerEmail === storedEmail) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [travel]);
  useEffect(() => {
    getTravelDetail(id)
      .then((response) => {
        console.log(response);
        setTravel(response);
        const groupedCourses = groupByDay(response.courses);
        setCourseList(Object.values(groupedCourses));
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

  //여행 코스 삭제
  const handleDelete = () => {
    if (window.confirm("여행 코스를 삭제하시겠습니까?")) {
      deleteTravelDetail(id)
        .then(() => {
          alert("여행 코스가 삭제되었습니다.");
          navigate("/travel/search");
        })
        .catch((e) => {
          console.log(e);
          alert("여행 코스 삭제에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
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

  //일차별로 그룹화
  const groupByDay = (courses) => {
    const groupedCourses = {};

    courses.forEach((course) => {
      const day = course.dayCount;
      if (!groupedCourses[day]) {
        groupedCourses[day] = [];
      }
      groupedCourses[day].push(course);
      console.log(day);
    });

    return groupedCourses;
  };

  //금액 단위 설정
  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  //날짜 형식 변경
  const formatDate = (date) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(date)
      .toLocaleDateString(undefined, options)
      .replace(/\.$/, "")
      .replace(/\s/g, "");
    return formattedDate;
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.courseTitle}>'{travel.title}' 코스 보기</div>
          <button className={styles.btn01} onClick={handleLikeClick}>
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
          {isEditable && (
            <div className={styles.btn02} onClick={handleDelete}>
              <BsFillTrash3Fill />
            </div>
          )}
        </div>
        <div className={styles.courseDate}>
          {formatDate(travel.departDate)} ~ {formatDate(travel.lastDate)}
        </div>
        <div className={styles.courseNum}>{travel.numberOfCourses}개</div>
        <div className={styles.courseTheme}>#{travel.travelTheme}</div>
        <div className={styles.courseCost}>
          {numberWithCommas(travel.totalCost)}원 / 인
        </div>
      </div>

      <div className={styles.content}>
        {Object.entries(courseList).map(([day, courses], index) => (
          <div key={day}>
            <div className={styles.groupTitle}>{index + 1}일차</div>
            <div className={styles.groupList}>
              {courses.map((course, idx) => (
                <div className={styles.groupDetail} key={idx}>
                  <CourseDetail course={course} />
                </div>
              ))}
            </div>
            {index < Object.entries(courseList).length - 1 && (
              <hr className={styles.groupLine} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default TravelDetailPage;
