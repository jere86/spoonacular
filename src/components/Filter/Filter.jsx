import styles from "./Filter.module.scss";

const Filter = ({ filterName, onChange, options, emptySpot }) => {
  return (
    <div className={styles.filter} id={filterName}>
      <label htmlFor={filterName}>{filterName}:</label>
      <select id={filterName} onChange={onChange}>
        {emptySpot && <option value={null}></option>}
        {options.map((option) => {
          return (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Filter;
