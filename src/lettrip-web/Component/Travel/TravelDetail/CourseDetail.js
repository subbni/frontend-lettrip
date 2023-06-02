import { useEffect } from "react";

const CourseDetail = ({ course }) => {
  useEffect(() => {
    console.log(course);
  }, []);
  return (
    <div>
      <div>{course.place.name}</div>
    </div>
  );
};

export default CourseDetail;
