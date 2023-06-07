import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./lettrip-web/Top/Header";
import Navbar from "./lettrip-web/Top/Navbar";

//홈페이지
import Home from "./lettrip-web/Component/Home";

//로그인,회원가입 경로 설정
import Login from "./lettrip-web/Component/Auth/Login/Login";
import SignUp from "./lettrip-web/Component/Auth/SignUp/SignUp";
import OAuth2RedirectHandler from "./lettrip-web/Component/Auth/Login/OAuth2RedirectHandler";

//커뮤니티 경로 설정
import ArticleList from "./lettrip-web/Component/Article/ArticleList";
import ArticleCreate from "./lettrip-web/Component/Article/ArticleCreate";
import ArticleModify from "./lettrip-web/Component/Article/ArticleModify";
import ArticlePage from "./lettrip-web/Component/Article/ArticlePage";

//여행코스 검색 경로 설정
import TravelSearchPage from "./lettrip-web/Component/Travel/TravelSearch/TravelSearchPage";
import TravelDetailPage from "./lettrip-web/Component/Travel/TravelDetail/TravelDetailPage";
//여행코스 계획 경로 설정
import TravelPlanTemplate from "./lettrip-web/Component/Travel/TravelPlan/TravelPlanTemplate";
//여행코스 후기 경로 설정
import TravelReviewTemplate from "./lettrip-web/Component/Travel/TravelReview/TravelReviewTemplate";

// 미션
import MissionPage from "./lettrip-web/Component/Mission/MissionPage";
import QRMissionPage from "./lettrip-web/Component/Mission/QR/QRMissionPage";

// 마이페이지
import MyPage from "./lettrip-web/Component/MyPage/MyPage";
import PlaceReviewPage from "./lettrip-web/Component/PlaceReview/PlaceReviewPage";

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='oauth2/redirect' element={<OAuth2RedirectHandler />} />

          <Route path='/travel/search' element={<TravelSearchPage />} />
          <Route path='/travel/course/:id' element={<TravelDetailPage />} />
          <Route
            path='/travel/course/create'
            element={<TravelPlanTemplate />}
          />
          <Route
            path='/travel/review/create'
            element={<TravelReviewTemplate />}
          />
          <Route path='/travel/review' element={<TravelReviewTemplate />} />

          <Route path='/mission' element={<MissionPage />} />
          <Route path='/mission/qr' element={<QRMissionPage />} />

          <Route path='/articles' element={<ArticleList />} />
          <Route path='/articles/:id' element={<ArticlePage />} />
          <Route path='/articles/create' element={<ArticleCreate />} />
          <Route path='/articles/modify/:id' element={<ArticleModify />} />

          <Route path='/mypage' element={<MyPage />} />
          <Route path='/place' element={<PlaceReviewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
