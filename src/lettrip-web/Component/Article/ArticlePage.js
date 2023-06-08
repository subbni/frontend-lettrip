import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  showArticle,
  deleteArticle,
  listArticle,
} from "../../Service/ArticleService";

import CommentCreate from "./Comment/CommentCreate";

import { AiFillSetting } from "react-icons/ai";
import "./Article.css";

function ArticlePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);

  const [pageOptions, setpageOptions] = useState(false);
  const menuRef = useRef();

  const [post, setPost] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });

  useEffect(() => {
    //게시글 작성자와 로그인 사용자 동일 여부 확인하기
    const storedEmail = localStorage.getItem("email");
    if (post.writerEmail === storedEmail) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [post]);

  useEffect(() => {
    fetchArticle();
  }, []);

  useEffect(() => {
    //게시글 설정 버튼 누르기
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //게시글 불러오기
  const fetchArticle = () => {
    console.log(`현재 파라미터 = ${id}`);
    showArticle(id) // 해당 id에 해당하는 article 하나만 결과로 넘어옴
      .then((response) => {
        setPost(response);
        console.log();
      })
      .catch((e) => {
        console.log(e);
        alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
        navigate("/articles");
      });
  };

  //게시글 삭제
  const handleDelete = () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      deleteArticle(id)
        .then(() => {
          alert("게시글이 삭제되었습니다.");
          navigate("/articles");
          fetchArticles();
        })
        .catch((e) => {
          console.log(e);
          alert("게시글 삭제에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
    //게시글 목록에 업데이트
    const fetchArticles = () => {
      listArticle(pageForm)
        .then(() => {
          console.log();
        })
        .catch((e) => {
          console.log(e);
          window.alert("게시글 목록을 불러오는데 실패했습니다.");
        });
    };
  };

  //게시글 수정
  const handleModify = () => {
    navigate(`/articles/modify/${post.id}`);
  };

  //설정 아이콘 누르면 메뉴 나오게 하기 (수정, 삭제, ?URL복사)
  const pageSettings = () => {
    setpageOptions(!pageOptions);
  };
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setpageOptions(false);
    }
  }

  // 한국 시차 설정하기
  const getKoreanDateTime = (dateString) => {
    const options = {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleString("ko-KR", options);
  };

  return (
    <div className='article-page-container'>
      {post && (
        <div key={post.id}>
          <h1 className='page-title'>{post.title}</h1>
          <h3 className='page-author'>
            <p>작성자 : {post.writerName}</p>
          </h3>
          <div className='page-views'>
            <p>조회수 : {post.hit}</p>
            <p>좋아요 수 : {post.likedCount}</p>
            <p>작성일자 : {getKoreanDateTime(post.createdDate)}</p>
            <p>수정일자 : {getKoreanDateTime(post.modifiedDate)}</p>
            <p className='page-settings' onClick={pageSettings}>
              <AiFillSetting />
            </p>
            {pageOptions && (
              <div className='page-setting-options'>
                {isEditable && (
                  <div className='page-modify' onClick={handleModify}>
                    수정
                  </div>
                )}
                {isEditable && (
                  <div className='page-delete' onClick={handleDelete}>
                    삭제
                  </div>
                )}
              </div>
            )}
          </div>
          <p className='page-content'>{post.content}</p>
        </div>
      )}
      <CommentCreate postId={post.id} />
    </div>
  );
}

export default ArticlePage;
