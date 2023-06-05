const LikedTravelItem = ({ travel }) => {
  return (
    <div className='travel_item'>
      <div className='travel_item_element'>
        <div>
          <div className='travel_theme'>{travel.travelTheme}</div>
          <div className='travel_text'>{travel.totalCost}원</div>
        </div>
        <div>
          <div className='travel_writerNickname'>
            작성자 : {travel.writerNickname}
          </div>
        </div>
        <div>
          <div className='travel_text'>코스 {travel.numberOfCourses}개</div>
        </div>
      </div>
      <div className='travel_item_element'>
        <div className='travel_place'>
          {travel.city}
          <span className='travel_place_small'> {travel.province}</span>
        </div>
        <div className='travel_text'>
          {travel.departDate} ~ {travel.lastDate}
        </div>
      </div>
    </div>
  );
};

export default LikedTravelItem;
