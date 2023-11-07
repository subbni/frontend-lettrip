import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkIfLoggedIn } from "../../Service/AuthService";
import UserProfileContainer from "./profile/UserProfileContainer";
import MeetUpReview from "./MeetUpReview/MeetUpReview";
import UserTravelPlan from "./myTravel/UserTravelPlan";
import UserTravelReview from "./myTravel/UserTravelReview";
import styles from "./MyPage.module.css";
import { MdOutlineArrowBackIos } from "react-icons/md";

const MyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeButton, setActiveButton] = useState("meetUpReview"); //기본으로는 한줄평 css
  const [content, setContent] = useState("meetUpReview"); //기본으로 한줄평

  //로그인 여부 확인
  useEffect(() => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    setContent(buttonName);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className={styles.page}>
          <div className={styles.header}>
            <MdOutlineArrowBackIos className={styles.backIcon} />
            <h3 className={styles.headerText}> 프로필</h3>
          </div>
          <hr className={styles.hr01} />
          <div className={styles.profileContainer}>
            <UserProfileContainer UserId={id} />
          </div>
          <div className={styles.container}>
            <div className={styles.optionHeader}>
              <button
                className={
                  activeButton === "meetUpReview"
                    ? `${styles.meetUpReview} ${styles.active}`
                    : styles.meetUpReview
                }
                onClick={() => handleButtonClick("meetUpReview")}
              >
                한줄평
              </button>
              <button
                className={
                  activeButton === "travelPlan"
                    ? `${styles.travelPlan} ${styles.active}`
                    : styles.travelPlan
                }
                onClick={() => handleButtonClick("travelPlan")}
              >
                여행플랜
              </button>
              <button
                className={
                  activeButton === "travelReview"
                    ? `${styles.travelReview} ${styles.active}`
                    : styles.travelReview
                }
                onClick={() => handleButtonClick("travelReview")}
              >
                여행기록
              </button>
            </div>
            <hr className={styles.hr02} />
          </div>

          <div>
            {content === "meetUpReview" && (
              <div className={styles.meetUpReviewContainer}>
                {/* meetUpReview에 대한 내용 출력 */}
                <MeetUpReview UserId={id} />
              </div>
            )}

            {content === "travelPlan" && (
              <div className={styles.travelPlanContainer}>
                {/* travelPlan에 대한 내용 출력 */}
                <UserTravelPlan UserId={id} />
              </div>
            )}

            {content === "travelReview" && (
              <div className={styles.travelReviewContainer}>
                {/* travelReview에 대한 내용 출력 */}
                <UserTravelReview UserId={id} />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyPage;
