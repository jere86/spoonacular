import { useEffect, useState } from "react";

import styles from "./Calendar.module.scss";

const Calendar = () => {
  const [buttonStates, setButtonStates] = useState({});
  const [buttonIndex, setButtonIndex] = useState();

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

  const handleButtonClick = (dateKey, buttonIndex, isInAddCard) => {
    setButtonIndex(buttonIndex);
    if (isInAddCard) {
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

      const showNewDiv = buttonStatesForDate.includes(true);

      return (
        <li key={currentDateIterator.getTime()}>
          <div className={styles.dayName}>
            {dayName}
            <span className={styles.line}></span>
          </div>
          <div className={styles.dayNumber}>{dayNumber}</div>
          <div className={styles.breakfast}>
            <button
              // className={!buttonStatesForDate[0] ? styles.active : ""}
              onClick={() => handleButtonClick(dateKey, 0)}
            >
              +
            </button>
          </div>
          <div className={styles.lunch}>
            <button
              // className={!buttonStatesForDate[1] ? styles.active : ""}
              onClick={() => handleButtonClick(dateKey, 1)}
            >
              +
            </button>
          </div>
          <div className={styles.dinner}>
            <button
              // className={!buttonStatesForDate[2] ? styles.active : ""}
              onClick={() => handleButtonClick(dateKey, 2)}
            >
              +
            </button>
          </div>
          {showNewDiv && (
            <div className={styles.newDiv}>
              <div className={styles.addCard}>
                <button
                  onClick={() => handleButtonClick(dateKey, buttonIndex, true)}
                >
                  X
                </button>
              </div>
            </div>
          )}
        </li>
      );
    });

    return <ul>{days}</ul>;
  };

  useEffect(() => {
    console.log(buttonStates);
  }, [buttonStates]);

  return (
    <div className={styles.calendar}>
      <div className={styles.weekNav}>
        <button onClick={handlePreviousWeek}>Previous Week</button>
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
        <button onClick={handleNextWeek}>Next Week</button>
      </div>
      {renderCalendar()}
    </div>
  );
};

export default Calendar;
