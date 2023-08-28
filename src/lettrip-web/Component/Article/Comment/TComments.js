import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  commentData,
  replyCommentData,
  modifyComment,
  deleteComment,
} from "../../../Service/ArticleService";
import { getMyProfile } from "../../../Service/MyPageService";

import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsArrowReturnRight } from "react-icons/bs";

import styles from "./Comments.module.css";
import ReplyCommentCreate from "./ReplyCommentCreate";

function TComments({ storedCommentEmail }) {
  const { id, parent_comment_id, mentioned_user_email } = useParams();

  const [profile, setProfile] = useState({});

  const [showOptions, setShowOptions] = useState({});
  const [settingOptions, setSettingOptions] = useState(null);

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
    showComments();
    if (parent_comment_id) {
      showReplyComments();
    }
  }, [parent_comment_id]);

  useEffect(() => {
    getMyProfile() //프로필 사진 가져오기
      .then((response) => {
        setProfile(response);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  // 댓글 수에 대댓글 수를 합산하여 표시할 변수
  const TotalCommentCount = () => {
    return comments.reduce((total, comment) => {
      const replyCommentList = replyComments[comment.id];
      const replyCount = replyCommentList ? replyCommentList.length : 0;
      return total + replyCount + 1; // 댓글과 대댓글 수를 합산
    }, 0);
  };

  // 댓글 작성자 이메일과 현재 로그인한 사용자의 이메일을 비교하여 동일한지 확인하는 함수
  const isEditable = (email) => {
    const loggedInUserEmail = localStorage.getItem("email");
    console.log("댓글 작성자:", storedCommentEmail);
    console.log("현재 로그인한 사용자:", loggedInUserEmail);

    return email === storedCommentEmail;
  };

  //댓글 설정 버튼 토글 관리
  const toggleOptions = (commentId) => {
    setShowOptions((prevShowOptions) => ({
      ...prevShowOptions,
      [commentId]: !prevShowOptions[commentId],
    }));
  };

  //댓글 답글 버튼 토글 관리
  const toggleReplyComments = (parent_id) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === parent_id) {
        return {
          ...comment,
          toggleReplyComment: !comment.toggleReplyComment,
        };
      }
      return comment;
    });
    setComments(updatedComments);
    if (
      updatedComments.find((comment) => comment.id === parent_id)
        .toggleReplyComment
    ) {
      showReplyComments(parent_id);
    }
  };

  //댓글 불러오기
  const showComments = () => {
    commentData(pageForm)
      .then((response) => {
        const updatedComments = response.content.map((comment) => ({
          ...comment,
          options: false, // 설정 버튼 상태 초기값
        }));
        setComments(updatedComments);
        console.log(response);
        console.log(response.content);
      })
      .catch((e) => {
        console.log(e);
        alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  //댓글 수정하기
  const settingCommentFormChange = (e) => {
    const { name, value } = e.target;
    setCommentForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const settingCommentFormSubmit = (e) => {
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
            showComments();
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

  const settingModifyComment = (commentId) => {
    const comment = comments.find((comment) => comment.id === commentId);
    if (comment) {
      setEditingComment(comment);
      setCommentForm({ content: comment.content });
    }
  };

  //대댓글 불러오기
  const showReplyComments = (parent_id) => {
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
              toggleReplyComment: true,
            };
          }
          return comment;
        });
        setComments(updatedComments);
        setReplyComments((prevReplyComments) => ({
          ...prevReplyComments,
        }));
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  //댓글 삭제하기
  const settingDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment(commentId)
        .then((response) => {
          window.alert("댓글이 삭제되었습니다.");
          console.log(response);
          showComments();
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
      <h3>댓글 {TotalCommentCount()}</h3>

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

                  <div className={styles.comment_settings}>
                    <div
                      className={styles.setting_icon}
                      onClick={() => toggleOptions(comment.id)}
                    >
                      <BiDotsVerticalRounded />
                    </div>
                    {showOptions[comment.id] && (
                      <div className={styles.option_dropdown}>
                        <ul>
                          <li onClick={() => settingModifyComment(comment.id)}>
                            수정
                          </li>
                          <li onClick={() => settingDeleteComment(comment.id)}>
                            삭제
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {editingComment.id === comment.id ? (
                  <form
                    className={styles.modify_box}
                    onSubmit={settingCommentFormSubmit}
                  >
                    <div className={styles.comment}>
                      <textarea
                        id='content'
                        name='content'
                        placeholder='댓글을 입력하세요.'
                        required
                        value={commentForm.content}
                        onChange={settingCommentFormChange}
                      />
                      <button type='submit'>완료</button>
                    </div>
                  </form>
                ) : (
                  <p className={styles.comment_content}>{comment.content}</p>
                )}
                <p className={styles.comment_createdDate}>
                  {getKoreanDateTime(comment.createdDate)}
                </p>

                <p
                  className={styles.comment_reply}
                  onClick={() => toggleReplyComments(comment.id)}
                >
                  {comment.toggleReplyComment ? "닫기" : "답글"}
                </p>
              </div>

              {comment.togglereplyComment &&
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
                          <div className={styles.comment_settings}>
                            <div
                              className={styles.setting_icon}
                              onClick={() => setSettingOptions(reply.email)}
                            >
                              <BiDotsVerticalRounded />
                            </div>

                            {settingOptions === reply.email && (
                              <div className={styles.option_dropdown}>
                                <ul>
                                  <li>수정</li>
                                  <li>삭제</li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className={styles.replycomment_content}>
                          {reply.content}
                        </p>
                        <p className={styles.replycomment_createdDate}>
                          {getKoreanDateTime(reply.createdDate)}
                        </p>
                        <p className={styles.replycomment_reply}> 답글</p>
                      </div>
                    ))}
                    {comment.toggleReplyComment && (
                      <ReplyCommentCreate
                        parent_comment_id={comment.id} //정상
                        mentioned_user_nickname={comment.nickname} //정상
                        mentioned_user_email={comment.email} //처리
                      />
                    )}
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

export default TComments;
