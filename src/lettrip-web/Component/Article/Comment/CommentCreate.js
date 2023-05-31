import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CommentCreate.css";
import { CreateComment, CommentData } from "../../../Service/AuthService";

function CommentCreate() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "createdDate,ASC",
    article_id: id,
  }); //page 정보

  const [commentForm, setCommentForm] = useState({
    article_id: id,
    content: "",
  }); //작성시 요청 정보

  const handleCommentFormChange = (e) => {
    const changedField = e.target.name;
    setCommentForm({
      ...commentForm,
      [changedField]: e.target.value,
    });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = () => {
    const updatedPageForm = { ...pageForm, article_id: id };
    CommentData(updatedPageForm)
      .then((response) => {
        setComments(response.content);
        console.log(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.alert("로그인이 필요합니다.");
      return;
    }
    if (!commentForm.content.trim()) {
      window.alert("댓글을 입력해주세요.");
      return;
    }
    if (window.confirm("댓글을 작성하시겠습니까?")) {
      CreateComment(commentForm)
        .then((response) => {
          setComments(response.content);
          window.alert("댓글 작성이 완료되었습니다.");
          window.location.reload();
          console.log(response);
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
