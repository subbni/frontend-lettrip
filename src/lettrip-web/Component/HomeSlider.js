import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import main1 from "../../image/main1.jpg";
import main2 from "../../image/main2.jpg";
import main3 from "../../image/main3.png";
import './Home.css';
SwiperCore.use([Navigation, Pagination, Autoplay]); // Swiper

const HomeSlider = () => {
    const imageList = [main1, main2, main3];
    const swiperStyle = {
      position: "relative",
      height: "30em",
      width: "58em"
    };

    return (
      <div className='Main_container'>
        <Swiper
          className='ranking_swiper'
          style={swiperStyle}
          spaceBetween={40}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
        >
          {imageList.map((imageSrc) => (
            <SwiperSlide>
              <img className="slider-image"  src={imageSrc} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

export default HomeSlider;
