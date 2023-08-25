import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showArticle, deleteArticle } from "../../Service/ArticleService";
import { getMyProfile } from "../../Service/MyPageService";

import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; //하트 아이콘

import styles from ".//Article.module.css";
import TComments from "./Comment/TComments"; //댓글 참조
import CommentCreate from "./Comment/CommentCreate";

function ArticlePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [post, setPost] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });
  const [profile, setProfile] = useState({});
  const [liked, setLiked] = useState(false);

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
    fetchArticle(); //게시글 불러오기
    //프로필 사진 가져오기
    getMyProfile()
      .then((response) => {
        setProfile(response);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  //게시글 불러오기
  const fetchArticle = () => {
    console.log(`현재 파라미터 = ${id}`);
    showArticle(id) // 해당 id에 해당하는 article 하나만 결과로 넘어옴
      .then((response) => {
        setPost(response);
        console.log(response);
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
        })
        .catch((e) => {
          console.log(e);
          alert("게시글 삭제에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  //게시글 수정
  const handleModify = () => {
    navigate(`/articles/modify/${post.id}`);
  };

  // 한국 시차 설정하기
  const getKoreanDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const koreanDate = new Date(dateString).toLocaleDateString(
      "ko-KR",
      options
    );
    return koreanDate.replace(/-/g, ".");
  };

  // 좋아요 관리
  const handleLikeClick = () => {
    setLiked(!liked);
  };

  return (
    <div className={styles.page}>
      {post && (
        <div className={styles.container} key={post.id}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.views}>
            {profile.imageUrl !== null ? (
              <img className={styles.profile_image} src={profile.imageUrl} />
            ) : (
              <img className={styles.profile_image} src={anonymous_profile} />
            )}

            <p>{post.writerName}</p>
            <p>{getKoreanDateTime(post.createdDate)}</p>
            <p>조회수 {post.hit}</p>
          </div>
          <p className={styles.content}>{post.content}</p>

          <div className={styles.settings}>
            <div className={styles.liked}>
              <button className={styles.heart} onClick={handleLikeClick}>
                {liked ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
              <div className={styles.liked_count}>{post.likedCount}</div>
            </div>
            <div className={styles.buttons}>
              {isEditable && (
                <div className={styles.button_modify} onClick={handleModify}>
                  수정
                </div>
              )}
              {isEditable && (
                <div className={styles.button_delete} onClick={handleDelete}>
                  삭제
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <CommentCreate />
    </div>
  );
}

export default ArticlePage;
