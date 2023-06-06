import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../Constant/backendAPI";
import { createArticle, listArticle } from "../../Service/ArticleService";

import "./ArticleCreate.css";

function ArticleCreate() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [articleForm, setArticleForm] = useState({
    email: "",
    title: "",
    content: "",
  });
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });

  useEffect(() => {
    //로그인 여부 확인하기
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    const storedEmail = localStorage.getItem("email");
    if (storedToken) {
      setIsLoggedIn(true);
      setArticleForm((prevForm) => ({
        ...prevForm,
        email: storedEmail,
      }));
      console.log(storedEmail);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleArticleFormChange = (e) => {
    const changedField = e.target.name;
    let newValue = e.target.value;
    setArticleForm({
      ...articleForm,
      [changedField]: newValue,
    });
  };

  const handleArticleFormSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("게시글을 작성하시겠습니까?")) {
      createArticle(articleForm)
        .then((response) => {
          window.alert("게시글 작성이 완료되었습니다.");
          navigate("/articles");
          fetchArticles();
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
          window.alert(
            "게시글 작성에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
        });
    }
  };

  const fetchArticles = () => {
    listArticle(pageForm)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("게시글 목록을 불러오는데 실패했습니다.");
      });
  };

  return (
    <div className='article-create-container'>
      <h1>게시글 작성</h1>
      <form onSubmit={handleArticleFormSubmit}>
        <div className='article-title'>
          <label htmlFor='title'>제목</label>
          <input
            type='text'
            id='title'
            name='title'
            required
            value={articleForm.title}
            onChange={handleArticleFormChange}
          />
        </div>
        <div className='article-content'>
          <label htmlFor='content'>내용</label>
          <textarea
            id='content'
            name='content'
            required
            value={articleForm.content}
            onChange={handleArticleFormChange}
          />
        </div>
        <button className='article-button' type='submit'>
          등록
        </button>
      </form>
    </div>
  );
}

export default ArticleCreate;
