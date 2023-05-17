import GoogleLogin from "../components/google";
import NaverLogin from "../components/naver";
import KakaoLogin from "../components/kakao";

function SocialLogin() {
  const onSuccessHandler = (res) => {
    console.log(res);
  };
  return (
    <div className='App'>
      <GoogleLogin
        success={onSuccessHandler}
        fail={(res) => console.log(res)}
      />
      <NaverLogin success={onSuccessHandler} fail={(res) => console.log(res)} />
      <KakaoLogin success={onSuccessHandler} fail={(res) => console.log(res)} />
    </div>
  );
}

export default SocialLogin;
