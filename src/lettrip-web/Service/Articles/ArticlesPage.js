import React, { useState, useEffect } from "react";
import axios from "axios";
import Comment from "./Comment";
import "./ArticlesPage.css";

const instance = axios.create({
  baseURL: "http://192.168.25.19/api",
});

function ArticlesPage() {
  const [posts, setNewPosts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태

  useEffect(() => {
    async function fetchData() {
      const response = await instance.get("/posts");
      setNewPosts(response.data.posts);
      setIsDataFetched(true);
    }

    if (!isDataFetched) {
      fetchData();
    }
  }, [isDataFetched]);

  // 로그인 여부를 확인하는 함수
  async function checkLogin() {
    try {
      const response = await instance.get("/checkLogin");
      if (response.status === 200) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  }

  // 게시글 삭제 함수
  async function handleDelete(postId) {
    const confirmResult = window.confirm("게시글을 삭제하시겠습니까?");
    if (confirmResult) {
      try {
        const response = await instance.delete(`/posts/${postId}`);
        if (response.status === 200) {
          alert("게시글이 삭제되었습니다.");
          setNewPosts(posts.filter((post) => post.id !== postId)); // 삭제된 게시글을 제외한 게시글 목록을 다시 설정
        }
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <div className='container'>
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

export default ArticlesPage;
