import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../../Service/ArticleService";

import styles from "./ArticleCreate.module.css";

function ArticleCreate() {
  const navigate = useNavigate();
  const [articleForm, setArticleForm] = useState({
    email: "",
    title: "",
    content: "",
    articleType: "FREE_ARTICLE",
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setArticleForm((prevForm) => ({ ...prevForm, email: userEmail }));
    }
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
          alert("게시글 작성이 완료되었습니다.");
          navigate("/articles");
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
          alert("게시글 작성에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };
  const handleCancelButtonClick = () => {
    if (window.confirm("게시글 작성을 취소하시겠습니까?")) {
      navigate("/articles");
    }
  };

  return (
    <div className={styles.box}>
      <form className={styles.container} onSubmit={handleArticleFormSubmit}>
        <div className={styles.title}>
          <input
            type='text'
            id='title'
            name='title'
            placeholder='제목을 입력하세요.'
            required
            value={articleForm.title}
            onChange={handleArticleFormChange}
          />
        </div>
        <div className={styles.content}>
          <textarea
            id='content'
            name='content'
            placeholder='내용을 입력하세요.'
            required
            value={articleForm.content}
            onChange={handleArticleFormChange}
          />
        </div>
        <div className={styles.button}>
          <button
            className={styles.button_cancel}
            type='button'
            onClick={handleCancelButtonClick}
          >
            취소
          </button>
          <button className={styles.button_create} type='submit'>
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArticleCreate;
