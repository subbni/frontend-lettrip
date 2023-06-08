import React, { Component } from "react";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";

class OAuth2RedirectHandler extends Component {
  getParameter(name) {
    const href = window.location.href;
    let params = new URL(document.location).searchParams;
    let code = params.get(name);
    return code;
  }

  render() {
    const token = this.getParameter("access_token");
    const error = this.getParameter("error");
    /**
     * 성공적으로 인증되어 accesstoken을 가지고 있는 경우, query string으로 부터 가져와서 로컬저장소에 저장, 홈으로 리다이렉트.
     * 실패하여 error를 가지고 있는 경우, login 페이지로 리다이렉트.
     */
    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
      console.log(`token = ${token}`);
      return window.location.replace("/");
    } else {
      console.log(error);
      alert(error);
      return window.location.replace("/login");
    }
  }
}

export default OAuth2RedirectHandler;
