import axios from 'axios';

const SPOONACULAR_API = 'https://api.spoonacular.com';

const constructQueryString = (params) => {
  let queryString = `?apiKey=e1f556e241884f5e8493a5f17cb629bd&number=1&ranking=1`;
  
  for(const key in params) {
    queryString +=`&${key}=${params[key]}`
  }
  
  return queryString;
}

export const getRequest = async (url, queryParams) => {
  try {
    const response = await axios.get(`${SPOONACULAR_API}${url}${queryParams ? constructQueryString(queryParams) : ''}`)

    return response.data;
  }
  catch(err) {
    console.error(err.toJSON());
  }
}