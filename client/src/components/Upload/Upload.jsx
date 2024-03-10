import { useState, useRef, useContext } from "react";
import styles from "./Upload.module.scss";
import axios from "axios";
import { AppContext } from "../../context/appContext";

const Upload = ({ getImages }) => {
  const { currentUser } = useContext(AppContext);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
    e.dataTransfer.dropEffect = "copy";
  };

  const onDrop = async (e) => {
    e.preventDefault();
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

    if (
      (images.length !== 0) &
      (formData.title !== "") &
      (formData.description !== "")
    ) {
      await axios.post(`https://spoonacular-api.onrender.com/images`, {
        images: [...images],
        user: currentUser.username,
        title: formData.title,
        description: formData.description,
      });
      setImages([]);
      setFormData({
        title: "",
        description: "",
      });
      getImages();
    }
  };

  return (
    <div className={styles.upload}>
      <div className={styles.container}>
        <div className={styles.info}>
          <p>
            <span>recipe</span> TITLE
          </p>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter recipe title"
            value={formData.title}
            onChange={handleChange}
          />

          <p>
            <span>recipe</span> DESCRIPTION
          </p>
          <textarea
            id="description"
            name="description"
            placeholder="Enter recipe description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className={styles.dragAndDrop}>
          <div className={styles.bar}>
            <span className={styles.select} role="button" onClick={selectFiles}>
              BROWSE
            </span>
            <div
              className={styles.dragArea}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <span>
                <b>or drag images here</b>
              </span>
              <input
                type="file"
                name="file"
                className={styles.file}
                multiple
                ref={fileInputRef}
                onChange={onFileSelect}
              />
            </div>
          </div>
          <div className={styles.images}>
            {images &&
              images.map((images, index) => (
                <div className={styles.image} key={index}>
                  <img src={images.base64} alt={images.name} />
                  <p>{images.name}</p>
                  <button
                    className={styles.delete}
                    onClick={() => deleteImages(index)}
                  >
                    X
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <button className={styles.uploadbtn} type="submit" onClick={uploadImages}>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"></path>{" "}
          <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"></path>
        </svg>
        SHARE
      </button>
    </div>
  );
};

export default Upload;

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
