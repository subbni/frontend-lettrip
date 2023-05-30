import React, { useState, useEffect } from "react";
import "./ArticleCreate.css";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../Constant/backendAPI";
import {
  Checklogin,
  CreateArticle,
  ListArticle,
} from "../../Service/AuthService";

function ArticleCreate() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const [articleForm, setArticleForm] = useState({
    email: "",
    title: "",
    content: "",
    file: "",
  });
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });

  useEffect(() => {
    fetchChecklogin();
    fetchArticles();
  }, []);

  const handleArticleFormChange = (e) => {
    const changedField = e.target.name;
    let newValue = e.target.value;
    if (changedField === "file") {
      newValue = e.target.files[0];
    }
    setArticleForm({
      ...articleForm,
      [changedField]: newValue,
    });
  };

  const fetchChecklogin = () => {
    Checklogin()
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((e) => {
        console.log(e);
        setIsLoggedIn(false);
      });
  };

  const getAuthToken = () => {
    return localStorage.getItem(ACCESS_TOKEN);
  };

  const handleArticleFormSubmit = (e) => {
    e.preventDefault();
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      alert("제목과 본문을 입력해주세요.");
      return;
    }
    if (window.confirm("제출하시겠습니까?")) {
      const authToken = getAuthToken();
      if (!authToken) {
        alert("로그인이 필요합니다.");
        return;
      }
      CreateArticle(articleForm, authToken)
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
    ListArticle(pageForm)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("게시글 목록을 불러오는데 실패했습니다.");
      });
  };

  return (
    <div className='ArticleCreateContainer'>
      <h1>게시글 작성</h1>
      <form onSubmit={handleArticleFormSubmit}>
        <div className='Article_title'>
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
        <div className='Article_file'>
          <label htmlFor='file'>사진 첨부</label>
          <input
            type='file'
            id='file'
            name='file'
            value={articleForm.file}
            onChange={handleArticleFormChange}
          />
        </div>
        <div className='Article_content'>
          <label htmlFor='content'>내용</label>
          <textarea
            id='content'
            name='content'
            required
            value={articleForm.content}
            onChange={handleArticleFormChange}
          />
        </div>
        <button type='submit'>등록</button>
      </form>
    </div>
  );
}

export default ArticleCreate;
