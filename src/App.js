import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./lettrip-web/Top/Header";
import Navbar from "./lettrip-web/Top/Navbar";

//페이지 경로 설정
import Home from "./lettrip-web/Component/Home";
import Login from "./lettrip-web/Component/Auth/Login/Login";
import SignUp from "./lettrip-web/Component/Auth/SignUp/SignUp";

//여행코스 경로 설정
import TravelSearch from "./lettrip-web/Component/Travel/CourseSearch/TravelSearch";
import CoursePage from "./lettrip-web/Component/Travel/CourseSearch/CoursePage";
import CourseCreate from "./lettrip-web/Component/Travel/CoursePlan/CourseCreate";
import CourseModify from "./lettrip-web/Component/Travel/CoursePlan/CourseModify";
import ReviewCreate from "./lettrip-web/Component/Travel/CourseReview/ReviewCreate";
import ReviewModify from "./lettrip-web/Component/Travel/CourseReview/ReviewModify";

//커뮤니티 경로 설정
import ArticleList from "./lettrip-web/Component/Article/ArticleList";
import ArticleCreate from "./lettrip-web/Component/Article/ArticleCreate";
import ArticleModify from "./lettrip-web/Component/Article/ArticleModify";
import ArticlePage from "./lettrip-web/Component/Article/ArticlePage";

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/SignUp' element={<SignUp />} />

          <Route path='/Travel/Search' element={<TravelSearch />} />
          <Route path='/Travel/course/:travel-id' element={<CoursePage />} />
          <Route path='/Travel/Course/Create' element={<CourseCreate />} />
          <Route path='/Travel/Course/Modify' element={<CourseModify />} />
          <Route path='/Travel/Review/Create' element={<ReviewCreate />} />
          <Route path='/Travel/Review/Modify' element={<ReviewModify />} />

          <Route path='/Article' element={<ArticleList />} />
          <Route path='/Article/create' element={<ArticleCreate />} />
          <Route
            path='/Article/modify/:article-id'
            element={<ArticleModify />}
          />
          <Route path='/Article/:article-id' element={<ArticlePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
