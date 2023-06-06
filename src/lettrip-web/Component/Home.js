import React from "react";
import home_image from "../../image/home.jpeg";
import "./Home.css";

function Home() {
  return (
    <div className='Home'>
      <img className='Home_Image' src={home_image} alt='home'></img>
    </div>
  );
}

export default Home;
