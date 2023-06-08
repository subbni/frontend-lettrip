import "./Search.css";
import no_image from "../../../../image/travel/no_image.png";
import no_profile_image from "../../../../image/no_profile_image.png";
import { useNavigate } from "react-router-dom";

const ResultItem = ({ travel, onClick }) => {
  const navigate = useNavigate();
  return (
    <div
      className='travel_search_resultItem'
      id={travel.id}
      onClick={() => navigate(`/travel/course/review/${travel.id}`)}
    >
      <div className='writerInfo'>
        {travel.writerImageUrl === null ? (
          <img className='writerImage' src={no_profile_image} />
        ) : (
          <img className='writerImage' src={travel.writerImageUrl} />
        )}

        <div className='writerNickname'>{travel.writerNickname}</div>
      </div>
      <div className='dateInfo'>
        {travel.departDate} ~ {travel.lastDate}
      </div>
      {travel.mainImageUrl === null ? (
        <img className='mainImage' src={no_image} />
      ) : (
        <img className='mainImage' src={travel.mainImageUrl} />
      )}

      <div className='travelInfo_title'>{travel.title}</div>
      <div className='travelInfo_container'>
        <div className='travelInfo'>
          <div>코스 {travel.numberOfCourses}개</div>
          <div>#{travel.travelTheme}</div>
          <div>{travel.totalCost}원</div>
        </div>
        <div className='travelInfo_place'>
          <div className='travel_place'>
            {travel.city}
            <span className='travel_place_small'> {travel.province}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultItem;
