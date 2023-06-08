import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { modifyArticle, showArticle } from "../../Service/ArticleService";

import "./ArticleCreate.css";

function ArticleModify() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [articleForm, setArticleForm] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = () => {
    showArticle(id) // 해당 id에 해당하는 article 하나만 결과로 넘어옴
      .then((response) => {
        const { title, content } = response;
        setArticleForm({
          title,
          content,
        });
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
        navigate("/articles");
      });
  };

  const handleArticleFormChange = (e) => {
    const { name, value } = e.target;
    setArticleForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleArticleFormSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("게시글을 수정하시겠습니까?")) {
      const modifyForm = {
        id: id,
        title: articleForm.title,
        content: articleForm.content,
      };
      modifyArticle(modifyForm)
        .then((response) => {
          alert("게시글 수정이 완료되었습니다.");
          navigate(`/articles/${id}`);
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
          alert("게시글 수정에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  return (
    <div className='article-modify-container'>
      <h1>게시글 수정</h1>
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
          수정
        </button>
      </form>
    </div>
  );
}

export default ArticleModify;
