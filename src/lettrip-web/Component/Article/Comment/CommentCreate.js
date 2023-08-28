import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { commentData, createComment } from "../../../Service/ArticleService";

import styles from "./Comments.module.css";

import Comments from "./Comments";

function CommentCreate() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({
    article_id: id,
    content: "",
  }); // 댓글 작성시 요청 정보

  useEffect(() => {
    fetchComments(); // 댓글 로딩
  }, []);

  // 댓글 불러오기
  const fetchComments = () => {
    const pageForm = {
      page: 0,
      size: 5,
      sort: "id,ASC",
      article_id: id,
    };
    commentData(pageForm)
      .then((response) => {
        setComments(response.content);
      })
      .catch((e) => {
        console.log(e);
        alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  // 댓글 작성하기
  const CreateCommentFormChange = (e) => {
    const changedField = e.target.name;
    let newValue = e.target.value;
    setCommentForm({
      ...commentForm,
      [changedField]: newValue,
    });
  };

  const CreateCommentFormSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("댓글을 작성하시겠습니까?")) {
      // 댓글 작성 시 로컬 스토리지에 이메일 저장
      createComment(commentForm)
        .then((response) => {
          window.alert("댓글 작성이 완료되었습니다.");
          console.log(response);
          setCommentForm({ ...commentForm, content: "" });
          fetchComments();
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 작성에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  return (
    <div className={styles.container}>
      <Comments />
      <div className={styles.comment_create}>
        <form className={styles.create_box} onSubmit={CreateCommentFormSubmit}>
          <div className={styles.comment}>
            <textarea
              id='content'
              name='content'
              placeholder='댓글을 입력하세요.'
              required
              value={commentForm.content}
              onChange={CreateCommentFormChange}
            />
            <button type='submit'>등록</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommentCreate;
