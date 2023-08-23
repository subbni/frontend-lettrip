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
  mentioned_user_nickname,
}) {
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
      })
      .catch((e) => {
        console.log(e);
        alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  //대댓글 작성하기
  const handleReplyCommentFormChange = (e) => {
    const changedField = e.target.name;
    setReplyCommentForm({
      ...replyCommentForm,
      [changedField]: e.target.value,
    });
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
          console.log(response.email);
          console.log(mentioned_user_nickname);
          console.log(replyCommentForm);
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
          <button type='submit'>등록</button>
        </div>
      </form>
    </div>
  );
}

export default ReplyCommentCreate;
