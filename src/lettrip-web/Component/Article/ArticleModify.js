import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ArticleModify.css";
import { ACCESS_TOKEN } from "../../Constant/backendAPI";
import {
  ModifyArticle,
  ArticleData,
  ListArticle,
} from "../../Service/AuthService";

function ArticleModify({ articleId }) {
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
    fetchArticles();
  }, []);

  useEffect(() => {
    if (articleId) {
      fetchArticleData(articleId);
    }
  }, [articleId]);

  if (!isLoggedIn) {
    window.alert("로그인이 필요합니다.");
  }

  const fetchArticleData = () => {
    ArticleData(articleId)
      .then((response) => {
        setArticleForm(response.content);
        console.log(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("게시글 정보를 가져오는 중에 오류가 발생했습니다:");
      });
  };

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
      ModifyArticle(articleForm, authToken)
        .then((response) => {
          window.alert("게시글 수정이 완료되었습니다.");
          navigate("/articles");
          fetchArticles();
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
          window.alert(
            "게시글 수정에 실패했습니다. 다시 시도해주시길 바랍니다."
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
    <div className='ArticleModifyContainer'>
      <h1>게시글 수정</h1>
      <form onSubmit={handleArticleFormSubmit}>
        <div className='Article_title'>
          <label htmlFor='title'>제목</label>
          <input
            type='text'
            id='title'
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
            value={articleForm.file}
            onChange={handleArticleFormChange}
          />
        </div>
        <div className='Article_content'>
          <label htmlFor='content'>내용</label>
          <textarea
            id='content'
            required
            value={articleForm.content}
            onChange={handleArticleFormChange}
          />
        </div>
        <button type='submit'>수정</button>
      </form>
    </div>
  );
}

export default ArticleModify;
