import React, { useState, useEffect } from "react";
import "./ReplyComments.css";
import {
  ReplyCommentData,
  CreateReplyComment,
  DeleteReplyComment,
} from "../../../Service/AuthService";
import { useParams } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";

function ReplyComments() {
  const { id, parent_comment_id, mentioned_user_email } = useParams;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [replycomments, setReplyComments] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,ASC",
    article_id: id,
    parent_comment_id: parent_comment_id,
  }); //대댓글 5개씩, 오래된 순
  const [replycommentForm, setReplyCommentForm] = useState({
    article_id: id,
    content: "",
    parent_comment_id: parent_comment_id,
    mentioned_user_email: mentioned_user_email,
  }); //대댓글 작성시 요청 정보

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    if (storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetchReplyComments();
  }, []);

  //대댓글 불러오기
  const fetchReplyComments = () => {
    ReplyCommentData(pageForm)
      .then((response) => {
        setReplyComments(response.content);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  //대댓글 작성하기
  const handleReplyCommentFormChange = (e) => {
    const changedField = e.target.name;
    setReplyCommentForm({
      ...replycommentForm,
      [changedField]: e.target.value,
    });
  };

  const handleReplyCommentFormSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.alert("로그인이 필요합니다.");
      return;
    }
    if (window.confirm("댓글을 작성하시겠습니까?")) {
      CreateReplyComment(replycommentForm)
        .then((response) => {
          window.alert("댓글 작성이 완료되었습니다.");
          fetchReplyComments();
          console.log(response);
          setReplyCommentForm({ ...replycommentForm, content: "" });
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 작성에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  //대댓글 삭제하기
  const handleDeleteReplyComment = (id) => {
    DeleteReplyComment(id)
      .then((response) => {
        window.alert("대댓글이 삭제되었습니다.");
        fetchReplyComments();
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("대댓글 삭제에 실패했습니다.");
      });
  };

  return (
    <div className='ReplyComment_container'>
      <form
        className='CreateReplyComment'
        onSubmit={handleReplyCommentFormSubmit}
      >
        <textarea
          name='content'
          placeholder='댓글을 입력하세요.'
          required
          value={replycommentForm.content}
          onChange={handleReplyCommentFormChange}
        />
        <button type='submit'>등록</button>
      </form>
      <div className='ShowReplyComment'>
        {replycomments &&
          replycomments.length > 0 &&
          replycomments.map((comment) => (
            <div key={comment.id}>
              <h3 className='nickname'>{comment.nickname}</h3>
              <p className='content'>{comment.content}</p>
              <p className='createdDate'>{comment.createdDate}</p>
              {isLoggedIn && (
                <button
                  className='DeleteReplyComment_button'
                  onClick={() => handleDeleteReplyComment(comment.id)}
                >
                  삭제
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default ReplyComments;
