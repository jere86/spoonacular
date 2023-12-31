import axios from "axios";

const SPOONACULAR_API = "https://api.spoonacular.com/";
const API_KEY = "9bd11a9d9e5a4727b2d9fed3489fd620";

// 9bd11a9d9e5a4727b2d9fed3489fd620
// e1f556e241884f5e8493a5f17cb629bd
// beefcc8fafcb437d9863fe9746cb75b2
// 1f97c3a35c4b4fffa5d165a9658983be

const constructQueryString = (params) => {
  let queryString = "";

  for (const key in params) {
    queryString += `&${key}=${params[key]}`;
  }

  return queryString;
};

export const getRequest = async (url, queryParams) => {
  try {
    const response = await axios.get(
      `${SPOONACULAR_API}${url}?apiKey=${API_KEY}${
        queryParams ? constructQueryString(queryParams) : ""
      }`
    );

    return response.data;
  } catch (err) {
    console.error(err.toJSON());
  }
};

export const getWMPRequest = async (url) => {
  try {
    const response = await axios.get(
      `${SPOONACULAR_API}${url}&apiKey=${API_KEY}`
    );

    return response.data;
  } catch (err) {
    console.error(err.toJSON());
  }
};

export const postRequest = async (url, x, data) => {
  try {
    const response = await axios.post(
      `${SPOONACULAR_API}${url}${x}apiKey=${API_KEY}`,
      data
    );

    return response.data;
  } catch (err) {
    console.error(err.toJSON());
  }
};

export const addMealRequest = (url, data) => {
  return axios.post(`${SPOONACULAR_API}${url}&apiKey=${API_KEY}`, data);
};

export const deleteMealRequest = (url) => {
  return axios.delete(`${SPOONACULAR_API}${url}&apiKey=${API_KEY}`);
};
