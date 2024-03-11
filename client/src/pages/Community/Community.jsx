import { useEffect, useState } from "react";
import Comments from "../../components/Comments/Comments";
import Upload from "../../components/Upload/Upload";

import styles from "./Community.module.scss";
import axios from "axios";

const Community = () => {
  const [images, setImages] = useState([]);

  const getImages = async () => {
    try {
      const response = await axios.get(
        "https://spoonacular-api.onrender.com/images"
      );
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Error fetching images. Please try again later.");
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  const handleUploadSuccess = (newImage) => {
    setImages((prevImages) => [...prevImages, newImage]);
  };

  return (
    <div className={styles.community}>
      <div className={styles.upload}>
        <Upload getImages={handleUploadSuccess} />
      </div>
      <div className={styles.uploaded}>
        {images.length > 0 &&
          images.map((imageset) => (
            <div className={styles.imageset} key={imageset._id}>
              <p className={styles.recipe}>
                recipe{" "}
                <span className={styles.title}>
                  {imageset.title.toUpperCase()}
                </span>{" "}
                <span className={styles.user}>
                  by <i>{imageset.user}</i>
                </span>
              </p>
              <div className={styles.images}>
                {imageset.images.map((image, index) => (
                  <img src={image.base64} alt={image.name} key={index} />
                ))}
              </div>
              <p className={styles.description}>{imageset.description}</p>
              <Comments
                commentList={imageset.comments}
                imagesetId={imageset._id}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Community;
