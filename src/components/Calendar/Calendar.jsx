import { useContext, useEffect, useState } from "react";

import styles from "./Calendar.module.scss";
import { addMealRequest, getRequest, getWMPRequest } from "../../helpers/http";
import { AppContext } from "../../context/appContext";

import { v4 } from "uuid";

const Calendar = () => {
  const { currentUser } = useContext(AppContext);
  const [buttonStates, setButtonStates] = useState({});
  const [buttonIndex, setButtonIndex] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [recipeList, setRecipeList] = useState();
  const [weekMPData, setWeekMPData] = useState([]);

  useEffect(() => {
    if (searchValue === "") {
      setRecipeList();
    }
  }, [searchValue]);

  const getStartOfWeek = (date) => {
    const newDate = new Date(date);
    const dayOfWeek = newDate.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    newDate.setDate(date.getDate() - diff);
    return newDate;
  };

  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(
    getStartOfWeek(new Date())
  );

  const getWeekMealPlanData = async () => {
    const weekMealPlanData = await getWMPRequest(
      `mealplanner/${currentUser.userData.username}/week/${
        new Date(currentWeekStartDate).toISOString().split("T")[0]
      }?hash=${currentUser.userData.hash}`
    );
    setWeekMPData(weekMealPlanData.days);
  };

  useEffect(() => {
    getWeekMealPlanData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeekStartDate]);

  const handleButtonClick = (dateKey, buttonIndex, isInAddCard) => {
    setButtonIndex(buttonIndex);
    if (isInAddCard) {
      setRecipeList();
      setSearchValue("");
      getWeekMealPlanData();

      setButtonStates((prevState) => {
        const newButtonStates = { ...prevState };
        const prevButtonStates = newButtonStates[dateKey] || [
          false,
          false,
          false,
        ];
        prevButtonStates[buttonIndex] = false;
        newButtonStates[dateKey] = prevButtonStates;
        return newButtonStates;
      });
    } else {
      setButtonStates((prevState) => {
        const prevButtonStates = prevState[dateKey] || [false, false, false];
        const newButtonStates = [...prevButtonStates];
        newButtonStates[buttonIndex] = !prevButtonStates[buttonIndex];
        return {
          ...prevState,
          [dateKey]: newButtonStates,
        };
      });
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStartDate((prevStartDate) => {
      const prevWeekStartDate = new Date(prevStartDate);
      prevWeekStartDate.setDate(prevWeekStartDate.getDate() - 7);
      return getStartOfWeek(prevWeekStartDate);
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStartDate((prevStartDate) => {
      const nextWeekStartDate = new Date(prevStartDate);
      nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7);
      return getStartOfWeek(nextWeekStartDate);
    });
  };

  const getOrdinal = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const relevantDigits = number % 100;
    const suffix =
      suffixes[(relevantDigits - 20) % 10] ||
      suffixes[relevantDigits] ||
      suffixes[0];
    return number + suffix;
  };

  const [showFavorites, setShowFavorites] = useState(false);

  const renderCalendar = () => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const currentDateIterator = new Date(currentWeekStartDate);
      currentDateIterator.setDate(currentDateIterator.getDate() + index);

      const currentDay = new Date(currentDateIterator);
      const dateKey = currentDay.toISOString().split("T")[0];
      const buttonStatesForDate = buttonStates[dateKey] || [
        false,
        false,
        false,
      ];

      const dayName = currentDateIterator.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const dayNumber = currentDateIterator.toLocaleDateString("en-US", {
        day: "numeric",
      });

      const handleInputChange = (event) => {
        setSearchValue(event.target.value);
      };

      const handleSearch = async (e) => {
        e.preventDefault();

        if (searchValue !== "") {
          const recipes = await getRequest("recipes/complexSearch", {
            query: searchValue,
            number: 12,
            // addRecipeInformation: true,
          });
          setRecipeList(recipes);
        }
      };

      const addToMealPlan = (e, recipe) => {
        e.preventDefault();
        setShowFavorites(false);

        const timestamp = new Date(dateKey).getTime() / 1000;
        addMealRequest(
          `mealplanner/${currentUser.userData.username}/items/?hash=${currentUser.userData.hash}`,
          {
            date: timestamp,
            slot: buttonIndex + 1,
            position: 1,
            type: "RECIPE",
            value: {
              id: recipe.id,
              servings: 1,
              title: recipe.title,
              image: recipe.image,
            },
          }
        );
      };

      const daydata = weekMPData.find(
        (day) => day.date === new Date(dateKey).getTime() / 1000
      );

      return (
        <li key={currentDateIterator.getTime()}>
          <div className={styles.dayName}>
            {dayName}
            <span className={styles.line}></span>
          </div>
          <div className={styles.dayNumber}>{dayNumber}</div>
          <div className={styles.breakfast}>
            {daydata !== undefined &&
              daydata.items
                .filter((item) => item.slot === 1)
                .map((day) => {
                  return <p key={v4()}>{day.value.title}</p>;
                })}
            <button
              // className={!buttonStatesForDate[0] ? styles.active : ""}
              onClick={() => handleButtonClick(dateKey, 0)}
            >
              +
            </button>
          </div>
          <div className={styles.lunch}>
            {daydata !== undefined &&
              daydata.items
                .filter((item) => item.slot === 2)
                .map((day) => {
                  return <p key={v4()}>{day.value.title}</p>;
                })}
            <button
              // className={!buttonStatesForDate[1] ? styles.active : ""}
              onClick={() => handleButtonClick(dateKey, 1)}
            >
              +
            </button>
          </div>
          <div className={styles.dinner}>
            {daydata !== undefined &&
              daydata.items
                .filter((item) => item.slot === 3)
                .map((day) => {
                  return <p key={v4()}>{day.value.title}</p>;
                })}
            <button
              // className={!buttonStatesForDate[2] ? styles.active : ""}
              onClick={() => handleButtonClick(dateKey, 2)}
            >
              +
            </button>
          </div>
          {buttonStatesForDate[buttonIndex] && (
            <div className={styles.newDiv}>
              <div className={styles.addCard}>
                <button
                  className={styles.exitbtn}
                  onClick={() => {
                    handleButtonClick(dateKey, buttonIndex, true);
                    setShowFavorites(false);
                  }}
                >
                  X
                </button>
                <p>
                  add{" "}
                  <span>
                    {buttonIndex === 0
                      ? "BREAKFAST"
                      : buttonIndex === 1
                      ? "LUNCH"
                      : buttonIndex === 2
                      ? "DINNER"
                      : ""}
                  </span>{" "}
                  to{" "}
                  <span>
                    {currentDay
                      .toLocaleDateString("en-US", {
                        month: "long",
                      })
                      .toUpperCase()}{" "}
                    {getOrdinal(currentDay.getDate())}
                  </span>
                </p>

                <form>
                  <input
                    type="text"
                    placeholder="Search for recipe"
                    value={searchValue}
                    onChange={handleInputChange}
                  />
                  <button onClick={handleSearch}>
                    <svg viewBox="0 0 512 512">
                      <path d="M172.625,102.4c-42.674,0-77.392,34.739-77.392,77.438c0,5.932,4.806,10.74,10.733,10.74 c5.928,0,10.733-4.808,10.733-10.74c0-30.856,25.088-55.959,55.926-55.959c5.928,0,10.733-4.808,10.733-10.74 C183.358,107.208,178.553,102.4,172.625,102.4z"></path>
                      <path d="M361.657,301.511c19.402-30.436,30.645-66.546,30.645-105.244C392.302,88.036,304.318,0,196.151,0 c-38.676,0-74.765,11.25-105.182,30.663C66.734,46.123,46.11,66.759,30.659,91.008C11.257,121.444,0,157.568,0,196.267 c0,108.217,87.998,196.266,196.151,196.266c38.676,0,74.779-11.264,105.197-30.677C325.582,346.396,346.206,325.76,361.657,301.511 z M259.758,320.242c-19.075,9.842-40.708,15.403-63.607,15.403c-76.797,0-139.296-62.535-139.296-139.378 c0-22.912,5.558-44.558,15.394-63.644c13.318-25.856,34.483-47.019,60.323-60.331c19.075-9.842,40.694-15.403,63.578-15.403 c76.812,0,139.296,62.521,139.296,139.378c0,22.898-5.558,44.53-15.394,63.616C306.749,285.739,285.598,306.916,259.758,320.242z"></path>
                      <path d="M499.516,439.154L386.275,326.13c-16.119,23.552-36.771,44.202-60.309,60.345l113.241,113.024 c8.329,8.334,19.246,12.501,30.148,12.501c10.916,0,21.833-4.167,30.162-12.501C516.161,482.83,516.161,455.822,499.516,439.154z"></path>
                    </svg>
                  </button>
                </form>
                {recipeList && searchValue !== "" && (
                  <div className={styles.recipesMP}>
                    {recipeList.results.map((recipe) => {
                      return (
                        <div className={styles.recipeMP} key={v4()}>
                          <div className={styles.imageMP}>
                            <img
                              src={recipe.image}
                              alt="meal"
                              className={styles.recipeImageMP}
                            />
                            <button onClick={(e) => addToMealPlan(e, recipe)}>
                              <svg viewBox="0 0 20 20">
                                <path d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm14 .069a1 1 0 01-1 1h-2.931V14a1 1 0 11-2 0v-2.931H6a1 1 0 110-2h3.069V6a1 1 0 112 0v3.069H14a1 1 0 011 1z" />
                              </svg>
                            </button>
                          </div>
                          <p>{recipe.title}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                <hr />
                <button
                  className={styles.addFromFav}
                  onClick={() => {
                    setShowFavorites(!showFavorites);
                  }}
                >
                  add from Favorites
                </button>
                {showFavorites && currentUser.favorites && (
                  <div className={styles.recipesMP}>
                    {currentUser.favorites.map((recipe) => {
                      return (
                        <div className={styles.recipeMP} key={v4()}>
                          <div className={styles.imageMP}>
                            <img
                              src={recipe.image}
                              alt="meal"
                              className={styles.recipeImageMP}
                            />
                            <button onClick={(e) => addToMealPlan(e, recipe)}>
                              <svg viewBox="0 0 20 20">
                                <path d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm14 .069a1 1 0 01-1 1h-2.931V14a1 1 0 11-2 0v-2.931H6a1 1 0 110-2h3.069V6a1 1 0 112 0v3.069H14a1 1 0 011 1z" />
                              </svg>
                            </button>
                          </div>
                          <p>{recipe.title}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </li>
      );
    });

    return <ul>{days}</ul>;
  };

  // console.log(weekMPData);

  // useEffect(() => {
  //   console.log(buttonStates);
  // }, [buttonStates]);

  // useEffect(() => {
  //   console.log(recipeList);
  // }, [recipeList]);

  const monthName = () => {
    return (
      <div className={styles.monthName}>
        {currentWeekStartDate.toLocaleDateString("en-US", {
          month: "long",
        })}
        {currentWeekStartDate.getMonth() !==
        new Date(
          currentWeekStartDate.getFullYear(),
          currentWeekStartDate.getMonth(),
          currentWeekStartDate.getDate() + 6
        ).getMonth() ? (
          <span>
            {" "}
            /{" "}
            {new Date(
              currentWeekStartDate.getFullYear(),
              currentWeekStartDate.getMonth(),
              currentWeekStartDate.getDate() + 6
            ).toLocaleDateString("en-US", {
              month: "long",
            })}
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.weekNav}>
        <button onClick={handlePreviousWeek}>Previous Week</button>
        {monthName()}
        <button onClick={handleNextWeek}>Next Week</button>
      </div>
      {renderCalendar()}
    </div>
  );
};

export default Calendar;
