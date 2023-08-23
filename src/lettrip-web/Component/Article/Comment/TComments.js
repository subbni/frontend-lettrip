import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  commentData,
  replyCommentData,
  createComment,
  modifyComment,
  deleteComment,
} from "../../../Service/ArticleService";
import { getMyProfile } from "../../../Service/MyPageService";

import CommentCreate from "./CommentCreate";

import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsArrowReturnRight } from "react-icons/bs";
import styles from "./Comments.module.css";
import ReplyCommentCreate from "./ReplyCommentCreate";

function TComments({ userEmail }) {
  const { id, parent_comment_id, mentioned_user_email } = useParams();
  const [post, setPost] = useState([]);
  const [profile, setProfile] = useState({});

  const [comments, setComments] = useState([]);
  const [replyComments, setReplyComments] = useState([]);

  const [editingComment, setEditingComment] = useState({});
  const [editingReplyComment, setEditingReplyComment] = useState({});

  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,ASC",
    article_id: id,
    parent_id: parent_comment_id,
  }); //댓글 보여주기 : 5개씩, 오래된 순
  const [commentForm, setCommentForm] = useState({
    content: "",
  }); //댓글 작성시 요청 정보, id는 댓글 id
  const [replyCommentForm, setReplyCommentForm] = useState({
    article_id: id,
    content: "",
    parent_comment_id: parent_comment_id,
    mentioned_user_email: -1,
  }); //대댓글 작성시 요청 정보

  useEffect(() => {
    fetchComments();
    if (parent_comment_id) {
      fetchReplyComments();
    }
  }, [parent_comment_id]);

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

  useEffect(() => {
    //프로필 사진 가져오기
    getMyProfile()
      .then((response) => {
        setProfile(response);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  // 댓글 작성자의 닉네임과 현재 로그인한 사용자의 닉네임 비교하여 동일한지 확인하는 함수
  const isEditable = (commentNickname) => {
    const storedNickname = localStorage.getItem("nickname");
    return commentNickname === storedNickname;
  };

  //댓글 불러오기
  const fetchComments = () => {
    commentData(pageForm)
      .then((response) => {
        const updatedComments = response.content.map((comment) => ({
          ...comment,
          options: false, // 설정 버튼 상태 초기값
        }));
        setComments(updatedComments);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("댓글을 불러오는 중에 오류가 발생했습니다.");
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
              moreReplyComment: true,
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
        alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  //'답글' 버튼을 눌렀을 때
  const moreReplyComment = (parent_id) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === parent_id) {
        return {
          ...comment,
          moreReplyComment: !comment.moreReplyComment,
        };
      }
      return comment;
    });
    setComments(updatedComments);
    if (
      updatedComments.find((comment) => comment.id === parent_id)
        .moreReplyComment
    ) {
      fetchReplyComments(parent_id);
    }
  };

  //대댓글 작성하기
  const CreateReplyCommentFormChange = (e) => {
    const changedField = e.target.name;
    setReplyCommentForm({
      ...replyCommentForm,
      [changedField]: e.target.value,
    });
  };

  const CreateReplyCommentFormSubmit = (e) => {
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
          console.log(replyCommentForm);
        })
        .catch((e) => {
          console.log(e);
          console.log(replyCommentForm);
          alert("대댓글 작성 중에 오류가 발생했습니다.");
        });
    }
  };

  //댓글 수정하기
  const ModifyCommentFormChange = (e) => {
    const { name, value } = e.target;
    setCommentForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const ModifyCommentFormSubmit = (e) => {
    e.preventDefault();
    if (editingComment.id) {
      if (window.confirm("댓글을 수정하시겠습니까?")) {
        const modifyForm = {
          id: editingComment.id,
          content: commentForm.content,
        };
        modifyComment(modifyForm)
          .then((response) => {
            alert("댓글 수정이 완료되었습니다.");
            console.log(response);
            fetchComments();
            setCommentForm({ content: "" });
            setEditingComment({});
          })
          .catch((e) => {
            console.log(e);
            alert("댓글 수정에 실패했습니다. 다시 시도해주시길 바랍니다.");
          });
      }
    }
  };

  const handleModifyComment = (commentId) => {
    const comment = comments.find((comment) => comment.id === commentId);
    if (comment) {
      setEditingComment(comment);
      setCommentForm({ content: comment.content });
    }
  };

  // 대댓글 수정하기
  const ModifyReplyCommentFormChange = (e) => {
    const { name, value } = e.target;
    setReplyCommentForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const ModifyReplyCommentFormSubmit = (e, replyId) => {
    e.preventDefault();
    if (window.confirm("대댓글을 수정하시겠습니까?")) {
      const modifyReplyForm = {
        id: replyId,
        content: replyCommentForm.content,
      };
      modifyComment(modifyReplyForm)
        .then((response) => {
          window.alert("대댓글 수정이 완료되었습니다.");
          fetchReplyComments(parent_comment_id);
          setReplyCommentForm((prevState) => ({
            ...prevState,
            content: "",
          }));
          setEditingReplyComment({});
        })
        .catch((e) => {
          console.log(e);
          window.alert(
            "대댓글 수정에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
        });
    }
  };

  const handleModifyReplyComment = (replyId) => {
    const replyComment = replyComments.find(
      (replyComment) => replyComment.id === replyId
    );
    if (replyComment) {
      setEditingReplyComment(replyComment);
      setReplyCommentForm((prevState) => ({
        ...prevState,
        content: replyComment.content,
      }));
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

  //시간 설정하기
  const getKoreanDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const koreanDate = new Date(dateString).toLocaleDateString(
      "ko-KR",
      options
    );
    const formattedDate = koreanDate.replace(/\. /g, ".");
    const separatedDateTime = formattedDate.replace(/\.(?=\d{2}:)/, " ");
    return separatedDateTime;
  };

  return (
    <div className={styles.box}>
      <h3>댓글 {comments.length + replyComments.length}</h3>
      <div className={styles.comments}>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div className={styles.comment_show} key={comment.id}>
              <div className={styles.comment_box}>
                <div className={styles.comment_header}>
                  {profile.imageUrl !== null ? (
                    <img
                      className={styles.profile_image}
                      src={profile.imageUrl}
                      alt='Profile'
                    />
                  ) : (
                    <img
                      className={styles.profile_image}
                      src={anonymous_profile}
                      alt='Anonymous Profile'
                    />
                  )}
                  <p className={styles.comment_nickname}>{comment.nickname}</p>
                  <p
                    className={styles.comment_reply}
                    onClick={() => moreReplyComment(comment.id)}
                  >
                    {comment.moreReplyComment ? "답글 닫기" : "답글"}
                  </p>

                  <p className={styles.comment_settings}>
                    <BiDotsVerticalRounded />
                  </p>
                </div>
                <p className={styles.comment_content}>{comment.content}</p>
                <p className={styles.comment_createdDate}>
                  {getKoreanDateTime(comment.createdDate)}
                </p>
              </div>

              {comment.moreReplyComment &&
                comment.reply &&
                comment.reply.length > 0 && (
                  <div className={styles.replycomments}>
                    {comment.reply.map((reply) => (
                      <div className={styles.replycomment_box} key={reply.id}>
                        <div className={styles.replycomment_header}>
                          <p className={styles.comment_arrow}>
                            <BsArrowReturnRight />
                          </p>
                          {profile.imageUrl !== null ? (
                            <img
                              className={styles.profile_image}
                              src={profile.imageUrl}
                              alt='Profile'
                            />
                          ) : (
                            <img
                              className={styles.profile_image}
                              src={anonymous_profile}
                              alt='Anonymous Profile'
                            />
                          )}
                          <p className={styles.comment_nickname}>
                            {reply.nickname}
                          </p>
                          <p className={styles.comment_reply}> 답글</p>
                          <p className={styles.comment_settings}>
                            <BiDotsVerticalRounded />
                          </p>
                        </div>

                        <p className={styles.replycomment_content}>
                          {reply.content}
                        </p>
                        <p className={styles.replycomment_createdDate}>
                          {getKoreanDateTime(reply.createdDate)}
                        </p>
                      </div>
                    ))}
                    <ReplyCommentCreate
                      parent_comment_id={comment.id}
                      mentioned_user_nickname={comment.nickname}
                      mentioned_user_email={userEmail} //처리
                    />
                  </div>
                )}
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
      <CommentCreate postId={post.id} />
    </div>
  );
}

export default TComments;
