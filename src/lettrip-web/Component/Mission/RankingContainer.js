import { useState } from "react";
import RankingItem from "./RankingItem";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
SwiperCore.use([Navigation, Pagination, Autoplay]); // Swiper

const RankingContainer = () => {
  const rankingNameList = [
    "QR 미션 점수 🏆",
    "즉흥 여행 미션 점수 🏃🏻‍♀️",
    "음식점 다방문자 🍴",
    "카페 다방문자 ☕️",
    "다양한 지역 방문자 🚗",
  ];
  const rankingTypeList = [
    "QR_MISSION",
    "RANDOM_MISSION",
    "REVIEW_RESTAURANT",
    "REVIEW_CAFE",
    "TRAVEL_CITY",
  ];

  const getFirstDate = (date) => {
    let firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return getFormattedDate(firstDate);
  };

  const getLastDate = (date) => {
    let lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return getFormattedDate(lastDate);
  };

  const getFormattedDate = (date) => {
    let formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 9
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      (date.getDate() < 9 ? "0" + date.getDate() : date.getDate());
    return formattedDate;
  };

  const now = new Date();
  const from = getFirstDate(new Date());
  const to = getLastDate(new Date());

  const swiperStyle = {
    position: "relative",
    height: "22em",
    width: "58em",
  };
  return (
    <div>
      <div className='ranking_title'>{now.getMonth() + 1}월 진행 중인 랭킹</div>
      <div className='ranking_container'>
        <Swiper
          className='ranking_swiper'
          style={swiperStyle}
          spaceBetween={40}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
        >
          {rankingNameList.map((rankingName, idx) => (
            <SwiperSlide>
              <RankingItem
                key={idx}
                rankingName={rankingName}
                rankingType={rankingTypeList[idx]}
                from={from}
                to={to}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RankingContainer;
