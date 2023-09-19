import { useState, useRef } from "react";
import styles from "./Community.module.scss";

const Community = () => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const selectFiles = () => {
    fileInputRef.current.click();
  };

  const onFileSelect = (e) => {
    const files = e.target.files;
    if (files.lenght === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!images.some((e) => e.name === files[i].name)) {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
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

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!images.some((e) => e.name === files[i].name)) {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          },
        ]);
      }
    }
  };

  const uploadImages = () => {
    console.log(images);
  };

  return (
    <div className={styles.community}>
      <div className={styles.dragAndDrop}>
        <div className={styles.top}>
          <p>Drag & Drop image uploading</p>
        </div>
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
              Drag & Drop image here or{" "}
              <span
                className={styles.select}
                role="button"
                onClick={selectFiles}
              >
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
          {images.map((images, index) => (
            <div className={styles.image} key={index}>
              <span
                className={styles.delete}
                onClick={() => deleteImages(index)}
              >
                &times;
              </span>
              <img src={images.url} alt={images.name} />
            </div>
          ))}
        </div>

        <button type="button" onClick={uploadImages}>
          UPLOAD
        </button>
      </div>
    </div>
  );
};

export default Community;
