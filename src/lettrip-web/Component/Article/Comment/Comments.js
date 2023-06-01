import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CommentData,
  CreateComment,
  DeleteComment,
} from "../../../Service/AuthService";
import "./Comments.css";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";

function Comments() {
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const [comments, setComments] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,ASC",
    article_id: id,
  }); //댓글 보여주기 : 5개씩, 오래된 순
  const [commentForm, setCommentForm] = useState({
    article_id: id,
    content: "",
  }); //댓글 작성시 요청 정보

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    if (storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  //댓글 불러오기
  const fetchComments = () => {
    CommentData(pageForm)
      .then((response) => {
        setComments(response.content);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  //댓글 작성하기
  const handleCommentFormChange = (e) => {
    const changedField = e.target.name;
    setCommentForm({
      ...commentForm,
      [changedField]: e.target.value,
    });
  };

  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.alert("로그인이 필요합니다.");
      return;
    }
    if (window.confirm("댓글을 작성하시겠습니까?")) {
      CreateComment(commentForm)
        .then((response) => {
          window.alert("댓글 작성이 완료되었습니다.");
          fetchComments();
          console.log(response);
          setCommentForm({ ...commentForm, content: "" });
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 작성에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  //댓글 삭제하기
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

  return (
    <div className='Comment_container'>
      <h2>댓글</h2>
      <form className='CreateComment' onSubmit={handleCommentFormSubmit}>
        <textarea
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
            <div key={comment.id}>
              <h3 className='nickname'>{comment.nickname}</h3>
              <p className='content'>{comment.content}</p>
              <p className='createdDate'>{comment.createdDate}</p>
              {isLoggedIn && (
                <button
                  className='DeleteComment_button'
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  삭제
                </button>
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
