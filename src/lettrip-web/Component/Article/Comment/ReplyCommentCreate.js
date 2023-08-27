import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  replyCommentData,
  createComment,
} from "../../../Service/ArticleService";

import styles from "./Comments.module.css";

function ReplyCommentCreate({
  parent_comment_id,
  mentioned_user_email,
  nickname,
}) {
  console.log(nickname); // 값이 올바르게 전달되는지 확인
  console.log(mentioned_user_email);

  const { id } = useParams();
  const [replyComments, setReplyComments] = useState([]);
  const [replyCommentForm, setReplyCommentForm] = useState({
    article_id: id,
    content: "",
    parent_comment_id: parent_comment_id,
    mentioned_user_email: -1,
  }); //대댓글 작성시 요청 정보

  useEffect(() => {
    if (parent_comment_id) {
      setReplyCommentForm((prevState) => ({
        ...prevState,
        parent_comment_id: parent_comment_id,
        mentioned_user_email: -1,
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
      })
      .catch((e) => {
        console.log(e);
        alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  // 대댓글 작성하기
  const handleReplyCommentFormChange = (e) => {
    const changedField = e.target.name;
    let newValue = e.target.value;

    // 멘션 처리 로직 추가
    if (changedField === "content" && newValue.includes("@")) {
      const mentionedUserEmail = newValue.match(/@(\S+)/);
      if (mentionedUserEmail) {
        setReplyCommentForm({
          ...replyCommentForm,
          content: newValue,
          mentioned_user_email: mentionedUserEmail[1], // 맨션된 이메일
        });
      }
    } else {
      setReplyCommentForm({
        ...replyCommentForm,
        [changedField]: newValue,
      });
    }
  };

  const handleReplyCommentFormSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("대댓글을 작성하시겠습니까?")) {
      createComment(replyCommentForm)
        .then((response) => {
          alert("대댓글 작성이 완료되었습니다.");
          setReplyCommentForm((prevState) => ({
            ...prevState,
            content: "",
          }));
          fetchReplyComments();
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
          alert("대댓글 작성 중에 오류가 발생했습니다.");
        });
    }
  };

  return (
    <div className={styles.replycomment_create}>
      <form
        className={styles.replycreate_box}
        onSubmit={handleReplyCommentFormSubmit}
      >
        <div className={styles.replycomment}>
          <textarea
            name='content'
            placeholder='대댓글을 입력하세요.'
            required
            value={replyCommentForm.content}
            onChange={handleReplyCommentFormChange}
          />
          <input
            type='text'
            name='mentioned_user_email'
            placeholder='언급자 이메일'
            value={replyCommentForm.mentioned_user_email}
            onChange={handleReplyCommentFormChange}
          />
          <button type='submit'>등록</button>
        </div>
      </form>
    </div>
  );
}

export default ReplyCommentCreate;
