import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.home}>
      <img
        src="http://spoonacular.com/application/frontend/images/logo-simple-framed-green-gradient.svg"
        alt="spoonacular logo"
      ></img>
    </div>
  );
};

export default Home;
