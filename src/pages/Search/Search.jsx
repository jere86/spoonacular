import React, { useState } from 'react';

import styles from './Search.module.scss';

import RecipesList from '../../components/RecipesList/RecipesList';
import { getRequest } from '../../helpers/http';

const Search = () => {
  const [recipesData, setRecipesData] = useState(null);
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  }
  
  const getRecipesData = async () => {  
    if (text !== ""){
      const ingredients = text.split(/ |,|, /).join(",+");

      const recipes = await getRequest('/recipes/findByIngredients', {
        ingredients: ingredients,
        number: 1,
        ranking: 1
      })

      setRecipesData(recipes);
    }
    else {
      setRecipesData(null);
    }
  }

  return (  
    <>
      <div className={styles.search}>
        <label>Enter one or more ingredients:</label>
        <input
          type='text'
          placeholder='e.g. "egg, butter, ham"'
          spellCheck={false}
          onChange={handleChange} />
        <button onClick={getRecipesData}>Get Recipes</button>
      </div>
      {recipesData && <RecipesList recipesData={recipesData}/>}
    </>    
  );
}

export default Search