import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { uploadChatImage } from "../../Service/ChatService";
import styles from "./Chatting.module.css";

const ChatImageFileForm = ({ onImageFileUpload }) => {
  const [imageFile, setImageFile] = useState(null);
  const [showImage, setShowImage] = useState(null);

  const handleAddImage = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;

    const imageUrl = URL.createObjectURL(selectedImage);
    setImageFile(selectedImage);
    setShowImage(imageUrl);
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setShowImage(null);
  };

  const handleUploadImage = () => {
    if (!imageFile) {
      alert("이미지를 먼저 선택해주세요.");
      return;
    }
    uploadChatImage(imageFile)
      .then((response) => {
        console.log("이미지 업로드 성공", response);
        console.log(imageFile);
        onImageFileUpload(response.data);
      })
      .catch((error) => {
        console.error("이미지 업로드 실패", error);
      });
  };

  return (
    <div className={styles.imageBox}>
      <div className={styles.imageContainer}>
        <label className={styles.imageLabel01} htmlFor='image_upload'>
          + 사진
        </label>
        <input
          className={styles.imageInput}
          id='image_upload'
          accept='image/*'
          type='file'
          onChange={handleAddImage}
        />
        <button className={styles.submitbtn} onClick={handleUploadImage}>
          보내기
        </button>
      </div>
      {imageFile ? (
        <div className={styles.imageContent}>
          <div className={styles.imageWrapper}>
            <img className={styles.img} src={showImage} alt='Selected Image' />
            <button className={styles.imgBtn02} onClick={handleDeleteImage}>
              <AiOutlineDelete className={styles.imgIcon03} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChatImageFileForm;
