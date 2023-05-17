import React, { useState } from "react";
import axios from "axios";
import "./ReplyComment.css";

const instance = axios.create({
  baseURL: "http://192.168.25.19/api",
});

function ReplyComment({ commentId, handleNewComment }) {
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function checkLogin() {
    try {
      const response = await instance.get("/checkLogin");
      if (response.status === 200) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.trim() === "") {
      alert("대댓글을 입력해주세요.");
      return;
    }

    try {
      const response = await instance.post(`/comments/${commentId}/replies`, {
        content,
      });
      handleNewComment(response.data.reply); // 부모 컴포넌트에서 댓글 목록을 업데이트할 수 있도록 새 댓글 정보를 전달
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmResult = window.confirm("대댓글을 삭제하시겠습니까?");
    if (confirmResult) {
      try {
        const response = await instance.delete(`/replies/${commentId}`);
        if (response.status === 200) {
          alert("대댓글이 삭제되었습니다.");
          handleNewComment({ id: commentId, isDeleted: true });
        }
      } catch (error) {
        alert("대댓글 삭제에 실패했습니다.");
      }
    }
  };

  checkLogin();

  return (
    <form className='reply-comment-form' onSubmit={handleSubmit}>
      <div className='reply-comment-textarea-wrapper'>
        <textarea
          className='reply-comment-textarea'
          name='content'
          placeholder='대댓글을 입력하세요.'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button type='submit' className='reply-comment-submit-button'>
        등록
      </button>
      {isLoggedIn && (
        <button className='reply-comment-delete-button' onClick={handleDelete}>
          삭제
        </button>
      )}
    </form>
  );
}

export default ReplyComment;
