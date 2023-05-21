import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CoursePage.css";
import { PageCourse } from "../../Service/APIService";

function ArticlePage() {
  const { travelId } = useParams();
  const [courseDetail, setCourseDetail] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = () => {
    PageCourse(travelId)
      .then((response) => {
        setCourseDetail(response.data);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  return (
    <div className='ArticlePagecontainer'>
      {courseDetail ? (
        <>
          <h1 className='title'>{courseDetail.title}</h1>
          <h3 className='author'>{courseDetail.writerNickname}</h3>
          <p className='content'>
            <strong>여행 테마:</strong> {courseDetail.travelTheme}
          </p>
          <p className='content'>
            <strong>장소:</strong> {courseDetail.province} {courseDetail.city}
          </p>
          <p className='content'>
            <strong>출발 날짜:</strong> {courseDetail.departDate}
          </p>
          <p className='content'>
            <strong>마지막 날짜:</strong> {courseDetail.lastDate}
          </p>
          <p className='content'>
            <strong>총 비용:</strong> {courseDetail.totalCost}
          </p>
          <p className='content'>
            <strong>코스 개수:</strong> {courseDetail.numberOfCourses}
          </p>
          {courseDetail.courses.map((course, index) => (
            <div key={index}>
              <h2>코스 {index + 1}</h2>
              <p>
                <strong>도착 시간:</strong> {course.arrivedTime}
              </p>
              <p>
                <strong>비용:</strong> {course.cost}
              </p>
              <p>
                <strong>일 수:</strong> {course.dayCount}
              </p>
              <p>
                <strong>장소:</strong> {course.place.name}
              </p>
              <p>
                <strong>장소 주소:</strong>{" "}
                {`${course.place.province} ${course.place.city}`}
              </p>
              <p>
                <strong>리뷰:</strong> {course.review.detailReview}
              </p>
              <p>
                <strong>평점:</strong> {course.review.rating}
              </p>
              <p>
                <strong>혼자 여행 친화도:</strong>{" "}
                {course.review.soloFriendlyRating}
              </p>
              {course.review.fileUrls.length > 0 && (
                <div>
                  <strong>사진:</strong>
                  {course.review.fileUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Review Image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          {courseDetail.visited && <p>이미 방문한 여행 코스입니다.</p>}
        </>
      ) : (
        <p>여행 코스를 불러오는 중입니다.</p>
      )}
    </div>
  );
}

export default ArticlePage;
