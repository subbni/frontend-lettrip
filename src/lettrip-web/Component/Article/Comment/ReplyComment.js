import React, { useState, useEffect } from "react";
import "./ReplyComment.css";
import {
  Checklogin,
  CreateReplyComment,
  DeleteReplyComment,
} from "../../../Service/AuthService";

function ReplyComment({ commentId, handleNewComment, parentCommentAuthor }) {
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchChecklogin();
  }, []);

  const fetchChecklogin = () => {
    Checklogin()
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((e) => {
        setIsLoggedIn(false);
      });
  };

  const handleReplyCommentSubmit = (e) => {
    e.preventDefault();

    if (content.trim() === "") {
      alert("대댓글을 입력해주세요.");
      return;
    }

    if (window.confirm("대댓글을 작성하시겠습니까?")) {
      CreateReplyComment(commentId, { content })
        .then((response) => {
          window.alert("대댓글 작성이 완료되었습니다.");
          handleNewComment(response.data.reply);
          setContent("");
        })
        .catch((e) => {
          console.error(e);
          window.alert(
            "대댓글 작성에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
        });
    }
  };

  const handleReplyCommentDelete = () => {
    if (window.confirm("대댓글을 삭제하시겠습니까?")) {
      DeleteReplyComment(commentId)
        .then(() => {
          window.alert("대댓글이 삭제되었습니다.");
          handleNewComment({ id: commentId, isDeleted: true });
        })
        .catch((e) => {
          console.error(e);
          window.alert("대댓글 삭제에 실패했습니다.");
        });
    }
  };

  return (
    <form className='reply-comment-form' onSubmit={handleReplyCommentSubmit}>
      <div className='reply-comment-textarea-wrapper'>
        <label className='reply-comment-author-label'>
          @ {parentCommentAuthor}
        </label>
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
        <button
          className='reply-comment-delete-button'
          onClick={handleReplyCommentDelete}
        >
          삭제
        </button>
      )}
    </form>
  );
}

export default ReplyComment;
