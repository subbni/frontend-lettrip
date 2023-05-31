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
  const { id } = useParams(); // useParams 쓸 때 App.js에 적은 파라미터 명이랑 동일하게 적기
  const [post, setPost] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // fetchChecklogin();
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
    console.log(`현재 파라미터 = ${id}`);
    PageArticle(id) // 해당 id에 해당하는 article 하나만 결과로 넘어옴 => showArticle이나 다른 이름으로 바꾸면 좋을 것 같아요
      .then((response) => {
        setPost(response);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
        navigate("/articles");
      });
  };

  // const currentPost = post.find((p) => p.id === parsedArticleID);

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
    <div className="ArticlePagecontainer">
      {post && (
        <div key={post.id}>
          <h1 className="title">{post.title}</h1>
          <h3 className="author">
            <p>작성자: {post.writerName}</p>
          </h3>
          <div className="extra_views">
            <p>조회수: {post.hit}</p>
            <p>좋아요 수: {post.likedCount}</p>
            <p>작성일자: {post.createdDate}</p>
            <p>수정일자: {post.modifiedDate}</p>
          </div>
          <p className="content">{post.content}</p>
         
          {isLoggedIn &&
            post.writerEmail === localStorage.getItem("email") && ( // 로그인 여부와 작성자 이메일 비교 추가
              <div className="edit-buttons">
                <button onClick={() => handleDelete(post.id)}>삭제</button>
              </div>
            )}
          <Comment postId={post.id} />
        </div>
      )}
    </div>
  );
}

export default ArticlePage;
