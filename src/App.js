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

import TravelPlanTemplate from "./lettrip-web/Component/Travel/TravelPlan/TravelPlanTemplate";
import TravelReviewTemplate from "./lettrip-web/Component/Travel/TravelReview/TravelReviewTemplate";
import MissionPage from "./lettrip-web/Component/Mission/MissionPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />

          <Route path="/travel/search" element={<TravelSearch />} />
          <Route path="/travel/course/:travel-id" element={<CoursePage />} />
          <Route
            path="/travel/course/create"
            element={<TravelPlanTemplate />}
          />
          <Route path="/travel/course/modify" element={<CourseModify />} />
          <Route
            path="/travel/review/create"
            element={<TravelReviewTemplate />}
          />
          <Route path="/travel/review/modify" element={<ReviewModify />} />

          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/create" element={<ArticleCreate />} />
          <Route
            path="/articles/modify/:article-id"
            element={<ArticleModify />}
          />
          <Route path="/articles/:id" element={<ArticlePage />} />
          <Route path="travel/plan" element={<CoursePlanTemplate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
