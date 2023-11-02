import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTravel } from "../../Service/MyPageService";
import styles from "./MeetUp.module.css";

function MeetUpPlan() {
  const navigate = useNavigate();
  const [planList, setPlanList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,DESC",
  });

  useEffect(() => {
    getMyTravel(false, pageForm)
      .then((response) => {
        setPlanList(response.content);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, [pageForm]);

  return (
    <div>
      <button
        className={styles.pokeCloseBtn}
        onClick={() => navigate("/friend")}
      >
        x
      </button>
      <h2 className={styles.pokeCount}>연동할 계획을 선택해주세요.</h2>
      {planList ? (
        <div className={styles.pokePeopleContainer}>
          {planList.map((travel) => (
            <div key={travel.id}>
              <div className='travel_item_element'>
                <div>
                  <div className='travel_theme'>{travel.travelTheme}</div>
                  <div className='travel_text'>{travel.totalCost}원</div>
                </div>
                <div>
                  <div className='travel_text'>
                    코스 {travel.numberOfCourses}개
                  </div>
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
          ))}
        </div>
      ) : (
        <div className='travel_info'> 아직 등록된 여행 플랜이 없습니다.</div>
      )}
    </div>
  );
}

export default MeetUpPlan;
