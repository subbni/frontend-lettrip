import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ArticlePage.css";
import {
  ShowArticle,
  DeleteArticle,
  ListArticle,
} from "../../Service/AuthService";
import Comments from "./Comment/Comments";
import { ACCESS_TOKEN } from "../../Constant/backendAPI";

function ArticlePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // useParams 쓸 때 App.js에 적은 파라미터 명이랑 동일하게 적기
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [post, setPost] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    if (storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = () => {
    console.log(`현재 파라미터 = ${id}`);
    ShowArticle(id) // 해당 id에 해당하는 article 하나만 결과로 넘어옴
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

  const handleDelete = () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      DeleteArticle(id)
        .then((response) => {
          window.alert("게시글이 삭제되었습니다.");
          navigate("/articles");
          fetchArticles();
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
          window.alert(
            "게시글 삭제에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
        });
    }

    const fetchArticles = () => {
      ListArticle(pageForm)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
          window.alert("게시글 목록을 불러오는데 실패했습니다.");
        });
    };
  };

  const handleModifyClick = (e) => {
    e.preventDefault();
    navigate(`/articles/modify/${post.id}`);
  };

  return (
    <div className='ArticlePagecontainer'>
      {post && (
        <div key={post.id}>
          <h1 className='title'>{post.title}</h1>
          <h3 className='author'>
            <p>작성자: {post.writerName}</p>
          </h3>
          <div className='extra_views'>
            <p>조회수: {post.hit}</p>
            <p>좋아요 수: {post.likedCount}</p>
            <p>작성일자: {post.createdDate}</p>
            <p>수정일자: {post.modifiedDate}</p>
          </div>
          <p className='content'>{post.content}</p>

          {isLoggedIn && post.writerEmail === localStorage.getItem("email") && (
            <button onClick={handleModifyClick} className='modifybutton'>
              수정
            </button>
          )}
          {isLoggedIn && post.writerEmail === localStorage.getItem("email") && (
            <button
              onClick={() => handleDelete(post.id)}
              className='deletebutton'
            >
              삭제
            </button>
          )}
          <Comments postId={post.id} />
        </div>
      )}
    </div>
  );
}

export default ArticlePage;
