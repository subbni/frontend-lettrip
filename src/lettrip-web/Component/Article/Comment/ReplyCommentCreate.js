import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  replyCommentData,
  createComment,
} from "../../../Service/ArticleService";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";

import "./Comments.css";

function ReplyCommentCreate({
  parent_comment_id,
  mentioned_user_email,
  mentioned_user_nickname,
}) {
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [replyComments, setReplyComments] = useState([]);
  const [replyCommentForm, setReplyCommentForm] = useState({
    article_id: id,
    content: "",
    parent_comment_id: parent_comment_id,
    mentioned_user_email: mentioned_user_email,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    const storedEmail = localStorage.getItem("email");
    if (storedToken && storedEmail) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (parent_comment_id) {
      setReplyCommentForm((prevState) => ({
        ...prevState,
        parent_comment_id: parent_comment_id,
        mentioned_user_email: mentioned_user_email,
      }));
      fetchReplyComments();
    }
  }, [parent_comment_id, mentioned_user_email]);

  const fetchReplyComments = () => {
    const pageForm = {
      page: 0,
      size: 5,
      sort: "id,ASC",
      article_id: replyCommentForm.article_id,
      parent_comment_id: replyCommentForm.parent_comment_id,
    };

    replyCommentData(pageForm)
      .then((response) => {
        setReplyComments(response.content);
        console.log(pageForm);
      })
      .catch((e) => {
        console.log(e);
        window.alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  const handleReplyCommentFormChange = (e) => {
    const changedField = e.target.name;
    setReplyCommentForm({
      ...replyCommentForm,
      [changedField]: e.target.value,
    });
  };

  const handleReplyCommentFormSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.alert("로그인이 필요합니다.");
      return;
    }
    if (window.confirm("대댓글을 작성하시겠습니까?")) {
      const createReplyCommentData = {
        article_id: id,
        content: replyCommentForm.content,
        parent_comment_id: replyCommentForm.parent_comment_id,
        mentioned_user_email: replyCommentForm.mentioned_user_email,
      };
      if (
        replyCommentForm.mentioned_user_email &&
        typeof replyCommentForm.mentioned_user_email === "string"
      ) {
        const mentionedNickname = `@${mentioned_user_nickname}`;
        createReplyCommentData.content = `${mentionedNickname} ${createReplyCommentData.content}`;
      }
      createComment(createReplyCommentData)
        .then((response) => {
          window.alert("대댓글 작성이 완료되었습니다.");
          setReplyCommentForm((prevState) => ({
            ...prevState,
            content: "",
          }));
          fetchReplyComments();
          console.log(response);
          console.log(mentioned_user_nickname);
        })
        .catch((e) => {
          console.log(e);
          window.alert("대댓글 작성 중에 오류가 발생했습니다.");
        });
    }
  };

  return (
    <div className='replycomment-create'>
      <form onSubmit={handleReplyCommentFormSubmit}>
        <div className='replycomment-input'>
          <textarea
            name='content'
            placeholder={`대댓글을 입력하세요. (@${mentioned_user_nickname} 언급)`}
            value={replyCommentForm.content}
            onChange={handleReplyCommentFormChange}
            required
          />
          <button type='submit'>등록</button>
        </div>
      </form>
    </div>
  );
}

export default ReplyCommentCreate;
