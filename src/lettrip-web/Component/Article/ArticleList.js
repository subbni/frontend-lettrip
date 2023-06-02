import React, { useState, useEffect } from "react";
import "./ArticleList.css";
import { Link, useNavigate } from "react-router-dom";
import { ListArticle } from "../../Service/AuthService";
import { ACCESS_TOKEN } from "../../Constant/backendAPI";

function ArticleList() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
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
    ListArticle(pageForm)
      .then((response) => {
        setArticleList(response.content);
        console.log(response.content);
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
      <h2 className="articlet">게시글 목록</h2>
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
          </tr>
        </thead>
        <tbody>
          {articleList.map((post) => (
            <tr key={post.id}>
              <td id={post.id}>
                <Link
                  to={`/articles/${post.id}`}
                  onClick={() => navigate(`/articles/${post.id}`)}
                >
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
