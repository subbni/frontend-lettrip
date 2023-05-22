import React, { useState, useEffect } from "react";
import "./ArticleList.css";
import { Link, useNavigate } from "react-router-dom";
import { ListArticle } from "../../Service/AuthService";

function ArticleList() {
  const navigate = useNavigate();
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });
  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    ListArticle(pageForm)
      .then((response) => {
        setArticleList(response.content);
        console.log(articleList);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  const handleCreateClick = () => {
    navigate("/Article/Create");
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
          </tr>
        </thead>
        <tbody>
          {articleList.map((post) => (
            <tr key={post.id}>
              <td key={post.id}>
                <Link to={`/Article/${post.id}`}>{post.title}</Link>
              </td>
              <td key={post.id}>{post.writerNickname}</td>
              <td key={post.id}>
                {new Date(post.createdDate).toLocaleDateString()}
              </td>
              <td key={post.id}>{post.hit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArticleList;
