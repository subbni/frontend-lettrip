import React, { useState, useEffect } from "react";
import "./CommentCreate.css";
import { useNavigate } from "react-router-dom";
import { Checklogin, CreateComment } from "../../../Service/AuthService";

function CommentCreate({ postId }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const [commentForm, setCommentForm] = useState({
    content: "",
  });

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

  const handleCommentFormChange = (e) => {
    const changedField = e.target.name;
    setCommentForm({
      ...commentForm,
      [changedField]: e.target.value,
    });
  };

  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.alert("로그인이 필요합니다.");
    }
    if (!commentForm.content.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }
    if (window.confirm("댓글을 작성하시겠습니까?")) {
      CreateComment(commentForm)
        .then((response) => {
          window.alert("댓글 작성이 완료되었습니다.");
          window.location.reload();
          navigate("/Article/{postID}");
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 작성에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  return (
    <div className='CreateComment'>
      <h3>댓글</h3>
      <form className='Comment_form' onSubmit={handleCommentFormSubmit}>
        <textarea
          name='content'
          placeholder='댓글을 입력하세요.'
          required
          value={commentForm.content}
          onChange={handleCommentFormChange}
        />
        <button type='submit'>등록</button>
      </form>
    </div>
  );
}

export default CommentCreate;
