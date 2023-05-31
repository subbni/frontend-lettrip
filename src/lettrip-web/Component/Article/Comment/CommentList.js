import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CommentList.css";
import { CommentData, ReplyCommentData } from "../../../Service/AuthService";

function CommentList() {
  const { id, comment_id } = useParams();

  const [comments, setComments] = useState([]);
  const [replycomments, setReplyComments] = useState([]);

  const [commentForm, setCommentForm] = useState({
    page: 0,
    size: 5,
    sort: "createdDate,ASC",
    article_id: id,
  }); //댓글 5개씩, 오래된 순

  const [replycommentForm, setReplyCommentForm] = useState({
    page: 0,
    size: 5,
    sort: "createdDate,ASC",
    article_id: id,
    parent_comment_id: comment_id,
  }); //대댓글 5개씩, 오래된 순

  useEffect(() => {
    fetchComments();
    fetchReplyComments();
  }, []);

  const fetchComments = () => {
    CommentData(commentForm)
      .then((response) => {
        setComments(response.content);
        console.log(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  const fetchReplyComments = () => {
    ReplyCommentData(replycommentForm)
      .then((response) => {
        setReplyComments(response.content);
        console.log(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  return (
    <div className='Comment_container'>
      <h2>댓글</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <h3 className='nickname'>{comment.nickname}</h3>
            <p className='content'>{comment.content}</p>
            <p className='createdDate'>{comment.createdDate}</p>
          </div>
        ))
      ) : (
        <p> 댓글이 없습니다. </p>
      )}
    </div>
  );
}

export default CommentList;
