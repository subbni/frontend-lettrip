import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { modifyArticle, showArticle } from "../../Service/ArticleService";
import styles from "./ArticleCreate.module.css";

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
  const handleCancelButtonClick = () => {
    if (window.confirm("게시글 수정을 취소하시겠습니까?")) {
      navigate(`/articles/${id}`);
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
            required
            value={articleForm.title}
            onChange={handleArticleFormChange}
          />
        </div>
        <div className={styles.content}>
          <textarea
            id='content'
            name='content'
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
            수정
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArticleModify;
