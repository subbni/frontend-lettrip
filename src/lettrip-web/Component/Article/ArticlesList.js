import React, { useState, useEffect } from "react";
import "./ArticlesList.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const instance = axios.create({
  baseURL: "http://ec2-3-35-173-250.ap-northeast-2.compute.amazonaws.com/api",
});

function ArticlesList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await instance.get("/posts");
      setPosts(response.data.posts);
    }

    fetchData();
  }, []);

  const handleCreateClick = () => {
    navigate("/Articles/create");
  };

  return (
    <div>
      <h1>게시글 목록</h1>
      <button onClick={handleCreateClick} className="create-button">
        글 작성
      </button>
      <table className="post-table">
        <thead>
          <tr>
            <th>글 제목</th>
            <th>작성자</th>
            <th>작성일자</th>
            <th>조회수</th>
            <th>댓글 수</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                <Link to={`/Articles/${post.id}`}>{post.title}</Link>
              </td>
              <td>{post.author}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>{post.views}</td>
              <td>{post.comments.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArticlesList;
