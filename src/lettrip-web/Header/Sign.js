import React, { useState, useEffect } from "react";
import "./Sign.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const instance = axios.create({
  headers: { "Access-Control-Allow-Origin": "*" },
  baseURL: "http://ec2-3-36-87-103.ap-northeast-2.compute.amazonaws.com:8080",
  withCredentials: false,
});

const Sign = () => {
  // 초기값 설정
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // 상태값 저장
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [remainingTime, setRemainingTime] = useState(180);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  useEffect(() => {
    //이메일 인증코드 전송 후 3분동안 남은 시간 표시하는 기능
    let interval;
    if (isCodeSent && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isCodeSent, remainingTime]);

  const handleSendVerificationCode = async () => {
    //이메일 인증코드 전송하는 로직
    try {
      const response = await instance.post(
        `/auth/email-code`,
        {
          email: email,
        },
        {
          timeout: 5000, //시간 제한 두기
        }
      );
      console.log(response.data);
      setIsCodeSent(true);
      window.alert("인증번호 전송을 성공했습니다!해당 메일을 확인해주세요!");
    } catch (error) {
      console.error("인증번호 전송 실패!:", error);
      setIsCodeSent(false);
      window.alert(
        "인증번호 전송에 실패했습니다. 다시 메일 주소를 확인해주세요."
      );
    }
  };

  const handleVerificationCodeVerification = () => {
    // 이메일 인증번호 검증을 요청 로직
    instance
      .post(`/auth/email-verify`, {
        email: email,
        code: verificationCode,
      })
      .then((response) => {
        // 서버에서 인증번호 검증이 성공적으로 완료되었을 때 처리할 로직
        console.log("인증번호 검증 성공!");
        window.alert("인증번호 인증에 성공했습니다!");
      })
      .catch((error) => {
        // 에러 발생 시 처리할 로직
        console.error("인증번호 검증 실패:", error);
        window.alert("인증번호 인증에 실패했습니다. 다시 확인해주세요.");
      });
  };

  const handleSignup = () => {
    instance
      .post("/signup", {
        username,
        password,
        nickname,
        email,
      })
      .then((response) => {
        // 회원가입 성공 시 처리할 로직
        console.log("회원가입 완료!");
        window.alert("회원가입에 성공했습니다! 로그인 해주세요!");

        // 로컬 스토리지에 사용자 정보 저장
        const user = {
          username: response.data.username,
          nickname: response.data.nickname,
          email: response.data.email,
        };
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/");
      })
      .catch((error) => {
        // 에러 발생 시 처리할 로직
        console.error("회원가입 실패:", error);
        window.alert("회원가입에 실패했습니다. 다시 시도해주세요");
        window.location.reload();
      });
  };

  return (
    <div className='Sign_Container'>
      <input
        className='Sign_username'
        type='text'
        id='username'
        name='username'
        placeholder='아이디를 입력하세요'
        required
        value={username}
        onChange={handleUsernameChange}
      />
      <input
        className='Sign_password'
        type='password'
        id='password'
        name='password'
        placeholder='비밀번호를 입력하세요'
        required
        value={password}
        onChange={handlePasswordChange}
      />
      <input
        className='Sign_nickname'
        type='text'
        id='nickname'
        name='nickname'
        placeholder='닉네임을 입력하세요'
        required
        value={nickname}
        onChange={handleNicknameChange}
      />
      <input
        className='Sign_email'
        type='email'
        id='email'
        name='email'
        placeholder='이메일을 입력하세요'
        required
        value={email}
        onChange={handleEmailChange}
      />
      <button
        type='button'
        onClick={handleSendVerificationCode}
        className='Sign_emailcodebutton'
      >
        이메일 인증번호 요청하기
      </button>
      <input
        className='Sign_verificationCode'
        type='text'
        id='verificationCode'
        name='verificationCode'
        placeholder='인증번호를 입력하세요'
        required
        value={verificationCode}
        onChange={handleVerificationCodeChange}
      />
      {isCodeSent && remainingTime > 0 && (
        <p className='Sign_remainingTime'>남은 시간: {remainingTime}초</p>
      )}
      <button
        type='button'
        onClick={handleVerificationCodeVerification}
        className='Sign_veritificationbutton'
      >
        이메일 인증번호 인증하기
      </button>
      <button type='submit' onClick={handleSignup} className='Sign_button'>
        가입하기
      </button>
    </div>
  );
};

export default Sign;
