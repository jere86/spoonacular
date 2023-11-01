import { useState, useRef, useContext } from "react";
import styles from "./DragAndDrop.module.scss";
import axios from "axios";
import { AppContext } from "../../context/appContext";

const DragAndDrop = () => {
  const { currentUser } = useContext(AppContext);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const selectFiles = () => {
    fileInputRef.current.click();
  };

  const onFileSelect = async (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files.lenght === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!images.some((e) => e.name === files[i].name)) {
        const base64 = await convertToBase64(files[i]);
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            base64: base64,
          },
        ]);
      }
    }
  };

  const deleteImages = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
    e.dataTransfer.dropEffect = "copy";
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!images.some((e) => e.name === files[i].name)) {
        const base64 = await convertToBase64(files[i]);
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            base64: base64,
          },
        ]);
      }
    }
  };

  const uploadImages = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:5000/images`, {
      images: [...images],
      user: currentUser.username,
    });
    setImages([]);
  };

  return (
    <div className={styles.dragAndDrop}>
      <div
        className={styles.dragArea}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {isDragging ? (
          <span className={styles.select}>Drop images here</span>
        ) : (
          <>
            <p>Drag & Drop images here</p>
            <p>or</p>
            <span className={styles.select} role="button" onClick={selectFiles}>
              Browse
            </span>
          </>
        )}
        <input
          type="file"
          name="file"
          className={styles.file}
          multiple
          ref={fileInputRef}
          onChange={onFileSelect}
        />
      </div>
      <div className={styles.images}>
        {images &&
          images.map((images, index) => (
            <div className={styles.image} key={index}>
              <span
                className={styles.delete}
                onClick={() => deleteImages(index)}
              >
                &times;
              </span>
              <img src={images.base64} alt={images.name} />
            </div>
          ))}
      </div>
      <button type="button" onClick={uploadImages}>
        UPLOAD
      </button>
    </div>
  );
};

export default DragAndDrop;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
