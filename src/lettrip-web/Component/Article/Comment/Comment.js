import React, { useState, useEffect } from "react";
import "./Comment.css";
import { CommentData, ReplyCommentData } from "../../Service/APIService";
import ReplyComment from "./ReplyComment";

function Comment({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = () => {
    CommentData(postId)
      .then((response) => {
        setComments(response.data);
      })
      .catch((e) => {
        console.log(e);
        window.alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  const fetchReplyComments = (commentId) => {
    ReplyCommentData(commentId)
      .then((response) => {
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: response.data,
              };
            }
            return comment;
          })
        );
      })
      .catch((e) => {
        console.log(e);
        window.alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  const handleNewReplyComment = (commentId, newReplyComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReplyComment],
          };
        }
        return comment;
      })
    );
  };

  return (
    <div className='Comment'>
      <h3>댓글</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className='comment-item'>
            <p className='comment-content'>{comment.content}</p>
            <p className='comment-author'>작성자: {comment.author}</p>
            <div className='reply-comments'>
              {comment.replies.map((reply) => (
                <ReplyComment
                  key={reply.id}
                  commentId={reply.id}
                  parentCommentAuthor={comment.author}
                  handleNewComment={handleNewReplyComment}
                />
              ))}
            </div>
            <button
              onClick={() => fetchReplyComments(comment.id)}
              className='load-reply-comments'
            >
              대댓글 불러오기
            </button>
          </div>
        ))
      ) : (
        <p>댓글이 없습니다.</p>
      )}
    </div>
  );
}

export default Comment;
