import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLoggedIn } from "../../Service/AuthService";
import { listArticle } from "../../Service/ArticleService";

import "./Article.css";

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
    listArticle(pageForm)
      .then((response) => {
        setArticleList(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    if (!checkIfLoggedIn()) {
      navigate("/login");
      return;
    } else {
      navigate("/articles/create");
    }
  };
  const handleArticleClick = (e) => {
    if (!checkIfLoggedIn()) {
      navigate("/login");
    } else {
      navigate(`/articles/${e.target.id}`);
    }
  };

  return (
    <div>
      <h2 className='article-list'>게시글 목록</h2>
      <button onClick={handleCreateClick} className='create-button'>
        글 작성
      </button>
      <table className='article-table'>
        <thead>
          <tr className='table-content'>
            <th>글 제목</th>
            <th>작성자</th>
            <th>작성일자</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {articleList.map((post) => (
            <tr
              key={post.id}
              id={post.id}
              className='article-table-row'
              onClick={handleArticleClick}
            >
              <td id={post.id}>{post.title}</td>

              <td id={post.id}>{post.writerNickname}</td>
              <td id={post.id}>
                {new Date(post.createdDate).toLocaleDateString()}
              </td>
              <td id={post.id}>{post.hit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArticleList;
