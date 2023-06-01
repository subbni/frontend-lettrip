import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./lettrip-web/Top/Header";
import Navbar from "./lettrip-web/Top/Navbar";

//페이지 경로 설정
import Home from "./lettrip-web/Component/Home";
import Login from "./lettrip-web/Component/Auth/Login/Login";
import SignUp from "./lettrip-web/Component/Auth/SignUp/SignUp";

//여행코스 경로 설정
import CoursePage from "./lettrip-web/Component/Travel/TravelSearch/CoursePage";
import CourseCreate from "./lettrip-web/Component/Travel/CoursePlan/CourseCreate";
import CourseModify from "./lettrip-web/Component/Travel/CoursePlan/CourseModify";
import ReviewCreate from "./lettrip-web/Component/Travel/CourseReview/ReviewCreate";
import ReviewModify from "./lettrip-web/Component/Travel/CourseReview/ReviewModify";

//커뮤니티 경로 설정
import ArticleList from "./lettrip-web/Component/Article/ArticleList";
import ArticleCreate from "./lettrip-web/Component/Article/ArticleCreate";
import ArticleModify from "./lettrip-web/Component/Article/ArticleModify";
import ArticlePage from "./lettrip-web/Component/Article/ArticlePage";
import Comments from "./lettrip-web/Component/Article/Comment/Comments";

import TravelPlanTemplate from "./lettrip-web/Component/Travel/TravelPlan/TravelPlanTemplate";
import TravelReviewTemplate from "./lettrip-web/Component/Travel/TravelReview/TravelReviewTemplate";
import MissionPage from "./lettrip-web/Component/Mission/MissionPage";
import SearchForm from "./lettrip-web/Component/Travel/TravelSearch/SearchForm";
import TravelSearchPage from "./lettrip-web/Component/Travel/TravelSearch/TravelSearchPage";
import TravelDetailPage from "./lettrip-web/Component/Travel/TravelDetail/TravelDetailPage";

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

          <Route path='/travel/search' element={<TravelSearchPage />} />
          <Route path='/travel/course/:id' element={<TravelDetailPage />} />
          <Route
            path='/travel/course/create'
            element={<TravelPlanTemplate />}
          />
          <Route path='/travel/course/modify' element={<CourseModify />} />
          <Route
            path='/travel/review/create'
            element={<TravelReviewTemplate />}
          />
          <Route path='/travel/review/modify' element={<ReviewModify />} />

          <Route path='/articles' element={<ArticleList />} />
          <Route path='/articles/:id' element={<ArticlePage />} />
          <Route path='/articles/create' element={<ArticleCreate />} />
          <Route path='/articles/modify/:id' element={<ArticleModify />} />

          <Route path='/travel/plan' element={<TravelPlanTemplate />} />
          <Route path='/travel/review' element={<TravelReviewTemplate />} />
          <Route path='/mission' element={<MissionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
