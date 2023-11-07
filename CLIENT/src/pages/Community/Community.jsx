import { useEffect, useState } from "react";
import Comments from "../../components/Comments/Comments";
import DragAndDrop from "../../components/DragAndDrop/DragAndDrop";

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
      <DragAndDrop getImages={getImages} />
      {images.map((imageset) => {
        return (
          <div className={styles.imageset}>
            <p>{imageset.user}</p>
            {imageset.images.map((image, index) => {
              return <img src={image.base64} alt={images.name} key={index} />;
            })}
            <Comments
              commentList={imageset.comments}
              imagesetId={imageset._id}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Community;
