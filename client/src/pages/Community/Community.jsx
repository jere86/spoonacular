import { useEffect, useState } from "react";
import Comments from "../../components/Comments/Comments";
import Upload from "../../components/Upload/Upload";

import styles from "./Community.module.scss";
import axios from "axios";

const Community = () => {
  const [images, setImages] = useState([]);

  axios.defaults.withCredentials = true;

  const getImages = async () => {
    try {
      const response = await axios.get(
        "https://spoonacular-api.vercel.app/images"
      );
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div className={styles.community}>
      <div className={styles.upload}>
        <Upload getImages={getImages} />
      </div>
      <div className={styles.uploaded}>
        {images.map((imagesetData) => (
          <div className={styles.imageset} key={imagesetData._id}>
            <p className={styles.recipe}>
              recipe{" "}
              <span className={styles.title}>
                {imagesetData.title.toUpperCase()}
              </span>{" "}
              <span className={styles.user}>
                by <i>{imagesetData.user}</i>
              </span>
            </p>
            <div className={styles.images}>
              {imagesetData.images.map((image, index) => (
                <img src={image.base64} alt={image.name} key={index} />
              ))}
            </div>
            <p className={styles.description}>{imagesetData.description}</p>
            <Comments
              commentList={imagesetData.comments}
              imagesetId={imagesetData._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
