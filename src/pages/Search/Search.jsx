import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/appContext";

import styles from './Search.module.scss';

import { getRequest } from '../../helpers/http';
import { cuisineOptions, dietOptions, intolerancesOptions, typeOptions } from '../../data/filterOptions';
import routes from "../../data/routes";

import RecipesList from '../../components/RecipesList/RecipesList';
import Filter from '../../components/Filter/Filter';

const Search = () => {
  const { recipesData, setRecipesData } = useContext(AppContext);
  const [text, setText] = useState("");
  const [cuisine, setCuisine] = useState(null);
  const [mealtype, setMealType] = useState(null);
  const [diet, setDiet] = useState(null);
  const [intolerances, setIntolerances] = useState(null);
  const navigate = useNavigate();

  const handleIngredients = (e) => {
    setText(e.target.value);
  }

  const handleCusine = (e) => {
    setCuisine(e.target.value);
  }
  
  const handleMealType = (e) => {
    setMealType(e.target.value);
  }
  
  const handleDiet = (e) => {
    setDiet(e.target.value);
  }
  
  const handleIntolerances = (e) => {
    setIntolerances(e.target.value);
  }
  
  const getRecipesData = async () => {  
    if (text !== ""){
      const ingredients = text.split(/ |,|, /).join(",+");

      const recipes = await getRequest('/recipes/complexSearch', {
        number: 2,
        includeIngredients: ingredients,
        instructionsRequired: true,
        cuisine: cuisine,
        type: mealtype,
        diet: diet,
        intolerances: intolerances
      })

      setRecipesData(recipes);
    }
    else {
      setRecipesData(null);
    }
  }

  const reroute = () => {
    navigate(routes.favorites);
  }

  return (  
    <>
      <div className={styles.search}>
        <label htmlFor="ingredients">Enter one or more ingredients:</label>
        <input
          id='ingredients'
          type='text'
          placeholder='e.g. "egg, butter, ham"'
          spellCheck={false}
          onChange={handleIngredients} 
        />

        <div className={styles.filters}>
          <Filter filterName="Cuisine" onChange={handleCusine} options={cuisineOptions}/>
          <Filter filterName="Meal Type" onChange={handleMealType} options={typeOptions}/>
          <Filter filterName="Diet" onChange={handleDiet} options={dietOptions}/>
          <Filter filterName="Intolerances" onChange={handleIntolerances} options={intolerancesOptions}/>
        </div>

        <button onClick={getRecipesData} className={styles.getRecipes}>Get Recipes</button>
        {recipesData && `Number of results found: ${recipesData.totalResults}.`}
      </div>
      <button onClick={reroute} className={styles.favorites}>Favorites</button>
      {recipesData && <RecipesList recipesData={recipesData}/>}
    </>    
  );
}

export default Search