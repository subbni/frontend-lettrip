import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  replyCommentData,
  modifyComment,
  deleteComment,
} from "../../../Service/ArticleService";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";
import "./Comments.css";
import ReplyCommentCreate from "./ReplyCommentCreate";

function Comments() {
  const navigate = useNavigate();
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

  //대댓글 작성하기
  const handleCreateReplyComment = () => {
    <ReplyCommentCreate />;
  };

  //댓글 수정하기
  const handleModifyComment = (commentId) => {
    const comment = comments.find((comment) => comment.id === commentId);
    if (comment) {
      navigate(`/modify/${comment.id}`);
    }
  };

  //댓글 삭제하기
  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment(commentId)
        .then((response) => {
          window.alert("댓글이 삭제되었습니다.");
          console.log(response);
          fetchComments();
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 삭제에 실패했습니다.");
        });
    }
  };

  return (
    <div className='Comment_container'>
      <div className='ShowComments'>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id}>
              <h3 className='nickname'>{comment.nickname}</h3>
              <p className='createdDate'>{comment.createdDate}</p>
              <p className='content'>{comment.content}</p>
              <button
                className='CreatereplyComment_button'
                onClick={() => handleCreateReplyComment(comment.id)}
              >
                답글 달기
              </button>
              {isLoggedIn && ( //댓글 작성자에게만 수정 버튼 보이게 하기
                <button
                  className='ModifyComment_button'
                  onClick={() => handleModifyComment(comment.id)}
                >
                  수정
                </button>
              )}
              {isLoggedIn && ( //댓글 작성자에게만 삭제 버튼 보이게 하기
                <button
                  className='DeleteComment_button'
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  삭제
                </button>
              )}

              <div className='ShowReplyComments'>
                <button
                  className='ShowReplycomment_button'
                  onClick={() => handleShowReplycomment(comment.id)}
                >
                  {comment.handleShowReplycomment ? "답글 닫기" : "답글 보기"}
                </button>
                {comment.handleShowReplycomment &&
                  comment.reply &&
                  comment.reply.length > 0 && (
                    <div className='ReplyComments'>
                      {comment.reply.map((reply) => (
                        <div key={reply.id}>
                          <h4 className='nickname'>{reply.nickname}</h4>
                          <p className='content'>{reply.content}</p>
                          <p className='createdDate'>{reply.createdDate}</p>
                          {isLoggedIn && ( //대댓글 작성자에게만 수정 버튼 보이게 하기
                            <button
                              className='ModifyReplyComment_button'
                              onClick={() => handleModifyComment(reply.id)}
                            >
                              수정
                            </button>
                          )}
                          {isLoggedIn && ( //대댓글 작성자에게만 삭제 버튼 보이게 하기
                            <button
                              className='DeleteReplyComment_button'
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
