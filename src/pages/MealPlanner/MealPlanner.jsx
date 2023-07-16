import Calendar from "../../components/Calendar/Calendar";

import styles from "./MealPlanner.module.scss";

const MealPlanner = () => {
  return (
    <div className={styles.mealplanner}>
      <h1>Generate a meal plan</h1>
      <Calendar />
    </div>
  );
};

export default MealPlanner;
