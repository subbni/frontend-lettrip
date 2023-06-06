import { useCallback, useEffect, useRef, useState } from "react";
import { Citys, Provinces, TravelThemes } from "../TravelData";
import CourseReviewContainer from "./CourseReviewContainer";
import "../TravelPlan/Plan.css";
import { createTravelReviewAxios } from "../../../Service/TravelService";

const TravelReviewTemplate = () => {
  //////// state 관리
  const [reviewForm, setReviewForm] = useState({
    title: "",
    travelTheme: "",
    isVisited: true,
    province: "",
    city: "",
    departDate: "",
    lastDate: "",
    totalCost: "",
    numberOfCourses: "",
    courses: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [numberOfCourses, setNumberOfCourses] = useState(0);
  const [days, setDays] = useState(null);
  const [matchedCitys, setMatchedCitys] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isReviewDataSubmit, setIsReviewDataSubmit] = useState(false);

  //////// data list
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
    const selectedProvinceObject = citys.find(
      (object) => object.province === reviewForm.province
    );
    if (selectedProvinceObject) {
      setMatchedCitys(selectedProvinceObject.citys);
      setReviewForm((reviewForm) => ({
        ...reviewForm,
        city: "",
      }));
      document.getElementById("city").value = "default";
    }
  }, [reviewForm.province]);

  useEffect(() => {
    setDays(getDiffDate(reviewForm.lastDate, reviewForm.departDate));
  }, [reviewForm.departDate, reviewForm.lastDate]);

  useEffect(() => {
    const cost = totalCost;
    const number = numberOfCourses;
    const courseList = courses;
    setReviewForm((reviewForm) => ({
      ...reviewForm,
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

  //// course 관련 설정
  const courseId = useRef(1);
  const onCourseInsert = useCallback(
    (courseInfo, reviewInfo, fileNames, newFiles) => {
      const newCourse = {
        id: courseInfo.id,
        arrivedTime:
          getArrivedDate(reviewForm.departDate, courseInfo.dayCount) +
          " " +
          courseInfo.arrivedTime +
          ":00",
        cost: courseInfo.cost,
        dayCount: courseInfo.dayCount,
        place: {
          name: courseInfo.place.name,
          categoryCode: courseInfo.place.categoryCode,
          categoryName: courseInfo.place.categoryName,
          xpoint: courseInfo.place.xpoint,
          ypoint: courseInfo.place.ypoint,
          province: reviewForm.province,
          city: reviewForm.city,
        },
        review: {
          fileNames: fileNames,
          detailedReview: reviewInfo.detailedReview,
          rating: reviewInfo.rating,
          soloFriendlyRating: reviewInfo.soloFriendlyRating,
        },
      };

      // 기존에 존재하던 코스이면 수정처리
      const existedCourse = courses.find(function (element, index) {
        return element.id === courseInfo.id;
      });

      if (existedCourse) {
        updateCourse(existedCourse, newCourse, fileNames, newFiles);
        // 새로 추가된 사진 추가
      } else {
        setCourses(() => courses.concat(newCourse));
        setImageFiles(() => imageFiles.concat(newFiles));
        setNumberOfCourses((num) => num + 1);
        setTotalCost((cost) => parseInt(cost) + parseInt(newCourse.cost));
        courseId.current += 1;
      }
    },
    [courses, reviewForm, imageFiles]
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
    (existedCourse, updatedCourse, fileNames, newFiles) => {
      setCourses(
        courses.map((course) =>
          course.id === existedCourse.id ? updatedCourse : course
        )
      );
      // 추가된 사진 & 삭제된 사진 업데이트 필요
      setImageFiles(
        imageFiles.filter(
          (file) => !updatedCourse.review.fileNames.includes(file.name)
        )
      );
      setImageFiles(() =>
        imageFiles.concat(
          newFiles.filter(function (element, index) {
            return !imageFiles.includes(element);
          })
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
    setImageFiles(
      imageFiles.filter(
        (file) => !deletingCourse.review.fileNames.includes(file.name)
      )
    );
    setCourses(courses.filter((course) => course.id !== deletingCourse.id));
    setTotalCost((cost) => parseInt(cost) - parseInt(deletingCourse.cost));
    setNumberOfCourses((number) => number - 1);
  });

  const onCourseDelete = useCallback((courseInfo, fileNames, files) => {
    const existedCourse = courses.find(function (element, index) {
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
  const onReviewFormChange = (e) => {
    const changingField = e.target.name;
    setReviewForm((planForm) => ({
      ...reviewForm,
      [changingField]: e.target.value,
    }));
  };

  const onReviewDataSubmit = (e) => {
    e.preventDefault();
    if (days < 0) {
      return alert("출발 날짜가 마지막 날짜보다 적을 수 없습니다.");
    }
    console.log(reviewForm);
    setIsReviewDataSubmit(true);
  };

  const onReviewFormSubmit = (e) => {
    e.preventDefault();
    if (courses.length < 1) {
      return alert("반드시 1개 이상의 코스가 등록되어야 합니다.");
    }

    console.log(reviewForm);
    createTravelReviewAxios({ reviewForm, imageFiles })
      .then((response) => {
        if (response.data.success) {
          if (response) {
            alert("작성 완료되었습니다.");
          } else {
            console.log(response);
            alert(`작성 실패. 원인: ${response.data.message}`);
          }
        }
      })
      .catch((e) => {
        window.alert("오류 발생.");
        console.log(e);
      });
    // window.URL.revokeObjectURL(urls); => 메모리 누수 방지, url 삭제해주기
  };

  return (
    <div className='templateBlock'>
      <div className='formContainer'>
        <h1>여행 코스 기록</h1>
        <form className='formBox' onSubmit={onReviewDataSubmit}>
          <div className='formComponent'>
            <label htmlFor='title'>제목</label>
            <input
              type='text'
              name='title'
              id='title'
              onChange={onReviewFormChange}
              required
            />
          </div>
          <div className='formComponent'>
            <label htmlFor='travelTheme'>테마</label>
            <select
              name='travelTheme'
              id='travelTheme'
              defaultValue='default'
              onChange={onReviewFormChange}
              required
            >
              <option value='default' disabled>
                테마 선택
              </option>
              {travelThemeOptions}
            </select>
          </div>
          <div className='formComponent'>
            <label htmlFor='province'>행정구역</label>
            <select
              name='province'
              id='province'
              defaultValue='default'
              onChange={onReviewFormChange}
              disabled={isReviewDataSubmit}
            >
              <option value='default' disabled>
                시도 선택
              </option>
              {provincesOptions}
            </select>
            <label htmlFor='city'>지역</label>
            <select
              name='city'
              id='city'
              defaultValue='default'
              onChange={onReviewFormChange}
              disabled={isReviewDataSubmit}
            >
              <option value='default' disabled>
                지역 선택
              </option>
              {matchedCitys.map((city, idx) => (
                <option key={idx}>{city}</option>
              ))}
            </select>
          </div>
          <div className='formComponent'>
            <label htmlFor='departDate'>여행 기간</label>
            <input
              type='date'
              name='departDate'
              id='departDate'
              value={reviewForm.departDate}
              onChange={onReviewFormChange}
              disabled={isReviewDataSubmit}
              required
            />
            <label>~</label>
            <input
              type='date'
              name='lastDate'
              id='lastDate'
              value={reviewForm.lastDate}
              onChange={onReviewFormChange}
              disabled={isReviewDataSubmit}
              required
            />
          </div>
          <div>코스 수 : {numberOfCourses}</div>
          <div>총 비용: {totalCost}</div>
          <button
            className='planCourseBtn'
            type='submit'
            disabled={isReviewDataSubmit}
          >
            코스 기록
          </button>
        </form>
        {isReviewDataSubmit ? (
          <div className='formComponent'>
            <br />
            {days !== null ? (
              <div>
                {Array.from({ length: days + 1 }).map((_, index) => {
                  return (
                    <CourseReviewContainer
                      key={index}
                      onCourseInsert={onCourseInsert}
                      onCourseDelete={onCourseDelete}
                      province={reviewForm.province}
                      city={reviewForm.city}
                      dapartDate={reviewForm.departDate}
                      dayCount={index + 1}
                      containerIdx={index}
                    />
                  );
                })}
              </div>
            ) : (
              <div>여행에 대한 정보를 먼저 입력해주세요</div>
            )}
            <div className='formComponent'>
              <button className="planCompleteBtn" onClick={onReviewFormSubmit}>기록 마치기</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TravelReviewTemplate;
