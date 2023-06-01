import React, { useState, useEffect } from "react";
import "./CommentModify.css";
import { useNavigate } from "react-router-dom";
import { CommentData, ModifyComment } from "../../../Service/AuthService";

function CommentModify({ commentId, postId }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const [commentForm, setCommentForm] = useState({
    content: "",
  });

  useEffect(() => {
    if (commentId) {
      fetchCommentData(commentId);
    }
  }, [commentId]);

  const fetchCommentData = (comentId) => {
    CommentData(commentId)
      .then((response) => {
        setCommentForm(response.data);
      })
      .catch((e) => {
        console.error("댓글 정보를 가져오는 중에 오류가 발생했습니다:");
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
      window.alert("댓글을 입력해주세요.");
      return;
    }
    if (window.confirm("댓글을 수정하시겠습니까?")) {
      ModifyComment(commentId, commentForm)
        .then((response) => {
          window.alert("댓글 수정이 완료되었습니다.");
          window.location.reload();
          navigate("/Article/${postID}");
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 수정에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  return (
    <div className='CreateComment'>
      <h4>댓글</h4>
      <form className='Comment_form' onSubmit={handleCommentFormSubmit}>
        <textarea
          name='content'
          placeholder='댓글을 입력하세요.'
          value={commentForm.content}
          onChange={handleCommentFormChange}
        />
        <button type='submit'>등록</button>
      </form>
    </div>
  );
}

export default CommentModify;
