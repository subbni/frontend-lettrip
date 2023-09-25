import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTravelReviewAxios } from "../../../Service/TravelService";
import { checkIfLoggedIn } from "../../../Service/AuthService";
import { Citys, Provinces, TravelThemes } from "../TravelData";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import CourseReviewContainer from "./CourseReviewContainer";

import styles from "./Review.module.css";

const TravelReviewTemplate = () => {
  const navigate = useNavigate();

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
    mainImageName: null,
    courses: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [mainImage, setMainImage] = useState(reviewForm.mainImageName);

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

  const [showContents, setShowContents] = useState(false); //내용 숨기기 및 보여주기
  const [showFormBtn, setShowFormBtn] = useState(false); //버튼 숨기기 및 보여주기

  /*
  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    }
  }); */

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

  useEffect(() => {
    const imgname = mainImage;
    setReviewForm((reviewForm) => ({
      ...reviewForm,
      mainImageName: imgname,
    }));
    console.log("mainImage 상태.", mainImage);
    console.log(reviewForm.mainImageName);
  }, [mainImage]);

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
    setShowContents(!showContents);
    e.preventDefault();
    if (days < 0) {
      return alert("출발 날짜가 마지막 날짜보다 적을 수 없습니다.");
    }
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
            navigate(`/travel/course/review/${response.data}`);
          } else {
            console.log(response);
            console.log(reviewForm);
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

  //폼 내용 보는 버튼
  const showContentBtn = (e) => {
    e.preventDefault();
    setShowContents(!showContents); //내용 보이게 하기
    setShowFormBtn(!showFormBtn); //접기 버튼 안보이게 하기
  };
  //폼 내용 닫는 버튼
  const hideContentBtn = (e) => {
    e.preventDefault();
    setShowContents(!showContents); //내용 안 보이게 하기
    setShowFormBtn(!showFormBtn); //내용 닫기 버튼 안보이게 하기
  };
  //메인이미지 관리
  const onMainImageSet = (imageName) => {
    setMainImage(imageName);
  };

  return (
    <div className={styles.page}>
      <h2>여행 코스 기록</h2>
      <div className={styles.container}>
        <div className={styles.box}>
          <form className={styles.planForm} onSubmit={onReviewDataSubmit}>
            <div className={styles.formTitle}>
              <input
                className={styles.content01}
                type='text'
                name='title'
                id='title'
                onChange={onReviewFormChange}
                placeholder='제목'
                required
              />
            </div>
            {!showContents ? (
              <div className={styles.formShowContent}>
                <div className={styles.formContent}>
                  <select
                    className={styles.content02}
                    name='province'
                    id='province'
                    value={reviewForm.province}
                    onChange={onReviewFormChange}
                    disabled={isReviewDataSubmit}
                    required
                  >
                    <option value='' disabled>
                      시/도
                    </option>
                    {provincesOptions}
                  </select>
                  <select
                    className={styles.content02}
                    name='city'
                    id='city'
                    value={reviewForm.province}
                    onChange={onReviewFormChange}
                    disabled={isReviewDataSubmit}
                    required
                  >
                    <option value='' disabled>
                      지역
                    </option>
                    {matchedCitys.map((city, idx) => (
                      <option key={idx}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formContent}>
                  <input
                    className={styles.content03}
                    type='date'
                    aria-required='true'
                    data-placeholder='여행 시작일'
                    name='departDate'
                    id='departDate'
                    value={reviewForm.departDate}
                    onChange={onReviewFormChange}
                    disabled={isReviewDataSubmit}
                    required
                  />
                  <label className={styles.contentLabel01}>~</label>
                  <input
                    className={styles.content03}
                    type='date'
                    aria-required='true'
                    data-placeholder='여행 종료일'
                    name='lastDate'
                    id='lastDate'
                    value={reviewForm.lastDate}
                    onChange={onReviewFormChange}
                    disabled={isReviewDataSubmit}
                    required
                  />
                </div>
                <div className={styles.formContent}>
                  <select
                    className={styles.content02}
                    name='travelTheme'
                    id='travelTheme'
                    disabled={isReviewDataSubmit}
                    value={reviewForm.travelTheme}
                    onChange={onReviewFormChange}
                    required
                  >
                    <option value='' disabled>
                      여행 테마
                    </option>
                    {travelThemeOptions}
                  </select>
                </div>
              </div>
            ) : (
              <div className={styles.btn02} onClick={showContentBtn}>
                <p className={styles.btnLabel01}>더보기</p>
                <AiOutlineDown className={styles.icon01} />
              </div>
            )}
            {!isReviewDataSubmit ? ( //계획 시작하기 버튼 누르면 안보이게 하기
              <button
                className={styles.btn01}
                type='submit'
                disabled={isReviewDataSubmit}
              >
                기록 시작하기
              </button>
            ) : null}
            {showFormBtn ? ( //펼치기 눌러졌을 때
              <div className={styles.btn02} onClick={hideContentBtn}>
                <AiOutlineUp className={styles.icon01} />
              </div>
            ) : null}
            {isReviewDataSubmit ? (
              <div className={styles.formDetail}>
                <div className={styles.planFormInfo}>
                  <div className={styles.infoContent}>
                    총 비용 : <span> {totalCost}</span>
                  </div>
                  <div className={styles.infoContent}>
                    코스 수 : <span> {numberOfCourses}</span>
                  </div>
                </div>
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
                          onMainImageSet={onMainImageSet}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div>여행 후기에 대한 정보를 먼저 입력해주세요</div>
                )}
                <div className={styles.footer}>
                  <button className={styles.btn03} onClick={onReviewFormSubmit}>
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

export default TravelReviewTemplate;
