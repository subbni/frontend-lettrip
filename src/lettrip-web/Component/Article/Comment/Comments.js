import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  commentData,
  replyCommentData,
  modifyComment,
  deleteComment,
} from "../../../Service/ArticleService";
import { getMyProfile } from "../../../Service/MyPageService";

import ReplyCommentCreate from "./ReplyCommentCreate";
import styles from "./Comments.module.css";

import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsArrowReturnRight } from "react-icons/bs";

function Comments() {
  const { id, parent_comment_id } = useParams();

  const [profile, setProfile] = useState({});

  const [showOptions, setShowOptions] = useState({});

  const [comments, setComments] = useState([]);
  const [hiddenCommentCount, setHiddenCommentCount] = useState(0);
  const [replyComments, setReplyComments] = useState([]);
  const [hiddenReplyCommentCount, setHiddenReplyCommentCount] = useState(0);

  const [editingComment, setEditingComment] = useState({});
  const [editingReplyComment, setEditingReplyComment] = useState({});

  const [commentForm, setCommentForm] = useState({
    page: 0,
    size: 5,
    sort: "id,ASC",
    article_id: id,
    parent_id: parent_comment_id,
  }); //댓글 보여주기 : 5개씩, 오래된 순

  const [modifycommentForm, setModifyCommentForm] = useState({
    content: "",
  }); //댓글 수정시 요청 정보, id는 댓글 id
  const [modifyreplycommentForm, setModifyReplyCommentForm] = useState({
    content: "",
  }); //댓글 수정시 요청 정보, id는 댓글 id

  useEffect(() => {
    fetchCommentsAndMore();
    if (parent_comment_id) {
      fetchReplyCommentsAndMore();
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

  //댓글 설정 버튼 토글 관리
  const toggleOptions = (id) => {
    setShowOptions((prevShowOptions) => ({
      ...prevShowOptions,
      [id]: !prevShowOptions[id],
    }));
  };

  //답글 버튼 토글 관리
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
      fetchReplyCommentsAndMore(parent_id);
    }
  };

  // 댓글 불러오기
  const fetchCommentsAndMore = (incrementSize = 0) => {
    setCommentForm((prevForm) => ({
      ...prevForm,
      size: prevForm.size + incrementSize,
    }));
    commentData(commentForm)
      .then((response) => {
        const updatedComments = response.content.map((comment) => ({
          ...comment,
          options: false,
        }));
        setComments(updatedComments);
        setHiddenCommentCount(
          Math.max(0, response.totalElements - commentForm.size)
        );
      })
      .catch((e) => {
        console.log(e);
        window.alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  // 댓글 더보기 처리
  const clickComment = () => {
    console.log("댓글 더보기 버튼 누름");
    fetchCommentsAndMore(5);
  };

  //대댓글 불러오기
  const fetchReplyCommentsAndMore = (parent_id, incrementSize = 0) => {
    const replyCommentForm = {
      ...commentForm,
      parent_id: parent_id,
      size: commentForm.size + incrementSize,
    };
    replyCommentData(replyCommentForm)
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
        setHiddenReplyCommentCount(
          Math.max(0, response.totalElements - replyCommentForm.size)
        );
        setReplyComments(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  // 대댓글 더보기 처리
  const clickReplyComment = (parent_id) => {
    console.log("대댓글 더보기 버튼 누름");
    fetchReplyCommentsAndMore(parent_id, 5);
  };

  //댓글 수정하기
  const handleCommentFormChange = (e) => {
    const { name, value } = e.target;
    setModifyCommentForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    console.log("Modified reply content:", modifycommentForm.content); // Add this line
    if (editingComment.id) {
      if (window.confirm("댓글을 수정하시겠습니까?")) {
        const modifyForm = {
          id: editingComment.id,
          content: modifycommentForm.content,
        };
        modifyComment(modifyForm)
          .then((response) => {
            window.alert("댓글 수정이 완료되었습니다.");
            console.log(response);
            console.log(response.content);
            setModifyCommentForm((prevState) => ({
              ...prevState,
              content: "",
            }));
            setEditingComment({});
            fetchCommentsAndMore();
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
      setModifyCommentForm((prevState) => ({
        ...prevState,
        content: comment.content,
      }));
    }
  };

  // 대댓글 수정하기
  const handleReplyCommentFormChange = (e) => {
    const { name, value } = e.target;
    setModifyReplyCommentForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleReplyCommentFormSubmit = (e) => {
    e.preventDefault();
    if (editingReplyComment.id) {
      if (window.confirm("대댓글을 수정하시겠습니까?")) {
        const modifyReplyForm = {
          id: editingReplyComment.id,
          parent_comment_id: parent_comment_id,
          content: modifyreplycommentForm.content,
        };
        modifyComment(modifyReplyForm)
          .then((response) => {
            window.alert("대댓글 수정이 완료되었습니다.");
            console.log(response);
            setModifyReplyCommentForm((prevState) => ({
              ...prevState,
              content: "",
            }));
            setEditingReplyComment({});
            fetchReplyCommentsAndMore(parent_comment_id);
            console.log(response.content);
          })
          .catch((e) => {
            console.log(e);
            window.alert(
              "대댓글 수정에 실패했습니다. 다시 시도해주시길 바랍니다."
            );
          });
      }
    }
  };

  const handleModifyReplyComment = (replyId) => {
    const replyComment = replyComments.find(
      (replyComment) => replyComment.id === replyId
    );
    if (replyComment) {
      setEditingReplyComment(replyComment);
      setModifyReplyCommentForm((prevState) => ({
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
          fetchCommentsAndMore();
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

  // 모든 댓글과 대댓글에서 중복 없이 사용자 정보 추출
  const allUserInfos = new Set();
  comments.forEach((comment) => {
    allUserInfos.add({
      user_email: comment.user_email,
      nickname: comment.nickname,
    });
    if (comment.reply) {
      comment.reply.forEach((reply) => {
        allUserInfos.add({
          user_email: reply.user_email,
          nickname: reply.nickname,
        });
      });
    }
  });
  const uniqueUserInfos = Array.from(allUserInfos);

  return (
    <div className={styles.box}>
      <div className={styles.comments}>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
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
                          <li onClick={() => handleModifyComment(comment.id)}>
                            수정
                          </li>
                          <li onClick={() => handleDeleteComment(comment.id)}>
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
                    onSubmit={handleCommentFormSubmit}
                  >
                    <div className={styles.modify_comment}>
                      <textarea
                        id='content'
                        name='content'
                        placeholder='댓글을 입력하세요.'
                        required
                        value={modifycommentForm.content}
                        onChange={handleCommentFormChange}
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
                  onClick={() => moreReplyComment(comment.id)}
                >
                  {comment.toggleReplyComment ? "닫기" : "답글"}
                </p>
                {hiddenCommentCount > 0 && index === comments.length - 1 && (
                  <div className={styles.hiddenButton} onClick={clickComment}>
                    댓글 더보기 ({hiddenCommentCount}개)
                  </div>
                )}
              </div>

              {comment.moreReplyComment &&
                comment.reply &&
                comment.reply.length > 0 && (
                  <div className={styles.replycomments}>
                    {comment.reply.map((reply, index) => (
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
                              onClick={() => toggleOptions(reply.id)}
                            >
                              <BiDotsVerticalRounded />
                            </div>

                            {showOptions[reply.id] && (
                              <div className={styles.option_dropdown}>
                                <ul>
                                  <li
                                    onClick={() =>
                                      handleModifyReplyComment(reply.id)
                                    }
                                  >
                                    수정
                                  </li>
                                  <li
                                    onClick={() =>
                                      handleDeleteComment(reply.id)
                                    }
                                  >
                                    삭제
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {editingReplyComment.id === reply.id ? (
                          <form
                            className={styles.replymodify_box}
                            onSubmit={handleReplyCommentFormSubmit}
                          >
                            <div className={styles.modify_comment}>
                              <textarea
                                id='content'
                                name='content'
                                placeholder='대댓글을 입력하세요.'
                                required
                                value={modifyreplycommentForm.content}
                                onChange={handleReplyCommentFormChange}
                              />
                              <button type='submit'>완료</button>
                            </div>
                          </form>
                        ) : (
                          <p className={styles.replycomment_content}>
                            {reply.content}
                          </p>
                        )}
                        <p className={styles.replycomment_createdDate}>
                          {getKoreanDateTime(reply.createdDate)}
                        </p>
                        <p className={styles.replycomment_reply}> 답글</p>
                        {hiddenReplyCommentCount > 0 &&
                          comment.reply &&
                          comment.reply.length > 0 &&
                          index === comment.reply.length - 1 && (
                            <div
                              className={styles.hiddenReplyButton}
                              onClick={() => clickReplyComment(comment.id)}
                            >
                              대댓글 더보기 ({hiddenReplyCommentCount}개)
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}

              {comment.moreReplyComment && (
                <ReplyCommentCreate
                  parent_comment_id={comment.id}
                  userInfos={uniqueUserInfos} // 사용자 정보 전달
                />
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
