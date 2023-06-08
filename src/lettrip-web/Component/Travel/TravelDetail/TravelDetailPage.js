import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { getTravelDetail } from "../../../Service/TravelService";
import CourseDetail from "./CourseDetail";
import "./PageDetail.css";
import { checkIfLoggedIn } from "../../../Service/AuthService";
import {
  checkIfLiked,
  deleteLiked,
  pushLiked,
} from "../../../Service/LikedService";

const TravelDetailPage = () => {
  const likedType = "TRAVEL_LIKE";
  const navigate = useNavigate();
  const { id } = useParams();
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
      <div className='travelCourse-container'>
        <div className='travelCourse-header'>
          <div className='travelCourse-title'>'{travel.title}' 상세 코스</div>
          <button
            className='travelCourse-like-button'
            onClick={handleLikeClick}
          >
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        </div>

        <div className='travelCourse-thenumberOf'>
          다녀온 코스 : {travel.numberOfCourses}개
        </div>
        <div className='travelCourse-theme'>#{travel.travelTheme}</div>
        <div className='travelCourse-totalcost'>
          총 비용 : {travel.totalCost}원 / 인
        </div>
      </div>
      <div className='course_detail_container'>
        {courseList.map((course, idx) => (
          <div className='travelCourse-detail' key={idx}>
            <CourseDetail course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelDetailPage;
