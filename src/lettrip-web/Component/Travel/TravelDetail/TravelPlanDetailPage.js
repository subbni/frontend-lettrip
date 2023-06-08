import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { getTravelDetail } from "../../../Service/TravelService";
import CoursePlanDetail from "./CourPlanDetail";
import "./PageDetail.css";
import { checkIfLoggedIn } from "../../../Service/AuthService";

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
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
  }, []);

  return (
    <div>
      <div className='travelCourse-container'>
        <div className='travelCourse-header'>
          <div className='travelCourse-title'>
            '{travel.title}' 코스 계획 보기
          </div>
        </div>
        <div className='travelCourse-thenumberOf'>
          예상 코스 : {travel.numberOfCourses}개
        </div>
        <div className='travelCourse-theme'>#{travel.travelTheme}</div>
        <div className='travelCourse-totalcost'>
          예상 {travel.totalCost}원 / 인
        </div>
      </div>
      <div>
        {travel.courses.map((course, idx) => (
          <div className='travelCourse-detail' key={idx}>
            <CoursePlanDetail course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelDetailPage;
