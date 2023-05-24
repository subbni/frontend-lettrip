import { useCallback, useEffect, useRef, useState } from "react";
import "./Plan.css";
import CourseContainer from "./CourseContainer";
import TravelData, { Citys, Provinces, TravelThemes } from "./TravelData";
import { createTravelPlan } from "../../../Service/TravelService";
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
    courses: [],
  });
  const [totalCost, setTotalCost] = useState(0);
  const [numberOfCourses, setNumberOfCourses] = useState(0);
  const [days, setDays] = useState(0);
  const [matchedCitys, setMatchedCitys] = useState([]);
  const [courses, setCourses] = new useState([]);
  const [isFormSubmit, setIsFormSubmit] = new useState(false);

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

  //// useEffect

  // 행정구역 선택에 따른 지역 option 동적 처리
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

  useEffect(() => {
    const cost = totalCost;
    const number = numberOfCourses;
    const courseList = courses;
    setPlanForm((planForm) => ({
      ...planForm,
      totalCost: cost,
      numberOfCourses: number,
      courses: courseList,
    }));
  }, [courses]);

  const getDiffDate = (lastDate, departDate) => {
    const firstDate = new Date(lastDate);
    const secondDate = new Date(departDate);
    const diffMsec = firstDate.getTime() - secondDate.getTime();
    const diffDate = diffMsec / (24 * 60 * 60 * 1000);
    return diffDate;
  };

  //// course 관련 설정
  const courseId = useRef(1);
  const onCourseInsert = useCallback(
    (courseInfo, placeInfo) => {
      const newCourse = {
        id: courseId.current,
        arrivedTime:
          getArrivedDate(planForm.departDate, courseInfo.dayCount) +
          " " +
          courseInfo.arrivedTime +
          ":00",
        cost: courseInfo.cost,
        dayCount: courseInfo.dayCount,
        place: {
          name: placeInfo.name,
          categoryCode: placeInfo.categoryCode,
          categoryName: placeInfo.categoryName,
          xpoint: placeInfo.xpoint,
          ypoint: placeInfo.ypoint,
          province: planForm.province,
          city: planForm.city,
        },
      };

      setCourses(courses.concat(newCourse));
      // const increaseTotalCost = (amount) => {
      //   return parseInt(planForm.totalCost) + parseInt(amount);
      // };
      // const addNumberOfCourses = (amount) => {
      //   return planForm.numberOfCourses + 1;
      // };
      setNumberOfCourses((num) => num + 1);
      setTotalCost((cost) => parseInt(cost) + parseInt(newCourse.cost));
      // setPlanForm((planForm) => ({
      //   ...planForm,
      //   totalCost: increaseTotalCost(newCourse.cost),
      //   numberOfCourses: addNumberOfCourses(1),
      // }));
      courseId.current += 1;
    },
    [courses, planForm]
  );
  const getArrivedDate = (departDate, dayCount) => {
    var newDate = new Date(departDate);
    newDate.setDate(newDate.getDate() + dayCount);
    var year = newDate.getFullYear();
    var month = (newDate.getMonth() + 1).toString().padStart(2, "0");
    var day = newDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  //// event 관리
  const onPlanFormChange = (e) => {
    const changingField = e.target.name;
    setPlanForm((planForm) => ({
      ...planForm,
      [changingField]: e.target.value,
    }));
  };

  const onPlanDataSubmit = (e) => {
    e.preventDefault();
    console.log("코스 짜기 버튼 눌림");
    console.log(planForm);
    setIsFormSubmit(true);
  };

  const onPlanFormSubmit = (e) => {
    e.preventDefault();
    const cost = totalCost;
    const number = numberOfCourses;
    const courseList = courses;
    setPlanForm((planForm) => ({
      ...planForm,
      totalCost: cost,
      numberOfCourses: number,
      courses: courseList,
    }));
    console.log(planForm);
    console.log(courses);
    createTravelPlan(planForm)
      .then((response) => {
        if (response.success) {
          alert("작성 완료되었습니다.");
        } else {
          console.log(response);
          alert(`작성 실패. 원인: ${response.message}`);
        }
      })
      .catch((e) => {
        alert("오류 발생.");
        console.log(e);
      });
  };

  // 렌더링
  return (
    <div className="templateBlock">
      <div className="formContainer">
        <h1>여행 코스 계획 작성</h1>
        <form className="formBox" onSubmit={onPlanDataSubmit}>
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
              defaultValue="default"
              onChange={onPlanFormChange}
              required
            >
              <option value="default" disabled>
                테마 선택
              </option>
              {travelThemeOptions}
            </select>
          </div>
          <div className="formComponent">
            <label htmlFor="province">행정구역</label>
            <select
              name="province"
              id="province"
              defaultValue="default"
              onChange={onPlanFormChange}
              disabled={isFormSubmit}
            >
              <option value="default" disabled>
                시도 선택
              </option>
              {provincesOptions}
            </select>
            <label htmlFor="city">지역</label>
            <select
              name="city"
              id="city"
              defaultValue="default"
              onChange={onPlanFormChange}
              disabled={isFormSubmit}
            >
              <option value="default" disabled>
                지역 선택
              </option>
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
              disabled={isFormSubmit}
              required
            />
            <label>~</label>
            <input
              type="date"
              name="lastDate"
              id="lastDate"
              value={planForm.lastDate}
              onChange={onPlanFormChange}
              disabled={isFormSubmit}
              required
            />
          </div>
          <div>코스 수 : {numberOfCourses}</div>
          <div>총 비용: {totalCost}</div>
          <button
            className="planCourseBtn"
            type="submit"
            disabled={isFormSubmit}
          >
            코스 짜기
          </button>
        </form>
        {isFormSubmit ? (
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
        ) : null}
        <div className="formComponent">
          <button onClick={onPlanFormSubmit}>계획 마치기</button>
        </div>
      </div>
    </div>
  );
};

export default CoursePlanTemplate;
