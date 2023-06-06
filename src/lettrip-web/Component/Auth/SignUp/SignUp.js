import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  requestEmailCode,
  requestEmailVerify,
  signUp,
} from "../../../Service/AuthService";
import user_image from "../../../../image/user.png";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    name: "",
    nickname: "",
    imageUrl: null,
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

  //이메일 입력시 이메일 유효 확인
  const onEmailChange = (e) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailInput = e.target.value;
    setEmail(e.target.value);
    if (!emailRegex.test(emailInput)) {
      setEmailMessage("유효하지 않은 이메일 형식입니다.");
      setIsCorrectEmail(false);
    } else {
      setIsCorrectEmail(true);
      setSignUpForm({
        ...signUpForm,
        email: e.target.value,
      });
    }
  };

  //인증번호 요청하기
  const onEmailCodeClick = (e) => {
    if (isCorrectEmail) {
      requestEmailCode(signUpForm.email)
        .then((response) => {
          console.log(signUpForm.email);
          console.log(response);

          window.alert(response.message);
          setIsCodeSent(true);
        })
        .catch((e) => {
          console.log(e);
          window.alert(`인증번호 전송에 실패하였습니다. 원인:${e.message}`);
        });
    } else {
      window.alert("올바른 이메일 형식을 입력해주세요.");
    }
  };

  //인증번호 입력하기
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

  //인증번호 확인 요청
  const onEmailVerifyClick = (e) => {
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

  //정보 입력
  const onFormChange = (e) => {
    const changingField = e.target.name;
    setSignUpForm({
      ...signUpForm,
      [changingField]: e.target.value,
    });
  };
  //회원가입 요청하기
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(signUpForm);
    if (isEmailVerified) {
      signUp(signUpForm)
        .then((response) => {
          if (!response.success) {
            console.log(e);
            window.alert(`회원가입에 실패하였습니다. ${response.message}`);
          } else {
            window.alert("회원가입이 완료되었습니다. 환영합니다!");
            navigate(-1);
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
    <form className='sign_container' onSubmit={onSubmit}>
      <h1 className='sign'>SIGN</h1>
      <input
        className='sign_email'
        type='email'
        name='email'
        placeholder='이메일을 입력하세요.'
        value={email}
        onChange={onEmailChange}
        disabled={isEmailVerified}
        required
      />
      <div className='message'>{emailMessage}</div>
      <button
        type='button'
        className='sign_emailcodebutton'
        onClick={onEmailCodeClick}
        disabled={isEmailVerified}
      >
        인증코드 전송
      </button>
      <input
        className='sign_verificationCode'
        type='text'
        name='email_code'
        placeholder='인증번호를 입력하세요'
        value={emailCode}
        onChange={onEmailCodeChange}
        disabled={isEmailVerified}
        required
      />
      {isCodeSent && remainingTime > 0 && (
        <p className='sign_remainingTime'>남은 시간: {remainingTime}초</p>
      )}
      <button
        type='button'
        className='sign_emailcodebutton'
        onClick={onEmailVerifyClick}
        disabled={isEmailVerified}
      >
        인증하기
      </button>
      <input
        className='sign_name'
        type='text'
        id='name'
        name='name'
        placeholder='이름을 입력하세요.'
        value={signUpForm.name}
        onChange={onFormChange}
      />
      <input
        className='sign_nickname'
        type='text'
        id='nickname'
        name='nickname'
        placeholder='닉네임을 입력하세요.'
        value={signUpForm.nickname}
        onChange={onFormChange}
      />
      <input
        className='sign_password'
        type='password'
        id='password'
        name='password'
        placeholder='비밀번호를 입력하세요.'
        value={signUpForm.password}
        onChange={onFormChange}
      />
      <input
        className='sign_password'
        type='password'
        id='password_confirm'
        name='password_confirm'
        placeholder='비밀번호를 다시 입력하세요.'
        value={passwordConfirm}
        onChange={onPasswordConfirmChange}
      />
      <div className='message'>{passwordConfirmMessage}</div>

      <button className='sign_button' type='submit'>
        가입하기
      </button>
    </form>
  );
};

export default SignUp;
