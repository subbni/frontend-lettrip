import React, { useState } from "react";
import "./TravelSearch.css";

function TravelSearch() {
  const [keyword, setKeyword] = useState("");
  const [courseCount, setCourseCount] = useState("전체");
  const [theme, setTheme] = useState("전체");
  const [totalCost, setTotalCost] = useState("10만원 이하");

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleCourseCountChange = (e) => {
    setCourseCount(e.target.value);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleTotalCostChange = (e) => {
    setTotalCost(e.target.value);
  };

  const handleSearch = () => {
    console.log("Keyword:", keyword);
    console.log("Course Count:", courseCount);
    console.log("Theme:", theme);
    console.log("Total Cost:", totalCost);
  };

  return (
    <div className='travel-search-container'>
      <input
        type='text'
        value={keyword}
        onChange={handleKeywordChange}
        placeholder='어디로 떠나고 싶으세요?'
        className='search-input'
      />

      <h3>코스 수</h3>
      <select
        value={courseCount}
        onChange={handleCourseCountChange}
        className='select-input'
      >
        <option value='전체'>전체</option>
        <option value='1~2'>1~2</option>
        <option value='3~6'>3~6</option>
        <option value='6 이상'>6 이상</option>
      </select>

      <h3>테마</h3>
      <select
        value={theme}
        onChange={handleThemeChange}
        className='select-input'
      >
        <option value='전체'>전체</option>
        <option value='문화 여행'>문화 여행</option>
        <option value='자연 여행'>자연 여행</option>
        <option value='음식 여행'>음식 여행</option>
        <option value='액티비티 여행'>액티비티 여행</option>
        <option value='종교 여행'>종교 여행</option>
        <option value='휴양 여행'>휴양 여행</option>
        <option value='쇼핑 여행'>쇼핑 여행</option>
      </select>

      <h3>총 비용</h3>
      <select
        value={totalCost}
        onChange={handleTotalCostChange}
        className='select-input'
      >
        <option value='10만원 이하'>10만원 이하</option>
        <option value='10~20'>10~20</option>
        <option value='20~30'>20~30</option>
        <option value='30~40'>30~40</option>
        <option value='40~50'>40~50</option>
        <option value='50 이상'>50 이상</option>
      </select>

      <button onClick={handleSearch} className='search-button'>
        최종 검색
      </button>
    </div>
  );
}

export default TravelSearch;
