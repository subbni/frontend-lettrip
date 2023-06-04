import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";
import { login } from "../../../Service/AuthService";
import "./Login.css";

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
        console.log(response);
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
  };

  return (
    <form className='Login_container' onSubmit={handleLoginFormSubmit}>
      <h1 className='Logint'>LOGIN</h1>
      <label htmlFor='email'>ID</label>
      <input
        className='Login_username'
        type='email'
        id='email'
        name='email'
        placeholder='이메일을 입력하세요'
        required
        value={loginForm.email}
        onChange={handleLoginFormChange}
      />
      <label htmlFor='password'>PW</label>
      <input
        className='Login_password'
        type='password'
        id='password'
        name='password'
        placeholder='비밀번호를 입력하세요'
        required
        value={loginForm.password}
        onChange={handleLoginFormChange}
      />
      <button
        type='submit'
        style={{
          width: "200px",
          height: "40px",
          backgroundColor: "#2E3B4C",
          color: "white",
          borderRadius: "30px",
        }}
      >
        로그인
      </button>
    </form>
  );
}

export default Login;
