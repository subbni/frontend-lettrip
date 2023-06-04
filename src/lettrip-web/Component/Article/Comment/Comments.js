import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
<<<<<<< HEAD
  CommentData,
  ReplyCommentData,
  CreateComment,
  DeleteComment,
=======
  commentData,
  replyCommentData,
  createComment,
  deleteComment,
>>>>>>> aaeb639ed422d8021c184c194a065ab6dfcfe9d6
} from "../../../Service/ArticleService";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";
import "./Comments.css";

function Comments() {
  const { id, parent_comment_id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const [comments, setComments] = useState([]);
  const [replycomments, setReplyComments] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,ASC",
    article_id: id,
    parent_id: parent_comment_id,
  }); //댓글 보여주기 : 5개씩, 오래된 순

  const [commentForm, setCommentForm] = useState({
    article_id: id,
    content: "",
  }); //댓글 작성시 요청 정보

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
    fetchComments();
<<<<<<< HEAD
  }, []);

  useEffect(() => {
=======

>>>>>>> aaeb639ed422d8021c184c194a065ab6dfcfe9d6
    if (parent_comment_id) {
      fetchReplyComments();
    }
  }, [parent_comment_id]);

  //댓글 불러오기
  const fetchComments = () => {
    commentData(pageForm)
      .then((response) => {
        setComments(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  //대댓글 불러오기
  const fetchReplyComments = (parent_id) => {
    const replyPageForm = {
      ...pageForm,
      parent_id: parent_id,
    };
    console.log(replyPageForm);
    replyCommentData(replyPageForm)
      .then((response) => {
        const updatedComments = comments.map((comment) => {
          if (comment.id === parent_id) {
            return {
              ...comment,
              reply: response.content,
              handleShowReplycomment: true,
            };
          }
          return comment;
        });
        setComments(updatedComments);
        setReplyComments(response.content);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  const handleShowReplycomment = (parent_id) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === parent_id) {
        return {
          ...comment,
          handleShowReplycomment: !comment.handleShowReplycomment,
        };
      }
      return comment;
    });
    setComments(updatedComments);
    if (
      updatedComments.find((comment) => comment.id === parent_id)
        .handleShowReplycomment
    ) {
      fetchReplyComments(parent_id);
    }
  };

  //댓글 작성하기
  const handleCommentFormChange = (e) => {
    const changedField = e.target.name;
    let newValue = e.target.value;
    setCommentForm({
      ...commentForm,
      [changedField]: newValue,
    });
  };

  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.alert("로그인이 필요합니다.");
      return;
    }
    if (window.confirm("댓글을 작성하시겠습니까?")) {
<<<<<<< HEAD
      CreateComment(commentForm)
=======
      createComment(commentForm)
>>>>>>> aaeb639ed422d8021c184c194a065ab6dfcfe9d6
        .then((response) => {
          window.alert("댓글 작성이 완료되었습니다.");
          fetchComments();
          console.log(response);
          console.log(commentForm);
          setCommentForm({ ...commentForm, content: "" });
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 작성에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };
  //댓글 삭제하기
<<<<<<< HEAD
  const handleDeleteComment = (id) => {
    DeleteComment(id)
      .then((response) => {
        window.alert("댓글이 삭제되었습니다.");
        fetchComments();
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("댓글 삭제에 실패했습니다.");
      });
  };
=======
  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment(commentId)
        .then((response) => {
          window.alert("댓글이 삭제되었습니다.");
          console.log(response);
          console.log(commentId);
          fetchComments();
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 삭제에 실패했습니다.");
        });
    }
  };

  //댓글 삭제하기
  const handleDeleteReplyComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment(commentId)
        .then((response) => {
          window.alert("댓글이 삭제되었습니다.");
          console.log(response);
          console.log(commentId);
          fetchComments();
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 삭제에 실패했습니다.");
        });
    }
  };

>>>>>>> aaeb639ed422d8021c184c194a065ab6dfcfe9d6
  return (
    <div className='Comment_container'>
      <h2>댓글</h2>
      <form className='CreateComment' onSubmit={handleCommentFormSubmit}>
        <textarea
<<<<<<< HEAD
=======
          id='content'
>>>>>>> aaeb639ed422d8021c184c194a065ab6dfcfe9d6
          name='content'
          placeholder='댓글을 입력하세요.'
          required
          value={commentForm.content}
          onChange={handleCommentFormChange}
        />
        <button type='submit'>등록</button>
      </form>
      <div className='ShowComment'>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
<<<<<<< HEAD
            <div className="commenteach" key={comment.id}>
              <h3 className='nickname'>{comment.nickname}</h3>
              <p className='createdDate'>{comment.createdDate}</p>
              <p className='content'>{comment.content}</p>
              {isLoggedIn && (
=======
            <div key={comment.id}>
              <h3 className='nickname'>{comment.nickname}</h3>
              <p className='content'>{comment.content}</p>
              <p className='createdDate'>{comment.createdDate}</p>

              {isLoggedIn && ( //댓글 작성자에게만 삭제 버튼 보이게 하기
>>>>>>> aaeb639ed422d8021c184c194a065ab6dfcfe9d6
                <button
                  className='DeleteComment_button'
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  삭제
                </button>
              )}
<<<<<<< HEAD
=======

>>>>>>> aaeb639ed422d8021c184c194a065ab6dfcfe9d6
              <button
                className='ShowReplycomment_button'
                onClick={() => handleShowReplycomment(comment.id)}
              >
                {comment.handleShowReplycomment ? "답글 감추기" : "답글 보기"}
              </button>
              {comment.handleShowReplycomment &&
                comment.reply &&
                comment.reply.length > 0 && (
                  <div className='ReplyComments'>
                    {comment.reply.map((reply) => (
                      <div key={reply.id}>
                        <h4 className='nickname'>{reply.nickname}</h4>
<<<<<<< HEAD
                        <p className='createdDate'>{reply.createdDate}</p>
                        <p className='content'>{reply.content}</p>
=======
                        <p className='content'>{reply.content}</p>
                        <p className='createdDate'>{reply.createdDate}</p>
>>>>>>> aaeb639ed422d8021c184c194a065ab6dfcfe9d6
                        {isLoggedIn && (
                          <button
                            className='DeleteComment_button'
                            onClick={() => handleDeleteComment(reply.id)}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
export default Comments;
