import React, { useEffect, useState } from "react";

import styles from "./Calendar.module.scss";

const Calendar = () => {
  const [buttonStates, setButtonStates] = useState({});

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

  const handleButtonClick = (dateKey, buttonIndex) => {
    const correctDate = new Date(dateKey);
    correctDate.setDate(correctDate.getDate() + 1);
    const correctDateKey = correctDate.toISOString().split("T")[0];

    const prevButtonStates = buttonStates[correctDateKey] || [
      false,
      false,
      false,
    ];
    const newButtonStates = [...prevButtonStates];
    newButtonStates[buttonIndex] = !prevButtonStates[buttonIndex];

    setButtonStates((prevState) => ({
      ...prevState,
      [correctDateKey]: newButtonStates,
    }));
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
    const days = [];
    let currentDateIterator = new Date(currentWeekStartDate);

    for (let i = 0; i < 7; i++) {
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
      const formattedDate = currentDateIterator.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });

      const handleClick = (btnDateKey, buttonIndex) => {
        handleButtonClick(btnDateKey, buttonIndex);
      };

      days.push(
        <li key={currentDateIterator.getTime()}>
          <div className={styles.dayName}>{dayName}</div>
          <div className={styles.formattedDate}>{formattedDate}</div>
          <div className={styles.breakfast}>
            <button
              className={buttonStatesForDate[0] ? styles.active : ""}
              onClick={() => handleClick(dateKey, 0)}
            >
              +
            </button>
          </div>
          <div className={styles.lunch}>
            <button
              className={buttonStatesForDate[1] ? styles.active : ""}
              onClick={() => handleClick(dateKey, 1)}
            >
              +
            </button>
          </div>
          <div className={styles.dinner}>
            <button
              className={buttonStatesForDate[2] ? styles.active : ""}
              onClick={() => handleClick(dateKey, 2)}
            >
              +
            </button>
          </div>
        </li>
      );

      currentDateIterator.setDate(currentDateIterator.getDate() + 1);
    }

    return <ul>{days}</ul>;
  };

  useEffect(() => {
    console.log(buttonStates);
  }, [buttonStates]);

  return (
    <div className={styles.calendar}>
      <div className={styles.weekNav}>
        <button onClick={handlePreviousWeek}>Previous Week</button>
        <button onClick={handleNextWeek}>Next Week</button>
      </div>
      {renderCalendar()}
    </div>
  );
};

export default Calendar;
