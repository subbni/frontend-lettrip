import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./lettrip-web/Header/Header";
import Navbar from "./lettrip-web/Home/Navbar";

//페이지 경로 설정
import Home from "./lettrip-web/Home/Home"; // ~:8080/ 홈 화면 (미정)
import Login from "./lettrip-web/Header/Login"; // ~:8080/Login 로그인 화면
import Sign from "./lettrip-web/Header/Sign"; // ~:8080/Sign-up 회원가입 화면

import TravelList from "./lettrip-web/Service/Travel/TravelList"; // ~: /Travel/create 코스 등록 화면
import CourseCreate from "./lettrip-web/Service/Travel/TravelCourse/CourseCreate"; // ~: /Travel/create/course 코스 등록 계획 화면
import ReviewCreate from "./lettrip-web/Service/Travel/TravelReview/ReviewCreate"; // ~: /Travel/create/review 코스 후기 등록 화면

import ArticlesList from "./lettrip-web/Service/Articles/ArticlesList"; // ~:8080/Articles 게시판 전체 목록 화면
import ArticlesCreate from "./lettrip-web/Service/Articles/ArticlesCreate"; // ~:8080/Articles/create 게시판 글 등록 화면
import ArticlesModify from "./lettrip-web/Service/Articles/ArticlesModify"; // ~:8080/Articles/modify/{article-id} 게시판 글 수정 화면
import ArticlesPage from "./lettrip-web/Service/Articles/ArticlesPage"; // ~:8080/Articles/{article-id} 게시판 글 상세 화면

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Sign-up' element={<Sign />} />
          <Route path='/Travel/create' element={<TravelList />} />
          <Route path='/Travel/create/course' element={<CourseCreate />} />
          <Route path='/Travel/create/review' element={<ReviewCreate />} />
          <Route path='/Articles' element={<ArticlesList />} />
          <Route path='/Articles/create' element={<ArticlesCreate />} />
          <Route
            path='/Articles/modify/:article-id'
            element={<ArticlesModify />}
          />
          <Route path='/Articles/page' element={<ArticlesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
