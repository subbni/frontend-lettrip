import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./lettrip-web/Top/Header";
import Navbar from "./lettrip-web/Top/Navbar";

//페이지 경로 설정
<<<<<<< HEAD
import Home from "./lettrip-web/Component/Home"; // ~:8080/ 홈 화면 (미정)
import Login from "./lettrip-web/Component/Auth/Login/Login"; // ~:8080/Login 로그인 화면
import Sign from "./lettrip-web/Component/Auth/SignUp/SignUp.js"; // ~:8080/Sign-up 회원가입 화면
=======
import Home from "./lettrip-web/Component/Home";
import Login from "./lettrip-web/Component/Auth/Login/Login";
import SignUp from "./lettrip-web/Component/Auth/SignUp/SignUp";
>>>>>>> a9f21b3 (댓글 수정 완료 및 여행 코스 상세페이지 완료)

//여행코스 경로 설정
import CourseCreate from "./lettrip-web/Component/Travel/CoursePlan/CourseCreate";
import CourseModify from "./lettrip-web/Component/Travel/CoursePlan/CourseModify";
import ReviewCreate from "./lettrip-web/Component/Travel/CourseReview/ReviewCreate";
import ReviewModify from "./lettrip-web/Component/Travel/CourseReview/ReviewModify";
import CoursePage from "./lettrip-web/Component/Travel/CourseSearch/CoursePage";

//커뮤니티 경로 설정
import ArticleList from "./lettrip-web/Component/Article/ArticleList";
import ArticleCreate from "./lettrip-web/Component/Article/ArticleCreate";
import ArticleModify from "./lettrip-web/Component/Article/ArticleModify";
import ArticlePage from "./lettrip-web/Component/Article/ArticlePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navbar />
        <Routes>
<<<<<<< HEAD
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Sign-up" element={<Sign />} />
          <Route path="/Travel/create/course" element={<CourseCreate />} />
          <Route path="/Travel/create/review" element={<ReviewCreate />} />
          <Route path="/Articles" element={<ArticlesList />} />
          <Route path="/Articles/create" element={<ArticlesCreate />} />
          <Route
            path="/Articles/modify/:article-id"
            element={<ArticlesModify />}
          />
          <Route path="/Articles/page" element={<ArticlesPage />} />
=======
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/SignUp' element={<SignUp />} />

          <Route path='/Travel/Course/Create' element={<CourseCreate />} />
          <Route path='/Travel/Course/Modify' element={<CourseModify />} />
          <Route path='/Travel/Review/Create' element={<ReviewCreate />} />
          <Route path='/Travel/Review/Modify' element={<ReviewModify />} />
          <Route path='/Travel/:travel-id' element={<CoursePage />} />

          <Route path='/Article' element={<ArticleList />} />
          <Route path='/Article/create' element={<ArticleCreate />} />
          <Route
            path='/Article/modify/:article-id'
            element={<ArticleModify />}
          />
          <Route path='/Article/:article-id' element={<ArticlePage />} />
>>>>>>> a9f21b3 (댓글 수정 완료 및 여행 코스 상세페이지 완료)
        </Routes>
      </div>
    </Router>
  );
}

export default App;
