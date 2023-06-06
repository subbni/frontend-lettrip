import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listArticle } from "../../Service/ArticleService";
import { ACCESS_TOKEN } from "../../Constant/backendAPI";
import "./Article.css";

function ArticleList() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });
  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    if (storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    listArticle(pageForm)
      .then((response) => {
        setArticleList(response.content);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.alert("로그인이 필요합니다.");
      return;
    } else {
      navigate("/articles/create");
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
            <tr key={post.id}>
              <td id={post.id}>
                <Link to={`/articles/${post.id}`} className='article-page'>
                  {post.title}
                </Link>
              </td>
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
