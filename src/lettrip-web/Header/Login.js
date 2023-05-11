import axios from "axios";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const instance = axios.create({
  headers: { "Access-Control-Allow-Origin": "*" },
  baseURL: "http://ec2-3-35-173-250.ap-northeast-2.compute.amazonaws.com:8080",
  withCredentials: false,
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // access token 가져오기
  function getAccessToken() {
    return localStorage.getItem("accessToken");
  }
  // access token 로컬 스토리지에 저장
  function setAccessToken(token) {
    localStorage.setItem("accessToken", token);
  }
  // access token 삭제
  function removeAccessToken() {
    localStorage.removeItem("accessToken");
  }

  // 새로고침 이벤트 감지
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    localStorage.removeItem("accessToken");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLoginFormSubmit = (e) => {
    e.preventDefault();

    // 서버로 데이터 보낼 준비
    const data = {
      username,
      password,
    };

    // API call 만들기
    instance
      .post("/login", data)
      .then((response) => {
        console.log("인증 성공");
        const token = response.data.accessToken; // 응답에 포함된 토큰 정보 저장

        // 토큰 정보 검증
        const decodedToken = jwt_decode(token);
        const now = new Date().getTime() / 1000; // 초 단위 시간 계산
        if (decodedToken.exp < now) {
          console.error("토큰 만료");
          window.alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          return;
        }
        if (
          decodedToken.iss !==
          "http://ec2-3-35-173-250.ap-northeast-2.compute.amazonaws.com:8080"
        ) {
          console.error("조작된 토큰");
          window.alert("올바르지 않은 인증 정보입니다. 다시 로그인해주세요.");
          return;
        }
        // 토큰 정보를 로컬 스토리지에 저장
        localStorage.setItem("accessToken", token);
        navigate("/");
      })
      .catch((error) => {
        console.error("로그인 검증 실패:", error);
        window.alert("로그인에 실패했습니다. 다시 확인해주세요.");
        window.location.reload();
      });
  };

  // 모든 HTTP 응답에 대해 처리하는 interceptors 설정
  instance.interceptors.response.use(
    (response) => {
      // 상태 코드가 200인 경우
      return response;
    },
    (error) => {
      // 상태 코드가 200이 아닌 경우
      console.error("에러 발생:", error);
      if (error.response.status === 401) {
        // 인증 실패
        removeAccessToken(); // 토큰 삭제
        navigate("/login"); // 로그인 페이지로 이동
      }
      return Promise.reject(error);
    }
  );

  return (
    <form className='Login_container' onSubmit={handleLoginFormSubmit}>
      <div className='Login'>LOGIN</div>
      <label htmlFor='username'>아이디</label>
      <input
        className='Login_username'
        type='text'
        id='username'
        name='username'
        placeholder='아이디를 입력하세요'
        required
        value={username}
        onChange={handleUsernameChange}
      />
      <label htmlFor='password'>비밀번호</label>
      <input
        className='Login_password'
        type='password'
        id='password'
        name='password'
        placeholder='비밀번호를 입력하세요'
        required
        value={password}
        onChange={handlePasswordChange}
      />
      <button
        style={{
          width: "200px",
          height: "40px",
          backgroundColor: "#2E3B4C",
          color: "white",
          borderRadius: "30px",
        }}
        type='submit'
      >
        로그인
      </button>
    </form>
  );
}

export default Login;
