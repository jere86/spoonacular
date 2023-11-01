import { useEffect, useState } from "react";
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

  console.log(images);

  return (
    <div className={styles.community}>
      <DragAndDrop />
      {images.map((imageset) => {
        return (
          <div className={styles.imageset}>
            <p>{imageset.user}</p>
            {imageset.images.map((image, index) => {
              return <img src={image.base64} alt={images.name} key={index} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Community;
