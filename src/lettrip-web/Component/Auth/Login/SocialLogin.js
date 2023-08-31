import googleLogo from "../../../../image/social_logo/btn_google_signin_light_normal_web@2x.png";
import naverLogo from "../../../../image/social_logo/btn_naver.png";
import kakaoLogo from "../../../../image/social_logo/kakao_login_large_narrow.png";
import {
  GOOGLE_AUTH_URL,
  KAKAO_AUTH_URL,
  NAVER_AUTH_URL,
} from "../../../Constant/backendAPI";
import styles from "./Login.module.css";

const SocialLogin = () => {
  return (
    <div>
      <div className={styles.socialContainer}>
        <div className={styles.socialLabel01}>OR</div>

        <div className={styles.socialLabel02}>SNS 계정으로 간편 로그인</div>

        <a href={GOOGLE_AUTH_URL} className={styles.socialcontent}>
          <img className={styles.logo_img} src={googleLogo} alt='Google' />
        </a>
        <a href={NAVER_AUTH_URL} className={styles.socialcontent}>
          <img className={styles.logo_img} src={naverLogo} alt='Naver' />
        </a>
        <a href={KAKAO_AUTH_URL} className={styles.socialcontent}>
          <img className={styles.logo_img} src={kakaoLogo} alt='Kakao' />
        </a>
      </div>
    </div>
  );
};

export default SocialLogin;
