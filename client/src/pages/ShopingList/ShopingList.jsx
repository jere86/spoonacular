import { useContext, useState } from "react";
import { postRequest } from "../../helpers/http";
import styles from "./ShopingList.module.scss";
import { AppContext } from "../../context/appContext";
import { v4 } from "uuid";
import axios from "axios";

const ShopingList = () => {
  const { currentUser, getUsers } = useContext(AppContext);
  const [shopingListData, setShopingListData] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [saveButton, setSaveButton] = useState(true);
  const [delButton, setDelButton] = useState(false);

  const getSLData = async (e) => {
    e.preventDefault();
    const SLData = await postRequest(
      `mealplanner/${currentUser.userData.username}/shopping-list/${startDate}/${endDate}?hash=${currentUser.userData.hash}`,
      "&"
    );
    setShopingListData(SLData);
  };

  const saveSL = async (SL) => {
    await axios.patch(`http://localhost:5000/users/${currentUser._id}`, {
      shopingLists: [...currentUser.shopingLists, SL],
    });
    getUsers();
  };

  const delSL = async (SL) => {
    await axios.patch(`http://localhost:5000/users/${currentUser._id}`, {
      shopingLists: currentUser.shopingLists.filter(
        (shopingList) => shopingList !== SL
      ),
    });
    getUsers();
  };

  const dateFormat = (time) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(time * 1000);
  };

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
        {"-"}
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            e.preventDefault();
            setEndDate(e.target.value);
          }}
        />
        <button
          onClick={(e) => {
            getSLData(e);
            setSaveButton(true);
            setDelButton(false);
          }}
        >
          Generate Shoping List
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShopingListData();
          }}
        >
          Clear Shoping List
        </button>
        <button
          className={styles.saveSLbutton}
          onClick={(e) => {
            e.preventDefault();
            setShowSaved(!showSaved);
          }}
        >
          Saved Shoping Lists
        </button>
      </form>
      {showSaved && (
        <>
          {currentUser.shopingLists.map((SL) => {
            return (
              <div
                key={v4()}
                className={styles.savedSL}
                onClick={(e) => {
                  e.preventDefault();
                  setShopingListData(SL);
                  setSaveButton(false);
                  setDelButton(true);
                }}
              >
                <span>{dateFormat(SL.startDate)}</span>
                {" - "}
                <span>{dateFormat(SL.endDate)}</span>
              </div>
            );
          })}
        </>
      )}
      {shopingListData && (
        <>
          <div className={styles.fromToDate}>
            <span>{dateFormat(shopingListData.startDate)}</span>
            {" - "}
            <span>{dateFormat(shopingListData.endDate)}</span>
            {saveButton && (
              <button
                className={styles.saveSL}
                onClick={() => saveSL(shopingListData)}
                title="Save Shoping List"
              >
                <svg viewBox="0 0 24 24" fill="#000000">
                  <path d="M14,10h-1V9c0-0.6-0.4-1-1-1s-1,0.4-1,1v1h-1c-0.6,0-1,0.4-1,1s0.4,1,1,1h1v1c0,0.6,0.4,1,1,1s1-0.4,1-1v-1h1 c0.6,0,1-0.4,1-1S14.6,10,14,10z"></path>{" "}
                  <path d="M19,3h-1H6H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3 l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z M17,19.1C17,19.1,17,19.1,17,19.1 l-3.9-2.6c-0.3-0.2-0.7-0.3-1.1-0.3s-0.8,0.1-1.1,0.3L7,19.1V5h10L17,19.1L17,19.1z"></path>
                </svg>
              </button>
            )}
            {delButton && (
              <button
                className={styles.delSL}
                onClick={() => {
                  delSL(shopingListData);
                  setShopingListData();
                }}
                title="Delete Shoping List"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10 11V17"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M14 11V17"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecL="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M4 7H20"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecL="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecL="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecL="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            )}
          </div>
          <div className={styles.aisles}>
            {shopingListData.aisles.map((aisle) => {
              return (
                <div key={v4()} className={styles.aisle}>
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
          </div>
        </>
      )}
    </div>
  );
};

export default ShopingList;
