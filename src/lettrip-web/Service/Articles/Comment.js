import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Comment.css";

const instance = axios.create({
  baseURL: "http://192.168.25.19/api",
});

function Comment({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태

  // 로그인 여부를 확인하는 함수
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
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      const response = await instance.post(`/posts/${postId}/comments`, {
        content,
      });
      setComments([...comments, response.data.comment]);
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (commentId) => {
    const confirmResult = window.confirm("댓글을 삭제하시겠습니까?");
    if (confirmResult) {
      try {
        const response = await instance.delete(`/comments/${commentId}`);
        if (response.status === 200) {
          alert("댓글이 삭제되었습니다.");
          setComments(comments.filter((comment) => comment.id !== commentId)); // 삭제된 댓글을 제외한 댓글 목록을 다시 설정
        }
      } catch (error) {
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await instance.get(`/posts/${postId}/comments`);
        setComments(response.data.comments);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
    checkLogin();
  }, [postId]);

  return (
    <div className='comments'>
      <h3>댓글</h3>
      <ul className='comment-list'>
        {comments.map((comment) => (
          <li key={comment.id} className='comment-item'>
            <p className='comment-nickname'>{comment.author}</p>
            <p className='comment-content'>{comment.content}</p>
            {isLoggedIn &&
              comment.author === localStorage.getItem("username") && (
                <button onClick={() => handleDelete(comment.id)}>삭제</button>
              )}
          </li>
        ))}
      </ul>
      <form className='comment-form' onSubmit={handleSubmit}>
        <textarea
          name='content'
          placeholder='댓글을 입력하세요.'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type='submit'>등록</button>
      </form>
    </div>
  );
}

export default Comment;
