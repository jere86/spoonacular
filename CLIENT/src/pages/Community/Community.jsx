import { useEffect, useState } from "react";
import Comments from "../../components/Comments/Comments";
import Upload from "../../components/Upload/Upload";

import styles from "./Community.module.scss";
import axios from "axios";

const Community = () => {
  const [images, setImages] = useState([]);

  const getImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/images");
      setImages(response.data);
    } catch (err) {
      console.error(err);
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
        {images.map((imageset) => {
          return (
            <div className={styles.imageset}>
              <p className={styles.recipe}>
                recipe{" "}
                <span className={styles.title}>
                  "{imageset.title.toUpperCase()}"
                </span>{" "}
                <span className={styles.user}>
                  by <i>{imageset.user}</i>
                </span>
              </p>
              <div className={styles.images}>
                {imageset.images.map((image, index) => {
                  return (
                    <img src={image.base64} alt={images.name} key={index} />
                  );
                })}
              </div>
              <p className={styles.description}>{imageset.description}</p>
              <Comments
                commentList={imageset.comments}
                imagesetId={imageset._id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Community;
