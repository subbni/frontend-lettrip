import { useCallback, useEffect, useRef, useState } from "react";
import "./Plan.css";
import CourseContainer from "./CourseContainer";
import TravelData, { Citys, Provinces, TravelThemes } from "./TravelData";
const CoursePlanTemplate = () => {
  //// state 관리
  const [planForm, setPlanForm] = useState({
    title: "",
    travelTheme: "",
    isVisited: false,
    province: "",
    city: "",
    departDate: "",
    lastDate: "",
    totalCost: "",
    numberOfCourses: "",
  });
  const [totalCost, setTotalCost] = useState(0);
  const [numberOfCourses, setNumberOfCourses] = useState(0);
  const [days, setDays] = useState(0);
  const [matchedCitys, setMatchedCitys] = useState([]);
  //// useEffect
  useEffect(() => {
    const selectedProvinceObject = citys.find(
      (object) => object.province === planForm.province
    );
    if (selectedProvinceObject) {
      setMatchedCitys(selectedProvinceObject.citys);
    }
  }, [planForm.province]);

  useEffect(() => {
    setDays(getDiffDate(planForm.lastDate, planForm.departDate));
  }, [planForm.departDate, planForm.lastDate]);

  const getDiffDate = (lastDate, departDate) => {
    const firstDate = new Date(lastDate);
    const secondDate = new Date(departDate);
    const diffMsec = firstDate.getTime() - secondDate.getTime();
    const diffDate = diffMsec / (24 * 60 * 60 * 1000);
    return diffDate;
  };

  //// data list
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

  //// course 관련 설정
  const courseId = useRef(1);
  const [courses, setCourses] = new useState([]);

  const onCourseInsert = useCallback(
    (courseInfo, placeInfo) => {
      const newCourse = {
        id: courseId.current,
        arrivedTime: planForm.departDate + " " + courseInfo.arrivedTime,
        cost: courseInfo.cost,
        dayCount: courseInfo.dayCount,
        place: {
          name: placeInfo.name,
          xpoint: placeInfo.xpoint,
          ypoint: placeInfo.ypoint,
          province: planForm.province,
          city: planForm.city,
        },
      };

      setCourses(courses.concat(newCourse));
      setNumberOfCourses((num) => num + 1);
      setTotalCost((cost) => parseInt(cost) + parseInt(newCourse.cost));
      // setPlanForm({
      //   ...planForm,
      //   totalCost: totalCost,
      //   numberOfCourses: numberOfCourses,
      // });
      courseId.current += 1;
    },
    [courses]
  );

  //// event 관리
  const onPlanFormChange = (e) => {
    const changingField = e.target.name;
    setPlanForm((planForm) => ({
      ...planForm,
      [changingField]: e.target.value,
    }));
    console.log(planForm);
  };

  const onPlanFormSubmit = (e) => {
    e.preventDefault();
  };

  // 렌더링
  return (
    <div className="templateBlock">
      <div className="formContainer">
        <h1>여행 코스 계획 작성</h1>
        <form className="formBox" onSubmit={onPlanFormSubmit}>
          <div className="formComponent">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              name="title"
              id="title"
              value={planForm.title}
              onChange={onPlanFormChange}
              required
            />
          </div>
          <div className="formComponent">
            <label htmlFor="travelTheme">테마</label>
            <select
              name="travelTheme"
              id="travelTheme"
              onChange={onPlanFormChange}
              required
            >
              {travelThemeOptions}
            </select>
          </div>
          <div className="formComponent">
            <label htmlFor="province">행정구역</label>
            <select
              name="province"
              id="province"
              value={planForm.province}
              onChange={onPlanFormChange}
            >
              {provincesOptions}
            </select>
            <label htmlFor="city">지역</label>
            <select
              name="city"
              id="city"
              value={planForm.city}
              onChange={onPlanFormChange}
            >
              {matchedCitys.map((city, idx) => (
                <option key={idx}>{city}</option>
              ))}
            </select>
          </div>
          <div className="formComponent">
            <label htmlFor="departDate">여행 기간</label>
            <input
              type="date"
              name="departDate"
              id="departDate"
              value={planForm.departDate}
              onChange={onPlanFormChange}
              required
            />
            <label>~</label>
            <input
              type="date"
              name="lastDate"
              id="lastDate"
              value={planForm.lastDate}
              onChange={onPlanFormChange}
              required
            />
          </div>
          <div>코스 수 : {numberOfCourses}</div>
          <div>총 비용: {totalCost}</div>
        </form>
        <div className="formComponent">
          <label>코스 짜기</label>
          <br />
          {days > 0 ? (
            <div>
              {Array.from({ length: days + 1 }).map((_, index) => {
                return (
                  <CourseContainer
                    key={index}
                    onCourseInsert={onCourseInsert}
                    province={planForm.province}
                    city={planForm.city}
                    dapartDate={planForm.departDate}
                    dayCount={index + 1}
                    containerIdx={index}
                  />
                );
              })}
            </div>
          ) : (
            <div>여행 기간을 설정해주세요 ! </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlanTemplate;
