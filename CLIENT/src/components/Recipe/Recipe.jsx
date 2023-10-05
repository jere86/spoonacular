import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../context/appContext";

import styles from "./Recipe.module.scss";
import axios from "axios";

const Recipe = ({ recipe }) => {
  const { currentUser, getUsers } = useContext(AppContext);
  const [isToggled, setIsToggled] = useState(
    currentUser.favorites.includes(recipe) ? true : false
  );
  const navigate = useNavigate();

  const showInfo = () => {
    navigate(`/info/${recipe.id}`);
  };

  const starClick = (e) => {
    e.stopPropagation();
  };

  const onToggle = async () => {
    setIsToggled(!isToggled);
    !isToggled
      ? await axios.patch(`http://localhost:5000/users/${currentUser._id}`, {
          favorites: [...currentUser.favorites, recipe],
        })
      : await axios.patch(`http://localhost:5000/users/${currentUser._id}`, {
          favorites: currentUser.favorites.filter(
            (favorite) => favorite.id !== recipe.id
          ),
        });
    getUsers();
  };
  // setUsers((prevUsers) => [
  //   ...prevUsers.map((user) => {
  //     if (user.username === username) {
  //       return {
  //         ...user,
  //         favorites: [...user.favorites, recipe],
  //       };
  //     } else {
  //       return {
  //         ...user,
  //       };
  //     }
  //   }),
  // ])
  // setUsers((prevUsers) => [
  //   ...prevUsers.map((user) => {
  //     if (user.username === username) {
  //       return {
  //         ...user,
  //         favorites: user.favorites.filter(
  //           (favorite) => favorite.id !== recipe.id
  //         ),
  //       };
  //     } else {
  //       return {
  //         ...user,
  //       };
  //     }
  //   }),
  // ]);

  return (
    <div className={styles.recipe} onClick={showInfo}>
      <h1>{recipe.title}</h1>
      <div className={styles.image}>
        <img src={recipe.image} alt="meal" className={styles.recipeImage} />
        <div className={styles.favoritestar} onClick={starClick}>
          <input
            type="checkbox"
            id={recipe.id}
            name={recipe.id}
            checked={isToggled}
            onChange={onToggle}
          />
          <label htmlFor={recipe.id}>
            <svg className={styles.star} viewBox="0 0 50 50">
              <path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z" />
            </svg>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Recipe;