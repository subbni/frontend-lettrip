import React, { useState } from "react";
import "./ArticlesCreate.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const instance = axios.create({
  baseURL: "http://192.168.25.19/api",
});

function ArticlesCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요");
      return;
    }

    if (!content.trim()) {
      alert("본문을 입력해주세요");
      return;
    }

    const confirmResult = window.confirm("게시판 글을 등록하시겠습니까?");
    if (!confirmResult) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("file", file);

    const response = await instance.post("/posts", formData);

    alert("게시글이 등록되었습니다.");
    navigate(`/Articles/${response.data.post.id}`);
  };

  return (
    <div className='board-create-container'>
      <h1>게시글 작성</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>제목</label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className='form-group-file'>
          <label htmlFor='file'>사진 첨부</label>
          <input
            type='file'
            id='file'
            onChange={(event) => setFile(event.target.files[0])}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='content'>내용</label>
          <textarea
            id='content'
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
        <button type='submit'>등록</button>
      </form>
    </div>
  );
}

export default ArticlesCreate;
