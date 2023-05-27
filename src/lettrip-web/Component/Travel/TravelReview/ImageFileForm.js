import { useState } from "react";
import "./Review.css";

const ImageFileForm = ({
  containerIdx,
  courseIdx,
  onImageFileAdd,
  onImageFileDelete,
}) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [showImages, setShowImages] = useState([]);

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
  };

  const handleDeleteImage = (id) => {
    setShowImages(showImages.filter((_, index) => index !== id));
    setImageFiles(imageFiles.filter((_, index) => index !== id));
    onImageFileDelete(id);
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
      <div className="courseComponent">
        <label
          className="reviewImg_label"
          htmlFor={`${containerIdx}reviewImg_upload${courseIdx}`}
        >
          사진 업로드
        </label>
        <input
          className="reviewImg_input"
          id={`${containerIdx}reviewImg_upload${courseIdx}`}
          accept="image/*"
          multiple
          type="file"
          onChange={handleAddImages}
        />
      </div>
      <div>첨부된 사진 : {imageFiles.length}개 </div>

      <div className="imageContainer">
        {showImages.map((image, id) => (
          <div key={id}>
            <img className="reviewImg" src={image} alt={`${image}-${id}`} />
            <button
              className="delete_btn"
              onClick={() => handleDeleteImage(id)}
            >
              delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageFileForm;
