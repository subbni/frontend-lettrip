import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTravelDetail } from "../../../Service/TravelService";
import CourseDetail from "./CourseDetail";
import "./PageDetail.css";

const TravelDetailPage = () => {
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

  useEffect(() => {
    getTravelDetail(id)
      .then((response) => {
        console.log(response);
        setTravel(response);
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
  }, []);

  return (
    <div>
      <div className='travelCourse-container'>
        <div className='course-title'>'{travel.title}' 코스 보기</div>
        <div className='course-thenumberOf'>
          코스 : {travel.numberOfCourses}개
        </div>
        <div className='course-theme'>#{travel.travelTheme}</div>
        <div className='course-totalcost'>{travel.totalCost}원 / 인</div>
      </div>
      <div>
        {travel.courses.map((course, idx) => (
          <div className='course' key={idx}>
            <CourseDetail course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelDetailPage;
