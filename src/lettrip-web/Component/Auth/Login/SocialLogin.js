import googleLogo from "../../../../image/social_logo/btn_google_signin_light_normal_web@2x.png";
import naverLogo from "../../../../image/social_logo/btn_naver.png";
import kakaoLogo from "../../../../image/social_logo/kakao_login_large_narrow.png";
import {
  GOOGLE_AUTH_URL,
  KAKAO_AUTH_URL,
  NAVER_AUTH_URL,
} from "../../../Constant/backendAPI";
import "./Login.css";
const SocialLogin = () => {
  return (
    <div>
      <div className='socialLogin_container'>
        <div className='OR_msg'>OR</div>

        <div className='seperateMsg'>SNS 계정으로 간편 로그인</div>

        <a href={GOOGLE_AUTH_URL} className='socialLogin'>
          <img className='social_logo' src={googleLogo} alt='Google' />
        </a>
        <a href={NAVER_AUTH_URL} className='socialLogin'>
          <img className='social_logo' src={naverLogo} alt='Naver' />
        </a>
        <a href={KAKAO_AUTH_URL} className='socialLogin'>
          <img className='social_logo' src={kakaoLogo} alt='Kakao' />
        </a>
      </div>
    </div>
  );
};

export default SocialLogin;
