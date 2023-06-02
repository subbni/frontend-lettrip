import "./Search.css";
import basic_travel_image from "../../../../image/travel/travel_image.jpg";
import { useNavigate } from "react-router-dom";
const ResultItem = ({ travel, onClick }) => {
  const navigate = useNavigate();
  return (
    <div
      className='resultItemContainer'
      id={travel.id}
      onClick={() => navigate(`/travel/course/${travel.id}`)}
    >
      {travel.mainImageUrl === null ? (
        <img className='mainImage' src={basic_travel_image} />
      ) : null}
      <div className='travelInfo'>
        <div>{travel.title}</div>
        <div>코스 {travel.numberOfCourses}개</div>
        <div>#{travel.travelTheme}</div>
        <div>{travel.totalCost}원</div>
      </div>
    </div>
  );
};

export default ResultItem;
