import React, { useState, useEffect } from "react";
import "./CommentModify.css";
import { useNavigate, useParams } from "react-router-dom";
import { CommentData, ModifyComment } from "../../../Service/AuthService";
import { ACCESS_TOKEN } from "../../Constant/backendAPI";

function CommentModify({ commentId, postId }) {
  const navigate = useNavigate();
  const { id, parent_comment_id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const [comments, setComments] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,ASC",
    article_id: id,
    parent_id: parent_comment_id,
  }); //댓글 보여주기 : 5개씩, 오래된 순
  const [commentForm, setCommentForm] = useState({
    content: "",
  }); //댓글 수정시 요청 정보, id는 수정할 댓글의 id

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    const storedEmail = localStorage.getItem("email");
    console.log(parent_comment_id);
    if (storedToken && storedEmail) {
      setIsLoggedIn(true);
      setCommentForm((prevState) => ({
        ...prevState,
        commentId: parent_comment_id,
        email: storedEmail,
      }));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  //댓글 불러오기
  const fetchComments = () => {
    CommentData(parent_comment_id)
      .then((response) => {
        const { content } = response;
        setCommentForm({
          content,
        });
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  const handleCommentFormChange = (e) => {
    const { name, value } = e.target;
    setCommentForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("댓글을 수정하시겠습니까?")) {
      const modifyForm = {
        commentId: parent_comment_id,
        content: commentForm.content,
      };
      ModifyComment(modifyForm)
        .then((response) => {
          window.alert("댓글 수정이 완료되었습니다.");
          window.location.reload();
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 수정에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  return (
    <div className='CommentModifyContainer'>
      <h4>댓글</h4>
      <form onSubmit={handleCommentFormSubmit}>
        <textarea
          id='content'
          name='content'
          required
          value={commentForm.content}
          onChange={handleCommentFormChange}
        />
        <button type='submit'>등록</button>
      </form>
    </div>
  );
}

export default CommentModify;
