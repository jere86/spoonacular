import { useContext, useState } from "react";
import { postRequest } from "../../helpers/http";
import styles from "./ShopingList.module.scss";
import { AppContext } from "../../context/appContext";
import { v4 } from "uuid";

const ShopingList = () => {
  const { currentUser } = useContext(AppContext);
  const [shopingListData, setShopingListData] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const getSLData = async (e) => {
    e.preventDefault();
    const SLData = await postRequest(
      `mealplanner/${currentUser.userData.username}/shopping-list/${startDate}/${endDate}?hash=${currentUser.userData.hash}`,
      "&"
    );
    setShopingListData(SLData);
  };

  console.log(shopingListData);

  return (
    <div className={styles.shopingList}>
      <form>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            e.preventDefault();
            setStartDate(e.target.value);
          }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            e.preventDefault();
            setEndDate(e.target.value);
          }}
        />
        <button onClick={(e) => getSLData(e)}>Generate Shoping List</button>
      </form>
      {shopingListData && (
        <>
          <div>
            <span>
              {new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(shopingListData.startDate * 1000)}
            </span>{" "}
            -{" "}
            <span>
              {new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(shopingListData.endDate * 1000)}
            </span>
          </div>
          {shopingListData.aisles.map((aisle) => {
            return (
              <div key={v4()}>
                <h2>{aisle.aisle}</h2>
                <ul>
                  {aisle.items.map((item) => {
                    return (
                      <li key={v4()}>
                        <span>{item.name}: </span>
                        {item.measures.metric.amount}{" "}
                        {item.measures.metric.unit.toLowerCase()}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default ShopingList;
