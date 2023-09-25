import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkIfLoggedIn } from "../../../Service/AuthService";
import {
  getTravelDetail,
  deleteTravelDetail,
} from "../../../Service/TravelService";
import CoursePlanDetail from "./CoursePlanDetail";
import { BsFillTrash3Fill } from "react-icons/bs";
import styles from "./TravelPlan.module.css";

const TravelDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [courseList, setCourseList] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    //로그인 여부 확인하기
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
      })
      .catch((e) => {
        window.alert("오류가 발생했습니다.");
        console.log(e);
      });
  }, []);

  //여행 계획 코스 삭제
  const handleDelete = () => {
    if (window.confirm("여행 계획 코스를 삭제하시겠습니까?")) {
      deleteTravelDetail(id)
        .then(() => {
          window.alert("여행 계획 코스가 삭제되었습니다.");
          navigate("/mypage");
        })
        .catch((e) => {
          console.log(e);
          window.alert(
            "여행 계획 코스 삭제에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
        });
    }
  };

  //일차별로 그룹화 최대 4개까지, 그 이상인 경우 줄바꿈
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

  //금액 단위 설정 (예시 : 10,000원 )
  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  //날짜 설정
  const formatDate = (date) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(date)
      .toLocaleDateString(undefined, options)
      .replace(/\s/g, "");
    return formattedDate;
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.courseTitle}>
            '{travel.title}' 코스 계획 보기
          </div>
          {isEditable && (
            <div className={styles.btn01} onClick={handleDelete}>
              <BsFillTrash3Fill />
            </div>
          )}
        </div>
        <div className={styles.courseDate}>
          {formatDate(travel.departDate)} ~ {formatDate(travel.lastDate)}
        </div>
        <div className={styles.courseNum}>
          계획된 코스 : {travel.numberOfCourses}개
        </div>
        <div className={styles.courseTheme}># {travel.travelTheme}</div>
        <div className={styles.courseCost}>
          예상 금액 : {numberWithCommas(travel.totalCost)}원 / 인
        </div>
      </div>

      <div className={styles.content}>
        {Object.entries(courseList).map(([day, courses], index) => (
          <div className={styles.group} key={day}>
            <div className={styles.groupTitle}>{index + 1}일차</div>
            <div className={styles.groupList}>
              {courses.map((course, idx) => (
                <div className={styles.groupDetail} key={idx}>
                  <CoursePlanDetail course={course} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelDetailPage;
