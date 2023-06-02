import { useEffect, useState } from "react";
import TravelData, { Citys, Provinces, TravelThemes } from "../TravelData";
import { searchTravelList } from "../../../Service/TravelService";
import "./Search.css";

const SearchForm = ({ onGetResult }) => {
  const [searchForm, setSearchForm] = useState({
    province: "",
    city: "",
    minCost: -1,
    maxCost: -1,
    minNumberOfCourses: -1,
    maxNumberOfCourses: -1,
    travelTheme: "all",
  });
  const [cost, setCost] = useState({
    minCost: "",
    maxCost: "",
  });
  const [numberOfCourses, setNumberOfCourses] = useState({
    minNumberOfCourses: "",
    maxNumberOfCourses: "",
  });
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });
  const [matchedCitys, setMatchedCitys] = useState([]);

  //////// data list
  // 여행 테마
  const travelThemes = TravelThemes;
  const travelThemeOptions = travelThemes.map((theme, idx) => (
    <option key={idx}>{theme}</option>
  ));
  // 행정구역
  const provinces = Provinces;
  const provincesOptions = provinces.map((province, idx) => (
    <option key={idx}>{province}</option>
  ));
  // 지역명
  const citys = Citys;

  // 행정구역 선택에 따른 지역 option 동적 처리
  useEffect(() => {
    const selectedProvinceObject = citys.find(
      (object) => object.province === searchForm.province
    );
    if (selectedProvinceObject) {
      setMatchedCitys(selectedProvinceObject.citys);
      setSearchForm((searchForm) => ({
        ...searchForm,
        city: "",
      }));
      document.getElementById("city").value = "default";
    }
  }, [searchForm.province]);

  const onSearchFormChange = (e) => {
    const changingField = e.target.name;
    setSearchForm((searchForm) => ({
      ...searchForm,
      [changingField]: e.target.value,
    }));
  };

  const onNumberOfCoursesChange = (e) => {
    const inputNumber = e.target.value;
    if (inputNumber === "전체") {
      setSearchForm((planForm) => ({
        ...planForm,
        minNumberOfCourses: -1,
        maxNumberOfCourses: -1,
      }));
    } else if (inputNumber === "5이하") {
      setSearchForm((planForm) => ({
        ...planForm,
        minNumberOfCourses: -1,
        maxNumberOfCourses: 5,
      }));
    } else if (inputNumber === "6~10") {
      setSearchForm((planForm) => ({
        ...planForm,
        minNumberOfCourses: 6,
        maxNumberOfCourses: 10,
      }));
    } else if (inputNumber === "10이상") {
      setSearchForm((planForm) => ({
        ...planForm,
        minNumberOfCourses: 10,
        maxNumberOfCourses: -1,
      }));
    }
  };

  const onCostChange = (e) => {
    const inputCost = e.target.value;
    if (inputCost === "전체") {
      setSearchForm((planForm) => ({
        ...planForm,
        minCost: -1,
        maxCost: -1,
      }));
    } else if (inputCost === "10이하") {
      setSearchForm((planForm) => ({
        ...planForm,
        minCost: -1,
        maxCost: 100000,
      }));
    } else if (inputCost === "50이상") {
      setSearchForm((planForm) => ({
        ...planForm,
        minCost: 500000,
        maxCost: -1,
      }));
    } else {
      const costs = inputCost.split("~");
      setSearchForm((planForm) => ({
        ...planForm,
        minCost: parseInt(costs[0]) * 10000,
        maxCost: parseInt(costs[1]) * 10000,
      }));
    }
  };

  const onSearchBtnClick = (e) => {
    e.preventDefault();
    if (!searchForm.province.trim() || !searchForm.city.trim()) {
      alert("검색할 행정구역과 지역을 선택해주세요.");
      return;
    }
    console.log(searchForm);
    searchTravelList(searchForm, pageForm)
      .then((response) => {
        console.log(response);
        if (response.content.length === 0) {
          alert("해당하는 여행 코스가 존재하지 않습니다.");
        }
        onGetResult(response.content);
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
  };
  return (
    <div className='travelSearchForm'>
      <div className='searchFormElement'>
        <label htmlFor='province'>행정구역</label>
        <select
          className='search_select'
          name='province'
          id='province'
          defaultValue='default'
          onChange={onSearchFormChange}
        >
          <option value='default' disabled>
            시도 선택
          </option>
          {provincesOptions}
        </select>
        <label htmlFor='city'>지역</label>
        <select
          className='search_select'
          name='city'
          id='city'
          onChange={onSearchFormChange}
          defaultValue='default'
        >
          <option value='default' disabled>
            지역 선택
          </option>
          {matchedCitys.map((city, idx) => (
            <option key={idx}>{city}</option>
          ))}
        </select>
      </div>
      <div className='searchFormElement'>
        <label htmlFor='numberOfCourses'>코스 수</label>
        <select
          className='search_select'
          name='numberOfCourses'
          onChange={onNumberOfCoursesChange}
        >
          <option value='전체'>전체</option>
          <option value='5이하'>5개 이하</option>
          <option value='6~10'>6~10개</option>
          <option value='10이상'>10 이상</option>
        </select>
      </div>
      <div className='searchFormElement'>
        <label htmlFor='cost'>총 비용</label>
        <select className='search_select' name='cost' onChange={onCostChange}>
          <option value='전체'>전체</option>
          <option value='10이하'>10만원 이하</option>
          <option value='10~20'>10~20</option>
          <option value='20~30'>20~30</option>
          <option value='30~40'>30~40</option>
          <option value='40~50'>40~50</option>
          <option value='50이상'>50만원 이상</option>
        </select>
      </div>
      <div className='searchFormElement'>
        <label htmlFor='travelTheme'>여행 테마</label>
        <select
          className='search_select'
          name='travelTheme'
          onChange={onSearchFormChange}
        >
          <option value='all'>전체</option>
          <option value='문화 여행'>문화 여행</option>
          <option value='자연 여행'>자연 여행</option>
          <option value='음식 여행'>음식 여행</option>
          <option value='액티비티 여행'>액티비티 여행</option>
          <option value='종교 여행'>종교 여행</option>
          <option value='휴양 여행'>휴양 여행</option>
          <option value='쇼핑 여행'>쇼핑 여행</option>
        </select>
      </div>
      <button className='searchBtn' onClick={onSearchBtnClick}>
        검색
      </button>
    </div>
  );
};

export default SearchForm;
