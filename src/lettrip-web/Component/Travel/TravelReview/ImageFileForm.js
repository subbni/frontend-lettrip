import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsFillChatSquareHeartFill, BsChatSquareHeart } from "react-icons/bs";

import styles from "./Review.module.css";

const ImageFileForm = ({
  containerIdx,
  courseIdx,
  onImageFileAdd,
  onImageFileDelete,
  confirm,
  onMainImageSet,
}) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [showImages, setShowImages] = useState([]);

  const [mainImage, setMainImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("mainImage 상태가 변경되었습니다.", mainImage);
  }, [mainImage]);

  const handleAddImages = (e) => {
    const addedFiles = e.target.files;
    let imageLists = [...imageFiles];
    let imageUrlLists = [...showImages];

    if (!addedFiles) return;
    if (imageFiles.length + addedFiles.length > 10) {
      return alert("최대 10개 사진만 첨부할 수 있습니다.");
    }
    for (let i = 0; i < addedFiles.length; i++) {
      const currentImageUrl = URL.createObjectURL(addedFiles[i]);
      console.log(addedFiles[i]);
      imageLists.push(addedFiles[i]);
      imageUrlLists.push(currentImageUrl);
    }
    if (imageUrlLists.length > 10) {
      imageUrlLists = imageUrlLists.slice(0, 10);
      imageLists = imageLists.slice(0, 10);
    }
    setImageFiles(imageLists);
    setShowImages(imageUrlLists);
    onImageFileAdd(imageLists);

    // 이미지가 추가될 때 대표 이미지를 첫 번째 이미지로 설정
    if (imageUrlLists.length > 0) {
      setMainImage(imageLists[0].name); // 수정된 부분
      onMainImageSet(imageLists[0].name);
    }
  };

  const handleDeleteImage = (id) => {
    if (mainImage === imageFiles[id].name) {
      // 삭제하려는 이미지가 메인 이미지인 경우
      if (imageFiles.length > 1) {
        // 이미지가 여러 개인 경우
        setMainImage(imageFiles[id === 0 ? 1 : 0].name); // 다른 이미지를 메인 이미지로 설정
      } else {
        // 이미지가 하나밖에 없는 경우
        setMainImage(null); // 메인 이미지를 null로 설정
      }
    }
    setShowImages(showImages.filter((_, index) => index !== id));
    setImageFiles(imageFiles.filter((_, index) => index !== id));
    onImageFileDelete(id);
  };

  const handleSetMainImage = (id) => {
    if (selectedImage === id) {
      // 이미 선택한 이미지를 다시 클릭하면 선택 해제
      setSelectedImage(null);
      setMainImage(null); // 대표 이미지도 해제
      onMainImageSet(null);
    } else {
      // 사용자에게 대표 이미지로 설정할 것인지 물어보는 팝업
      const isSetMainImage = window.confirm("대표 이미지로 설정하시겠습니까?");
      if (isSetMainImage) {
        const selectedImageName = imageFiles[id].name; // 선택한 이미지의 이름 저장
        setSelectedImage(id); // 선택한 이미지를 설정
        setMainImage(selectedImageName); // 대표 이미지로 설정
        onMainImageSet(selectedImageName); // 대표 이미지로 설정
      }
    }
  };

  const onUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setImageFiles({
      ...imageFiles,
      file,
    });
    reader.readAsDataURL(file);

    return new Promise((resolve) => {
      reader.onloadend = () => {
        setShowImages(reader.result || null);

        resolve();
      };
    });
  };

  return (
    <div>
      <div className={styles.imageContainer}>
        <label
          className={styles.imageLabel01}
          htmlFor={`${containerIdx}reviewImg_upload${courseIdx}`}
          disabled={confirm}
        >
          + 사진
        </label>
        <input
          className={styles.imageInput}
          id={`${containerIdx}reviewImg_upload${courseIdx}`}
          accept='image/*'
          multiple
          type='file'
          onChange={handleAddImages}
          disabled={confirm}
        />
      </div>
      <div className={styles.imageLabel02}>
        첨부된 사진 : {imageFiles.length}개
      </div>
      {imageFiles.length > 0 ? (
        <div className={styles.imageContent}>
          {showImages.map((image, id) => (
            <div className={styles.imageWrapper} key={id}>
              <img
                className={styles.img}
                src={image}
                alt={`${image}-${id}`}
                disabled={confirm}
              />
              <button
                className={styles.imgBtn01}
                onClick={() => handleSetMainImage(id)}
              >
                {selectedImage === id ? (
                  <BsFillChatSquareHeartFill className={styles.imgIcon02} />
                ) : (
                  <BsChatSquareHeart className={styles.imgIcon01} />
                )}
              </button>
              <button
                className={styles.imgBtn02}
                onClick={() => handleDeleteImage(id)}
                disabled={confirm}
              >
                <AiOutlineDelete className={styles.imgIcon03} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ImageFileForm;
