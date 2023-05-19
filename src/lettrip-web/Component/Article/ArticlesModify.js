import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ArticlesModify.css";
import { Checklogin, ModifyArticle } from "../../Service/APIService";

function ArticlesModify() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const [articleForm, setArticleForm] = useState({
    title: "",
    content: "",
    file: null,
  });
  const { postId } = useParams(); // URL 파라미터로 받아온 게시글 ID 값

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await ModifyArticle(postId);
        const { title, content } = response.data;
        setArticleForm({
          ...articleForm,
          title,
          content,
        });
      } catch (error) {
        console.error("오류 발생 :", error);
      }
    };
    fetchArticleData();
  }, [postId]);

  useEffect(() => {
    fetchChecklogin();
  }, []);

  const fetchChecklogin = () => {
    Checklogin()
      .then((response) => {
        setIsLoggedIn(true);
      })
      .catch((e) => {
        setIsLoggedIn(false);
      });
  };
  if (!isLoggedIn) {
    window.alert("로그인이 필요합니다.");
  }

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

  const handleArticleFormSubmit = (e) => {
    e.preventDefault();
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      alert("제목과 본문을 입력해주세요.");
      return;
    }
    if (window.confirm("제출하시겠습니까?")) {
      ModifyArticle(articleForm)
        .then((response) => {
          window.alert("게시글 수정이 완료되었습니다.");
          window.location.reload();
          navigate("/Articles");
        })
        .catch((e) => {
          console.log(e);
          window.alert(
            "게시글 수정에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
        });
    }
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

export default ArticlesModify;
