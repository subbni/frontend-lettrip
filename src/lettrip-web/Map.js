/*global kakao*/

import React, { useEffect, useRef, useState } from "react";

export default function Map() {
  const container = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=d542bb0ad0bdf774a95a7025324f93fb&autoload=false";
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 5,
        };
        const map = new kakao.maps.Map(container.current, options);
        setMap(map);
      });
    };
  }, []);

  return (
    <div
      id='map'
      ref={container}
      style={{
        width: "500px",
        height: "500px",
      }}
    ></div>
  );
}
