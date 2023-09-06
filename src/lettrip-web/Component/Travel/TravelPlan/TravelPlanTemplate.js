import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLoggedIn } from "../../../Service/AuthService";
import { Citys, Provinces, TravelThemes } from "../TravelData";
import { createTravelPlan } from "../../../Service/TravelService";
import CourseContainer from "./CourseContainer";

import styles from "./Plan.module.css";

const TravelPlanTemplate = () => {
  const navigate = useNavigate();
  //////// state 관리
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
  const [isPlanDataSubmit, setIsPlanDataSubmit] = new useState(false);

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

  //////// useEffect

  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    }
  }, []);

  // 행정구역 선택에 따른 지역 option 동적 처리
  useEffect(() => {
    const selectedProvinceObject = citys.find(
      (object) => object.province === planForm.province
    );
    if (selectedProvinceObject) {
      setMatchedCitys(selectedProvinceObject.citys);
      setPlanForm((planForm) => ({
        ...planForm,
        city: "",
      }));
      document.getElementById("city").value = "default";
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
    if (diffDate < 0) {
      alert("출발 날짜가 마지막 날짜보다 적을 수 없습니다.");
      return -1;
    }
    return diffDate;
  };

  //////// course 관련 설정
  const courseId = useRef(1);
  const onCourseInsert = useCallback(
    (courseInfo, placeInfo) => {
      const newCourse = {
        id: courseInfo.id,
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

      // 기존에 존재하던 코스이면 수정처리
      const existedCourse = courses.find(function (element, index) {
        return element.id === courseInfo.id;
      });

      if (existedCourse) {
        updateCourse(existedCourse, newCourse);
      } else {
        setCourses(courses.concat(newCourse));
        setNumberOfCourses((num) => num + 1);
        setTotalCost((cost) => parseInt(cost) + parseInt(newCourse.cost));
        courseId.current += 1;
      }
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

  const updateCourse = useCallback(
    (existedCourse, updatedCourse) => {
      setCourses(
        courses.map((course) =>
          course.id === existedCourse.id ? updatedCourse : course
        )
      );
      setTotalCost(
        (cost) =>
          parseInt(cost) -
          parseInt(existedCourse.cost) +
          parseInt(updatedCourse.cost)
      );
    },
    [courses]
  );

  const deleteCourse = useCallback((deletingCourse) => {
    setCourses(courses.filter((course) => course.id !== deletingCourse.id));
    setTotalCost((cost) => parseInt(cost) - parseInt(deletingCourse.cost));
    setNumberOfCourses((number) => number - 1);
  });

  const onCourseDelete = useCallback((courseInfo) => {
    const existedCourse = courses.find(function (element) {
      return element.id === courseInfo.id;
    });
    if (existedCourse) {
      deleteCourse(existedCourse);
      alert("삭제되었습니다.");
    } else {
      alert("없는 코스입니다.");
    }
  });

  //////// event 핸들링
  const onPlanFormChange = (e) => {
    const changingField = e.target.name;
    setPlanForm((planForm) => ({
      ...planForm,
      [changingField]: e.target.value,
    }));
  };

  const onPlanDataSubmit = (e) => {
    e.preventDefault();
    if (days < 0) {
      return alert("출발 날짜가 마지막 날짜보다 적을 수 없습니다.");
    }
    console.log(planForm);
    setIsPlanDataSubmit(true);
  };

  const onPlanFormSubmit = (e) => {
    e.preventDefault();
    if (courses.length < 1) {
      return alert("반드시 1개 이상의 코스가 등록되어야 합니다.");
    }
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
          navigate(`/travel/course/plan/${response.data}`);
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

  return (
    <div className={styles.page}>
      <h2>여행 코스 계획</h2>
      <div className={styles.container}>
        <div className={styles.content01}>
          <form className={styles.reviewForm} onSubmit={onPlanDataSubmit}>
            <div className={styles.formContent01}>
              <input
                type='text'
                name='title'
                id='title'
                onChange={onPlanFormChange}
                placeholder='제목'
                required
              />
            </div>
            <div className={styles.formContent02}>
              <select
                name='province'
                id='province'
                defaultValue='default'
                onChange={onPlanFormChange}
                disabled={isPlanDataSubmit}
              >
                <option value='default' disabled>
                  시/도
                </option>
                {provincesOptions}
              </select>
              <select
                name='city'
                id='city'
                defaultValue='default'
                onChange={onPlanFormChange}
                disabled={isPlanDataSubmit}
              >
                <option value='default' disabled>
                  지역
                </option>
                {matchedCitys.map((city, idx) => (
                  <option key={idx}>{city}</option>
                ))}
              </select>
            </div>
            <div className={styles.formContent02}>
              <input
                type='date'
                aria-required='true'
                data-placeholder='여행 시작일'
                name='departDate'
                id='departDate'
                value={planForm.departDate}
                onChange={onPlanFormChange}
                disabled={isPlanDataSubmit}
                required
              />
              <label>~</label>
              <input
                type='date'
                aria-required='true'
                data-placeholder='여행 종료일'
                name='lastDate'
                id='lastDate'
                value={planForm.lastDate}
                onChange={onPlanFormChange}
                disabled={isPlanDataSubmit}
                required
              />
            </div>
            <div className={styles.formContent02}>
              <select
                name='travelTheme'
                id='travelTheme'
                defaultValue='default'
                onChange={onPlanFormChange}
                required
              >
                <option value='default' disabled>
                  여행 테마
                </option>
                {travelThemeOptions}
              </select>
            </div>
            <button
              className={styles.btn_01}
              type='submit'
              disabled={isPlanDataSubmit}
            >
              계획 시작하기
            </button>
            {isPlanDataSubmit ? (
              <div className={styles.content02}>
                <div className={styles.reviewInfo}>
                  <div className={styles.infoContent}>
                    총 비용 : <span> {totalCost}</span>
                  </div>
                  <div className={styles.infoContent}>
                    코스 수 : <span> {numberOfCourses}</span>
                  </div>
                </div>
                <br />
                {days != null ? (
                  <div>
                    {Array.from({ length: days + 1 }).map((_, index) => {
                      return (
                        <CourseContainer
                          key={index}
                          onCourseInsert={onCourseInsert}
                          onCourseDelete={onCourseDelete}
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
                  <div>여행 계획에 대한 정보를 먼저 입력해주세요</div>
                )}
                <div className={styles.footer}>
                  <button className={styles.btn_02} onClick={onPlanFormSubmit}>
                    계획 마치기
                  </button>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanTemplate;
