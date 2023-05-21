<<<<<<< HEAD
import React, { useState, useEffect, useSyncExternalStore } from "react";
import "./SignUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  requestEmailCode,
  requestEmailVerify,
  signUp,
} from "../../../Service/AuthService";

const SignUp = () => {
  const navigate = useNavigate();

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    name: "",
    nickname: "",
  });
  const [email, setEmail] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailCode, setEmailCode] = useState("");

  // 오류 & 확인 메세지
  const [emailMessage, setEmailMessage] = useState("");
  const [emailVerifiedMessage, setEmailVerifiedMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");

  // 유효성 검사
  const [isCorrectEmail, setIsCorrectEmail] = useState(""); // 올바른 이메일 양식인가?
  const [isEmailVerified, setIsEmailVerified] = useState(""); // 이메일 인증이 되었는가?
  const [isCodeSent, setIsCodeSent] = useState(false); // 이메일 인증 코드 전송이 되었는가?
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false); // 비밀번호와 비밀번호 확인이 일치하는가?

  // 상태값 저장
  const [remainingTime, setRemainingTime] = useState(180);

  useEffect(() => {
    // 이메일 인증코드 전송 후 3분동안 남은 시간 표시하는 기능
=======
import React, { useState, useEffect } from "react";
import "./SignUp.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const instance = axios.create({
  headers: { "Access-Control-Allow-Origin": "*" },
  baseURL: "http://ec2-3-36-87-103.ap-northeast-2.compute.amazonaws.com:8080",
  withCredentials: false,
});

const SignUp = () => {
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
>>>>>>> a9f21b3 (댓글 수정 완료 및 여행 코스 상세페이지 완료)
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

<<<<<<< HEAD
  // onChange 핸들링
  const onFormChange = (e) => {
    const changingField = e.target.name;
    setSignUpForm({
      ...signUpForm,
      [changingField]: e.target.value,
    });
  };
  const onEmailChange = (e) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailInput = e.target.value;
    setEmail(e.target.value);

    if (!emailRegex.test(emailInput)) {
      setEmailMessage("유효하지 않은 이메일 형식입니다.");
      setIsCorrectEmail(false);
    } else {
      setEmailMessage("");
      setIsCorrectEmail(true);
      setSignUpForm({
        ...signUpForm,
        email: e.target.value,
      });
    }
  };
  const onEmailCodeChange = (e) => {
    setEmailCode(e.target.value);
  };
  const onPasswordConfirmChange = (e) => {
    const passwordConfirmInput = e.target.value;
    setPasswordConfirm(e.target.value);
    if (signUpForm.password === passwordConfirmInput) {
      setPasswordConfirmMessage("");
      setIsPasswordConfirm(true);
    } else {
      setPasswordConfirmMessage("비밀번호와 일치하지 않습니다.");
      setIsPasswordConfirm(false);
    }
  };

  // onClick 핸들링
  const onEmailCodeBtnClick = (e) => {
    if (isCorrectEmail) {
      console.log(`email: ${email}`);
      requestEmailCode(email)
        .then((response) => {
          if (response.success) {
            window.alert(response.message);
            setIsCodeSent(true);
          }
        })
        .catch((e) => {
          console.log(e);
          window.alert(`인증번호 전송에 실패하였습니다. 원인:${e.message}`);
        });
    } else {
      window.alert("올바른 이메일 형식을 입력해주세요.");
    }
  };

  const onEmailVerifyBtnClick = (e) => {
    if (isCodeSent) {
      requestEmailVerify(emailCode)
        .then((response) => {
          console.log(response);
          window.alert(response.message);
          setIsEmailVerified(true);
          setEmailVerifiedMessage("이메일 인증되었습니다.");
        })
        .catch((e) => {
          console.log(e);
          window.alert(`이메일 인증에 실패했습니다. ${e.errorMessage}`);
        });
    } else {
      window.alert("이메일 인증번호 전송 버튼을 눌러주세요.");
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(signUpForm);
    if (isEmailVerified) {
      signUp(signUpForm)
        .then((response) => {
          if (response.success) {
            window.alert("회원가입이 완료되었습니다. 환영합니다!");
            navigate(-1);
          } else {
            console.log(e);
            window.alert(`회원가입에 실패하였습니다. ${response.message}`);
          }
        })
        .catch((e) => {
          console.log(e);
          window.alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
          window.location.reload();
        });
    } else {
      window.alert("이메일 인증이 필요합니다.");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="Sign_Container">
        <input
          className="Sign_email"
          type="email"
          name="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={onEmailChange}
          disabled={isEmailVerified}
          required
        />
        <label>{emailMessage}</label>
        <br />
        <button
          type="button"
          className="Sign_emailcodebutton"
          onClick={onEmailCodeBtnClick}
          disabled={isEmailVerified}
        >
          인증코드 전송
        </button>
        <input
          className="Sign_verificationCode"
          type="text"
          name="email_code"
          placeholder="인증번호를 입력하세요"
          value={emailCode}
          onChange={onEmailCodeChange}
          disabled={isEmailVerified}
          required
        />
        {isCodeSent && remainingTime > 0 && (
          <p className="Sign_remainingTime">남은 시간: {remainingTime}초</p>
        )}
        <button
          type="button"
          className="Sign_veritificationbutton"
          onClick={onEmailVerifyBtnClick}
          disabled={isEmailVerified}
        >
          인증하기
        </button>
        <input
          className="Sign_password"
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={signUpForm.password}
          onChange={onFormChange}
        />
        <input
          className="Sign_password"
          type="password"
          id="password_confirm"
          name="password_confirm"
          placeholder="비밀번호를 다시 입력하세요"
          value={passwordConfirm}
          onChange={onPasswordConfirmChange}
        />
        <label>{passwordConfirmMessage}</label>
        <input
          className="Sign_nickname"
          type="text"
          id="name"
          name="name"
          placeholder="이름을 입력하세요"
          value={signUpForm.name}
          onChange={onFormChange}
        />
        <input
          className="Sign_nickname"
          type="text"
          id="nickname"
          name="nickname"
          placeholder="닉네임을 입력하세요"
          value={signUpForm.nickname}
          onChange={onFormChange}
        />

        <button type="submit">가입하기</button>
      </div>
    </form>
=======
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
>>>>>>> a9f21b3 (댓글 수정 완료 및 여행 코스 상세페이지 완료)
  );
};

export default SignUp;
