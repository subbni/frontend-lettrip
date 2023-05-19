import React, { useState, useEffect } from "react";
import "./ArticlesList.css";
import { Link, useNavigate } from "react-router-dom";
import { ArticleList } from "../../Service/APIService";

function ArticlesList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    ArticleList()
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  const handleCreateClick = () => {
    navigate("/Articles/create");
  };

  return (
    <div>
      <h1>게시글 목록</h1>
      <button onClick={handleCreateClick} className='create-button'>
        글 작성
      </button>
      <table className='post-table'>
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
