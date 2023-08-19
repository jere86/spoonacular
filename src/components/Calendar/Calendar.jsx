import { useContext, useEffect, useState } from "react";

import styles from "./Calendar.module.scss";
import {
  addMealRequest,
  deleteMealRequest,
  getRequest,
  getWMPRequest,
} from "../../helpers/http";
import { AppContext } from "../../context/appContext";

import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const { currentUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [buttonStates, setButtonStates] = useState({});
  const [buttonIndex, setButtonIndex] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [recipeList, setRecipeList] = useState();
  const [weekMPData, setWeekMPData] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleButtonClick = (dateKey, buttonIndex, alsoDo) => {
    setButtonIndex(buttonIndex);
    if (alsoDo) {
      setRecipeList();
      setSearchValue("");
      getWeekMealPlanData();
    }
    setButtonStates((prevState) => {
      const prevButtonStates = prevState[dateKey] || [false, false, false];
      const newButtonStates = [...prevButtonStates];
      newButtonStates[buttonIndex] = !prevButtonStates[buttonIndex];
      return {
        ...prevState,
        [dateKey]: newButtonStates,
      };
    });
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
            number: 100,
            // addRecipeInformation: true,
          });
          setRecipeList(recipes);
          setShowFavorites(false);
          setCurrentPage(1);
        }
      };

      const addToMealPlan = async (e, recipe) => {
        e.preventDefault();

        const timestamp = new Date(dateKey).getTime() / 1000;
        await addMealRequest(
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

        setShowFavorites(false);
        handleButtonClick(dateKey, buttonIndex, 1);
      };

      const deleteFromMP = async (e, itemId) => {
        e.preventDefault();

        await deleteMealRequest(
          `mealplanner/${currentUser.userData.username}/items/${itemId}?hash=${currentUser.userData.hash}`
        );
        getWeekMealPlanData();
      };

      const daydata = weekMPData.find(
        (day) => day.date === new Date(dateKey).getTime() / 1000
      );

      const resultList = (recipes) => {
        const itemsPerPage = 10;
        const totalPages = Math.ceil(recipes.length / itemsPerPage);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const handleNextPage = () => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
        };

        const handlePrevPage = () => {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        };

        const visibleResults = recipes.slice(startIndex, endIndex);

        return (
          <div className={styles.recipesMP}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              <svg viewBox="0 0 24 24">
                <path d="m4.431 12.822 13 9A1 1 0 0 0 19 21V3a1 1 0 0 0-1.569-.823l-13 9a1.003 1.003 0 0 0 0 1.645z"></path>
              </svg>
            </button>
            <div className={styles.recipesListMP}>
              {visibleResults.map((recipe) => {
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
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <svg viewBox="0 0 24 24" transform="rotate(180)">
                <path d="m4.431 12.822 13 9A1 1 0 0 0 19 21V3a1 1 0 0 0-1.569-.823l-13 9a1.003 1.003 0 0 0 0 1.645z"></path>
              </svg>
            </button>
          </div>
        );
      };

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
                  return (
                    <div
                      className={styles.mealItem}
                      style={{ backgroundImage: `url(${day.value.image})` }}
                      key={v4()}
                    >
                      <button
                        className={styles.recipeInfo}
                        onClick={() => {
                          navigate(`/info/${day.value.id}`);
                        }}
                      >
                        <svg viewBox="-1.55 -1.55 27.1 27.1">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.25 11C10.25 10.4477 10.6977 10 11.25 10H12.75C13.3023 10 13.75 10.4477 13.75 11V18C13.75 18.5523 13.3023 19 12.75 19H11.25C10.6977 19 10.25 18.5523 10.25 18V11ZM14 7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7C10 8.10457 10.8954 9 12 9C13.1046 9 14 8.10457 14 7Z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        className={styles.deleteFromMP}
                        onClick={(e) => {
                          deleteFromMP(e, day.id);
                        }}
                      >
                        <svg viewBox="0 0 32 32">
                          <path d="M16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM21.961 12.209c0.244-0.244 0.244-0.641 0-0.885l-1.328-1.327c-0.244-0.244-0.641-0.244-0.885 0l-3.761 3.761-3.761-3.761c-0.244-0.244-0.641-0.244-0.885 0l-1.328 1.327c-0.244 0.244-0.244 0.641 0 0.885l3.762 3.762-3.762 3.76c-0.244 0.244-0.244 0.641 0 0.885l1.328 1.328c0.244 0.244 0.641 0.244 0.885 0l3.761-3.762 3.761 3.762c0.244 0.244 0.641 0.244 0.885 0l1.328-1.328c0.244-0.244 0.244-0.641 0-0.885l-3.762-3.76 3.762-3.762z"></path>
                        </svg>
                      </button>
                      <p>{day.value.title}</p>
                    </div>
                  );
                })}
            <button
              className={styles.addButton}
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
                  return (
                    <div
                      className={styles.mealItem}
                      style={{ backgroundImage: `url(${day.value.image})` }}
                      key={v4()}
                    >
                      <button
                        className={styles.recipeInfo}
                        onClick={() => {
                          navigate(`/info/${day.value.id}`);
                        }}
                      >
                        <svg viewBox="-1.55 -1.55 27.1 27.1">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.25 11C10.25 10.4477 10.6977 10 11.25 10H12.75C13.3023 10 13.75 10.4477 13.75 11V18C13.75 18.5523 13.3023 19 12.75 19H11.25C10.6977 19 10.25 18.5523 10.25 18V11ZM14 7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7C10 8.10457 10.8954 9 12 9C13.1046 9 14 8.10457 14 7Z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        className={styles.deleteFromMP}
                        onClick={(e) => {
                          deleteFromMP(e, day.id);
                        }}
                      >
                        <svg viewBox="0 0 32 32">
                          <path d="M16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM21.961 12.209c0.244-0.244 0.244-0.641 0-0.885l-1.328-1.327c-0.244-0.244-0.641-0.244-0.885 0l-3.761 3.761-3.761-3.761c-0.244-0.244-0.641-0.244-0.885 0l-1.328 1.327c-0.244 0.244-0.244 0.641 0 0.885l3.762 3.762-3.762 3.76c-0.244 0.244-0.244 0.641 0 0.885l1.328 1.328c0.244 0.244 0.641 0.244 0.885 0l3.761-3.762 3.761 3.762c0.244 0.244 0.641 0.244 0.885 0l1.328-1.328c0.244-0.244 0.244-0.641 0-0.885l-3.762-3.76 3.762-3.762z"></path>
                        </svg>
                      </button>
                      <p>{day.value.title}</p>
                    </div>
                  );
                })}
            <button
              className={styles.addButton}
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
                  return (
                    <div
                      className={styles.mealItem}
                      style={{ backgroundImage: `url(${day.value.image})` }}
                      key={v4()}
                    >
                      <button
                        className={styles.recipeInfo}
                        onClick={() => {
                          navigate(`/info/${day.value.id}`);
                        }}
                      >
                        <svg viewBox="-1.55 -1.55 27.1 27.1">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.25 11C10.25 10.4477 10.6977 10 11.25 10H12.75C13.3023 10 13.75 10.4477 13.75 11V18C13.75 18.5523 13.3023 19 12.75 19H11.25C10.6977 19 10.25 18.5523 10.25 18V11ZM14 7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7C10 8.10457 10.8954 9 12 9C13.1046 9 14 8.10457 14 7Z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        className={styles.deleteFromMP}
                        onClick={(e) => {
                          deleteFromMP(e, day.id);
                        }}
                      >
                        <svg viewBox="0 0 32 32">
                          <path d="M16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM21.961 12.209c0.244-0.244 0.244-0.641 0-0.885l-1.328-1.327c-0.244-0.244-0.641-0.244-0.885 0l-3.761 3.761-3.761-3.761c-0.244-0.244-0.641-0.244-0.885 0l-1.328 1.327c-0.244 0.244-0.244 0.641 0 0.885l3.762 3.762-3.762 3.76c-0.244 0.244-0.244 0.641 0 0.885l1.328 1.328c0.244 0.244 0.641 0.244 0.885 0l3.761-3.762 3.761 3.762c0.244 0.244 0.641 0.244 0.885 0l1.328-1.328c0.244-0.244 0.244-0.641 0-0.885l-3.762-3.76 3.762-3.762z"></path>
                        </svg>
                      </button>
                      <p>{day.value.title}</p>
                    </div>
                  );
                })}
            <button
              className={styles.addButton}
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
                    handleButtonClick(dateKey, buttonIndex, 1);
                    setShowFavorites(false);
                  }}
                >
                  <svg viewBox="1 1 21 21" fill="none">
                    <path
                      d="M12.0004 9.5L17.0004 14.5M17.0004 9.5L12.0004 14.5M4.50823 13.9546L7.43966 17.7546C7.79218 18.2115 7.96843 18.44 8.18975 18.6047C8.38579 18.7505 8.6069 18.8592 8.84212 18.9253C9.10766 19 9.39623 19 9.97336 19H17.8004C18.9205 19 19.4806 19 19.9084 18.782C20.2847 18.5903 20.5907 18.2843 20.7824 17.908C21.0004 17.4802 21.0004 16.9201 21.0004 15.8V8.2C21.0004 7.0799 21.0004 6.51984 20.7824 6.09202C20.5907 5.71569 20.2847 5.40973 19.9084 5.21799C19.4806 5 18.9205 5 17.8004 5H9.97336C9.39623 5 9.10766 5 8.84212 5.07467C8.6069 5.14081 8.38579 5.2495 8.18975 5.39534C7.96843 5.55998 7.79218 5.78846 7.43966 6.24543L4.50823 10.0454C3.96863 10.7449 3.69883 11.0947 3.59505 11.4804C3.50347 11.8207 3.50347 12.1793 3.59505 12.5196C3.69883 12.9053 3.96863 13.2551 4.50823 13.9546Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
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
                  meal to{" "}
                  <span>
                    {currentDay
                      .toLocaleDateString("en-US", {
                        month: "long",
                      })
                      .toUpperCase()}{" "}
                    {getOrdinal(currentDay.getDate())}
                  </span>
                </p>
                <div className={styles.searchbar}>
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
                  <button
                    className={styles.addFromFav}
                    onClick={() => {
                      setShowFavorites(!showFavorites);
                      setCurrentPage(1);
                    }}
                  >
                    <svg viewBox="-4 0 55 45">
                      <path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z" />
                    </svg>
                  </button>
                </div>
                {showFavorites
                  ? currentUser.favorites && resultList(currentUser.favorites)
                  : recipeList &&
                    searchValue !== "" &&
                    resultList(recipeList.results)}
              </div>
            </div>
          )}
        </li>
      );
    });

    return <ul>{days}</ul>;
  };

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
        <button onClick={handlePreviousWeek}>
          <svg viewBox="0 0 512 512">
            <path d="M154.52,265.848l90.964,69.014c2.329,1.766,4.674,2.702,6.78,2.702c2.148,0,4.022-0.974,5.276-2.741 c1.199-1.688,1.807-3.99,1.807-6.844v-26.424c0-6.952,5.656-12.608,12.607-12.608h75.036c8.705,0,15.788-7.085,15.788-15.788 v-34.313c0-8.703-7.083-15.788-15.788-15.788h-75.036c-6.951,0-12.607-5.656-12.607-12.608v-26.425 c0-7.065-3.659-9.584-7.082-9.584c-2.106,0-4.451,0.936-6.78,2.702l-90.964,69.014c-3.416,2.59-5.297,6.087-5.297,9.849 C149.223,259.762,151.103,263.259,154.52,265.848z"></path>{" "}
            <path d="M256,0C114.842,0,0.002,114.84,0.002,256S114.842,512,256,512c141.158,0,255.998-114.84,255.998-256 S397.158,0,256,0z M256,66.785c104.334,0,189.216,84.879,189.216,189.215S360.334,445.215,256,445.215S66.783,360.336,66.783,256 S151.667,66.785,256,66.785z"></path>
          </svg>
        </button>
        {monthName()}
        <button onClick={handleNextWeek}>
          <svg viewBox="0 0 512 512" transform="rotate(180)">
            <path d="M154.52,265.848l90.964,69.014c2.329,1.766,4.674,2.702,6.78,2.702c2.148,0,4.022-0.974,5.276-2.741 c1.199-1.688,1.807-3.99,1.807-6.844v-26.424c0-6.952,5.656-12.608,12.607-12.608h75.036c8.705,0,15.788-7.085,15.788-15.788 v-34.313c0-8.703-7.083-15.788-15.788-15.788h-75.036c-6.951,0-12.607-5.656-12.607-12.608v-26.425 c0-7.065-3.659-9.584-7.082-9.584c-2.106,0-4.451,0.936-6.78,2.702l-90.964,69.014c-3.416,2.59-5.297,6.087-5.297,9.849 C149.223,259.762,151.103,263.259,154.52,265.848z"></path>{" "}
            <path d="M256,0C114.842,0,0.002,114.84,0.002,256S114.842,512,256,512c141.158,0,255.998-114.84,255.998-256 S397.158,0,256,0z M256,66.785c104.334,0,189.216,84.879,189.216,189.215S360.334,445.215,256,445.215S66.783,360.336,66.783,256 S151.667,66.785,256,66.785z"></path>
          </svg>
        </button>
      </div>
      {renderCalendar()}
    </div>
  );
};

export default Calendar;
