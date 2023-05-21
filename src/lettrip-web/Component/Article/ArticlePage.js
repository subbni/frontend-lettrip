import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment/CommentCreate";
import "./ArticlePage.css";
import {
  Checklogin,
  PageArticle,
  DeleteArticle,
} from "../../Service/APIService";

function ArticlePage() {
  const navigate = useNavigate();
  const [posts, setNewPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태

  useEffect(() => {
    fetchChecklogin();
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

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    PageArticle()
      .then((response) => {
        setNewPosts(response.data.posts);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  const handleDelete = (postID) => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      DeleteArticle(postID)
        .then(() => {
          window.alert("게시글이 삭제되었습니다.");
          window.location.reload();
          navigate("/Article");
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
      {posts.map((post) => (
        <div key={post.id}>
          <h1 className='title'>{post.title}</h1>
          <h3 className='author'>{post.author}</h3>
          <p className='content'>{post.content}</p>
          <div className='views-likes'>
            <p>조회수: {post.views}</p>
            <p>좋아요 수: {post.likes}</p>
          </div>
          {isLoggedIn && ( // 로그인 상태이면 수정, 삭제 버튼을 보여줌
            <div className='edit-buttons'>
              <button onClick={() => handleDelete(post.id)}>삭제</button>
            </div>
          )}
          <Comment postId={post.id} />
        </div>
      ))}
    </div>
  );
}

export default ArticlePage;
