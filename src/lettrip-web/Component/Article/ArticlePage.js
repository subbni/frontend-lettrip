import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "./Comment/CommentCreate";
import "./ArticlePage.css";
import {
  Checklogin,
  PageArticle,
  DeleteArticle,
} from "../../Service/AuthService";

function ArticlePage() {
  const navigate = useNavigate();
  const { articleID } = useParams();
  const parsedArticleID = parseInt(articleID);
  const [post, setPost] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchChecklogin();
    fetchArticle();
  }, []);

  const fetchChecklogin = () => {
    Checklogin()
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((e) => {
        console.log(e);
        setIsLoggedIn(false);
      });
  };

  const fetchArticle = () => {
    PageArticle(parseInt(articleID))
      .then((response) => {
        setPost(response.content);
        console.log(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
        navigate("/articles");
      });
  };

  const currentPost = post.find((p) => p.id === parsedArticleID);

  const handleDelete = (articleID) => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      DeleteArticle(articleID)
        .then(() => {
          window.alert("게시글이 삭제되었습니다.");
          window.location.reload();
          navigate("/articles");
        })
        .catch((e) => {
          console.log(e);
          window.alert(
            "게시글 삭제에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
        });
    }
  };

  return (
    <div className='ArticlePagecontainer'>
      {currentPost && (
        <div key={currentPost.id}>
          <h1 className='title'>{currentPost.title}</h1>
          <h3 className='author'>
            <p>작성자: {currentPost.writerName}</p>
          </h3>
          <p className='content'>본문: {currentPost.content}</p>
          <div className='extra_views'>
            <p>조회수: {currentPost.hit}</p>
            <p>좋아요 수: {currentPost.likedCount}</p>
            <p>작성일자: {currentPost.createdDate}</p>
            <p>수정일자: {currentPost.modifiedDate}</p>
          </div>
          {isLoggedIn &&
            currentPost.writerEmail === localStorage.getItem("email") && ( // 로그인 여부와 작성자 이메일 비교 추가
              <div className='edit-buttons'>
                <button onClick={() => handleDelete(currentPost.id)}>
                  삭제
                </button>
              </div>
            )}
          <Comment postId={currentPost.id} />
        </div>
      )}
    </div>
  );
}

export default ArticlePage;
