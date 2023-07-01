import styles from "./Index.module.scss";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const routeToSearch = () => {
    navigate("/search");
  };

  return (
    <div className={styles.index}>
      <button onClick={routeToSearch}>Search</button>
    </div>
  );
};

export default Index;
