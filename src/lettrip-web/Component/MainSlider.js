import React from 'react';
import { Swiper, SwiperSlide } from 'react-id-swiper';
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import main1 from "../../image/main1.jpg";
import main2 from "../../image/main2.jpg";
import main3 from "../../image/main3.png";
SwiperCore.use([Navigation, Pagination, Autoplay]);

const MainSlider = () => {
  const swiperParams = {
    autoplay: {
      delay: 3000,
    },
  };

  return (
    <div>
      <Swiper {...swiperParams}>
        <SwiperSlide>
          <img className="slider-image" src={main1} alt="Main 1" />
          <img className="slider-image" src={main2} alt="Main 2" />
          <img className="slider-image" src={main3} alt="Main 3" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MainSlider;
