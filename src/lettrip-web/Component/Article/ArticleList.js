import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLoggedIn } from "../../Service/AuthService";
import { listArticle } from "../../Service/ArticleService";

import styles from "./Article.module.css";

import Pagination from "react-js-pagination";

function ArticleList() {
  const navigate = useNavigate();
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });
  const [articleList, setArticleList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchArticles();
  }, [pageForm.page]);

  const fetchArticles = () => {
    listArticle(pageForm)
      .then((response) => {
        setArticleList(response.content);
        setTotalElements(response.totalElements);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주세요.");
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
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPageForm({
      ...pageForm,
      page: pageNumber - 1,
    });
  };

  return (
    <div className={styles.box}>
      <h3 className={styles.article_list}>전체 글 목록</h3>
      <table className={styles.article_table}>
        <thead>
          <tr className={styles.table_content}>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일자</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {articleList.map((post) => (
            <tr key={post.id} id={post.id} className={styles.table_row}>
              <td id={post.id} onClick={handleArticleClick}>
                {post.title}{" "}
                <span className={styles.comment_count}>
                  ({post.commentCount})
                </span>
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
      <button className={styles.button} onClick={handleCreateClick}>
        글쓰기
      </button>
      <Pagination
        activePage={currentPage}
        itemsCountPerPage={pageForm.size}
        totalItemsCount={totalElements}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
    </div>
  );
}

export default ArticleList;
