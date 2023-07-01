import axios from "axios";

const SPOONACULAR_API = "https://api.spoonacular.com/";
const API_KEY = "9bd11a9d9e5a4727b2d9fed3489fd620";

// e1f556e241884f5e8493a5f17cb629bd
// 9bd11a9d9e5a4727b2d9fed3489fd620
// ded260b7a9ab44fabc69e96ad8b8363e

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
