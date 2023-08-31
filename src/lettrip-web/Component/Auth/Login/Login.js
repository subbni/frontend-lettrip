import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI"; //토큰
import { login } from "../../../Service/AuthService"; //로그인 서비스
import SocialLogin from "./SocialLogin"; //소셜 로그인

import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleLoginFormChange = (e) => {
    const changedField = e.target.name;
    setLoginForm({
      ...loginForm,
      [changedField]: e.target.value,
    });
  };

  const handleLoginFormSubmit = (e) => {
    e.preventDefault();
    login(loginForm)
      .then((response) => {
        setJwtToken(response);
        window.alert("로그인 되었습니다.");
        navigate("/");
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
        window.alert("로그인에 실패하였습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  const setJwtToken = (response) => {
    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
    localStorage.setItem("email", loginForm.email);
  };

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginContainer} onSubmit={handleLoginFormSubmit}>
        <h1 className={styles.loginTitle}>LOGIN</h1>
        <label className={styles.loginLabel} htmlFor='email'>
          ID
        </label>
        <input
          className={styles.loginContent}
          type='email'
          id='email'
          name='email'
          placeholder='이메일을 입력하세요.'
          required
          value={loginForm.email}
          onChange={handleLoginFormChange}
        />
        <label className={styles.loginLabel} htmlFor='password'>
          PW
        </label>
        <input
          className={styles.loginContent}
          type='password'
          id='password'
          name='password'
          placeholder='비밀번호를 입력하세요.'
          required
          value={loginForm.password}
          onChange={handleLoginFormChange}
        />
        <button className={styles.loginBtn} type='submit'>
          로그인
        </button>
      </form>
      <SocialLogin />
    </div>
  );
}

export default Login;
